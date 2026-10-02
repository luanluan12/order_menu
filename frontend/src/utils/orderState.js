export function applyConfirmedCheckin(orders, orderId, dayDate, receivedAt) {
  return orders.map((item) => {
    if (item._id !== orderId || item.selectedDay?.date !== dayDate) return item;
    const selectedDay = { ...item.selectedDay, received: true, receivedAt };
    return {
      ...item,
      selectedDay,
      days: item.days.map((day) => day.date === dayDate ? selectedDay : day),
    };
  }).sort((a, b) => Number(b.selectedDay?.received) - Number(a.selectedDay?.received));
}
