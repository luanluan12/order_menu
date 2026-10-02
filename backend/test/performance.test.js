const { test } = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Menu = require("../models/Menu");
const User = require("../models/User");
const controller = require("../controllers/orderController");
const reports = require("../controllers/reportController");
const { createOrderEmailWorker } = require("../services/orderEmailWorker");
const jwt = require("jsonwebtoken");

function response() {
  return { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { this.body = JSON.parse(JSON.stringify(body)); return this; } };
}
function query(result) {
  return { select() { return this; }, lean() { return this; }, populate() { return this; }, sort() { return this; }, then(resolve, reject) { return Promise.resolve(result).then(resolve, reject); } };
}

for (const invite of [false, true]) test(`order and durable email are saved together (${invite ? "invite" : "login"}); private payload is excluded`, async (t) => {
  process.env.JWT_SECRET = "unit-test-only";
  const user = new User({ name: "Test", email: "test@example.com", language: "ko" });
  const menu = new Menu({ week: "2026-W40", year: 2026, status: "published", openTime: new Date(), deadline: new Date(Date.now() + 86400000), days: Array.from({ length: 5 }, (_, i) => ({ date: new Date(2026, 9, 5 + i), mains: [{ name: "Rice", type: "normal" }] })) });
  t.mock.method(Menu, "findById", async () => menu);
  t.mock.method(User, "findById", async () => user);
  t.mock.method(Order, "findOne", async () => null);
  let stored;
  t.mock.method(Order.prototype, "save", async function () { await this.validate(); stored = this.toObject(); return this; });
  const days = menu.days.map(day => ({ mains: [{ dishId: String(day.mains[0]._id), quantity: 1 }] }));
  const res = response();
  const token = jwt.sign({ userId: String(user._id), menuId: String(menu._id) }, process.env.JWT_SECRET);
  await (invite ? controller.createOrderFromInvite : controller.createOrder)({ user: { id: user._id }, body: { menuId: menu._id, token, days } }, res);
  assert.equal(res.statusCode, 201);
  assert.equal(stored.confirmationEmail.to, user.email);
  assert.match(stored.confirmationEmail.subject, /식사 주문 완료/);
  assert.ok(stored.confirmationEmail.nextAttemptAt instanceof Date);
  assert.ok(stored.confirmationEmail.html.includes("Rice"));
  assert.equal(res.body.data.confirmationEmail, undefined);
});

test("worker retries provider failures with the same key, then removes only the claimed job", async () => {
  let job = { id: "stable-key", to: "a@example.com", subject: "Order", html: "Saved", attempts: 0 };
  let clock = new Date("2026-10-02T00:00:00Z");
  let updates = [];
  let keys = [];
  const orders = {
    findOneAndUpdate(filter, update) {
      assert.equal(filter["confirmationEmail.nextAttemptAt"].$lte, clock);
      job = { ...job, attempts: job.attempts + 1, lease: update.$set["confirmationEmail.lease"] };
      return query({ _id: "order-id", confirmationEmail: job });
    },
    async updateOne(filter, update) {
      assert.equal(filter["confirmationEmail.id"], job.id);
      assert.equal(filter["confirmationEmail.lease"], job.lease);
      updates.push(update);
    },
  };
  const processNext = createOrderEmailWorker({ orders, now: () => clock, send: async (_, options) => {
    keys.push(options.idempotencyKey);
    assert.ok(options.signal instanceof AbortSignal);
    if (keys.length === 1) throw new Error("provider unavailable");
  } });
  await processNext();
  assert.equal(updates[0].$set["confirmationEmail.nextAttemptAt"].getTime(), clock.getTime() + 30000);
  clock = new Date(clock.getTime() + 30000);
  await processNext();
  assert.deepEqual(keys, ["order-confirmation/stable-key", "order-confirmation/stable-key"]);
  assert.deepEqual(updates[1], { $unset: { confirmationEmail: 1 } });
});

test("worker preserves exhausted jobs for diagnosis without repeatedly sending", async () => {
  let update;
  const processNext = createOrderEmailWorker({
    orders: {
      findOneAndUpdate(_filter, change) { return query({ _id: "1", confirmationEmail: { id: "job", attempts: 10, lease: change.$set["confirmationEmail.lease"] } }); },
      async updateOne(_filter, change) { update = change; },
    },
    send: async () => { throw new Error("permanent failure"); },
  });
  await processNext();
  assert.ok(update.$set["confirmationEmail.failedAt"] instanceof Date);
  assert.equal(update.$unset["confirmationEmail.nextAttemptAt"], 1);
});

test("idle worker never calls the mail provider", async () => {
  const processNext = createOrderEmailWorker({ orders: { findOneAndUpdate: () => query(null) }, send: () => { assert.fail("unexpected email"); } });
  assert.equal(await processNext(), false);
});

for (const method of ["getDailyReport", "getLeftoverReport", "exportDailyExcel", "exportLeftoverExcel"]) test(`${method} queries a Vietnam day, not full menu history`, async (t) => {
  let filter;
  t.mock.method(Menu, "find", f => { filter = f; return query([]); });
  const res = response();
  await reports[method]({ query: { date: "2026-10-02" }, user: { role: "admin_eocmn" } }, res);
  assert.equal(res.statusCode, 404);
  assert.equal(filter.days.$elemMatch.date.$gte.toISOString(), "2026-10-01T17:00:00.000Z");
  assert.equal(filter.days.$elemMatch.date.$lt.toISOString(), "2026-10-02T17:00:00.000Z");
});

test("daily report preserves totals and floor permissions", async (t) => {
  const id = new mongoose.Types.ObjectId();
  const user = { _id: new mongoose.Types.ObjectId(), name: "Test", employeeId: "1", floor: 3, email: "test@example.com" };
  const day = { date: new Date("2026-10-02T01:00:00Z"), mains: [{ _id: id, dishId: id, name: "Rice", quantity: 2 }], soups: [], drinks: [], received: false };
  t.mock.method(Menu, "find", () => query([{ week: "W40", days: [day] }]));
  t.mock.method(User, "find", filter => { assert.equal(filter.floor, 3); return query([user]); });
  t.mock.method(Order, "find", filter => { assert.equal(filter.week, "W40"); assert.equal(filter.status, "ordered"); assert.deepEqual(filter.user.$in, [user._id]); return query([{ user, days: [day] }]); });
  const res = response();
  await reports.getDailyReport({ query: { date: "2026-10-02" }, user: { role: "admin_floor", floor: 3 } }, res);
  assert.equal(res.body.data.totals.Rice, 2);
  assert.equal(res.body.data.rows.length, 1);
  assert.equal(res.body.data.floors[0].total, 1);
});

test("invoice query uses date range and still excludes out-of-range days", async (t) => {
  let filter;
  const user = { employeeId: "1", name: "Test", email: "test@example.com", floor: 3 };
  t.mock.method(Order, "find", f => { filter = f; return query([{ user, days: [
    { date: new Date("2026-10-01T16:59:59Z"), mains: [{ name: "Outside", quantity: 1 }] },
    { date: new Date("2026-10-01T17:00:00Z"), mains: [{ name: "Inside", quantity: 1 }] },
  ] }]); });
  const res = response();
  await reports.getInvoiceReport({ query: { from: "2026-10-02", to: "2026-10-02" }, user: { role: "admin_eocmn" } }, res);
  assert.equal(filter.days.$elemMatch.date.$gte.toISOString(), "2026-10-01T17:00:00.000Z");
  assert.equal(filter.days.$elemMatch.date.$lte.toISOString(), "2026-10-02T16:59:59.999Z");
  assert.equal(res.body.data.rows.length, 1);
  assert.equal(res.body.data.rows[0].food, "Inside x1");
});
