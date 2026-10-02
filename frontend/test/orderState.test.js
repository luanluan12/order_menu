import { test } from "node:test";
import assert from "node:assert/strict";
import { applyConfirmedCheckin } from "../src/utils/orderState.js";

test("confirmed check-in updates only the selected day with server time and preserves other rows", () => {
  const day = { date: "2026-10-02T00:00:00Z", received: false, mains: [{ name: "Rice" }] };
  const otherDay = { date: "2026-10-03T00:00:00Z", received: false };
  const target = { _id: "1", selectedDay: day, days: [day, otherDay] };
  const other = { _id: "2", selectedDay: day, days: [day] };
  const timestamp = "2026-10-02T04:30:00Z";
  const result = applyConfirmedCheckin([other, target], "1", day.date, timestamp);
  assert.equal(result[0]._id, "1");
  assert.equal(result[0].selectedDay.receivedAt, timestamp);
  assert.equal(result[0].days[0].received, true);
  assert.equal(result[0].days[1], otherDay);
  assert.equal(result[1], other);
  assert.equal(target.selectedDay.received, false);
});

test("late response for another date cannot mark the newly selected day as received", () => {
  const day = { date: "2026-10-03T00:00:00Z", received: false };
  const target = { _id: "1", selectedDay: day, days: [day] };
  const result = applyConfirmedCheckin([target], "1", "2026-10-02T00:00:00Z", "2026-10-02T04:30:00Z");
  assert.equal(result[0], target);
  assert.equal(result[0].selectedDay.received, false);
});
