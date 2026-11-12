const { randomUUID } = require("crypto");
const Order = require("../models/Order");
const sendMail = require("../utils/mail");

const LEASE_MS = 120_000;
const MAX_ATTEMPTS = 10;

// Atomic claim supports multiple server processes and recovery after a crash.
function createOrderEmailWorker({ orders = Order, send = sendMail, now = () => new Date() } = {}) {
  return async function processNextEmail() {
    const startedAt = now();
    const lease = randomUUID();
    const order = await orders.findOneAndUpdate(
      { "confirmationEmail.nextAttemptAt": { $lte: startedAt } },
      {
        $set: {
          "confirmationEmail.nextAttemptAt": new Date(startedAt.getTime() + LEASE_MS),
          "confirmationEmail.lease": lease,
        },
        $inc: { "confirmationEmail.attempts": 1 },
      },
      { new: true, timestamps: false },
    ).select("+confirmationEmail").lean();
    if (!order) return false;

    const job = order.confirmationEmail;
    const ownedJob = { _id: order._id, "confirmationEmail.id": job.id, "confirmationEmail.lease": lease };
    try {
      await send({ to: job.to, subject: job.subject, html: job.html }, {
        idempotencyKey: `order-confirmation/${job.id}`,
        signal: AbortSignal.timeout(30_000),
      });
      await orders.updateOne(ownedJob, { $unset: { confirmationEmail: 1 } }, { timestamps: false });
    } catch (error) {
      const failed = job.attempts >= MAX_ATTEMPTS;
      const update = failed
        ? { $set: { "confirmationEmail.failedAt": now() }, $unset: { "confirmationEmail.nextAttemptAt": 1 } }
        : { $set: { "confirmationEmail.nextAttemptAt": new Date(now().getTime() + Math.min(30_000 * 2 ** (job.attempts - 1), 3_600_000)) } };
      await orders.updateOne(ownedJob, update, { timestamps: false });
      console.error(`Order confirmation ${job.id}: ${failed ? "failed after retries" : "retry scheduled"}`, error.message);
    }
    return true;
  };
}

function startOrderEmailWorker() {
  const processNextEmail = createOrderEmailWorker();
  let stopped = false;
  let timer;
  const tick = async () => {
    try {
      await processNextEmail();
    } catch (error) {
      console.error("Order email worker:", error.message);
    } finally {
      // One message per tick bounds concurrency and avoids overlapping local workers.
      if (!stopped) {
        timer = setTimeout(tick, 2000);
        timer.unref();
      }
    }
  };
  void tick();
  return () => { stopped = true; clearTimeout(timer); };
}

module.exports = { createOrderEmailWorker, startOrderEmailWorker };
