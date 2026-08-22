import { useEffect, useState } from "react";
import {
  deleteOrder,
  getOrders,
  getWeekSummary,
  manualCheckin,
} from "../../api/orderApi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import OrderDetailModal from "./OrderDetailModal";
import CheckinQrModal from "./CheckinQrModal";
import { Check } from "lucide-react";
import ManualOrderModal from "../../components/ManualOrderModal";

function OrderManagement() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openScanner, setOpenScanner] = useState(false);
  const getLocalDate = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split("T")[0];
  };
  const [selectedDate, setSelectedDate] = useState(getLocalDate());
  const [keyword, setKeyword] = useState("");
  const [openManualOrder, setOpenManualOrder] = useState(false);
  const [openWeekSummary, setOpenWeekSummary] = useState(false);
  const [weekSummary, setWeekSummary] = useState(null);
  const [weekSummaryLoading, setWeekSummaryLoading] = useState(false);
  const [weekSummaryKeyword, setWeekSummaryKeyword] = useState("");
  const getTodayOrder = (order) => {
    let today = new Date();

    const dayOfWeek = today.getDay();

    // Test giống backend
    if (dayOfWeek === 0) {
      today.setDate(today.getDate() - 2);
    } else if (dayOfWeek === 6) {
      today.setDate(today.getDate() - 1);
    }

    today.setHours(0, 0, 0, 0);

    return order.days?.find((d) => {
      const date = new Date(d.date);
      date.setHours(0, 0, 0, 0);
      return date.getTime() === today.getTime();
    });
  };

  const handleManualCheckin = async (order) => {
    const ok = window.confirm(`Xác nhận ${order.user.name} đã nhận suất ăn?`);

    if (!ok) return;

    try {
      await manualCheckin({
        orderId: order._id,
        date: selectedDate,
      });

      await loadOrders();

      alert("Check-in thành công.");
    } catch (err) {
      alert(err.response?.data?.message || "Check-in thất bại.");
    }
  };

  const receivedCount = orders.filter(
    (order) => order.selectedDay?.received,
  ).length;

  const notReceivedCount = orders.length - receivedCount;
  const filteredOrders = orders.filter((order) => {
    const key = keyword.trim().toLowerCase();

    if (!key) return true;

    return (
      order.user?.name?.toLowerCase().includes(key) ||
      order.user?.email?.toLowerCase().includes(key) ||
      order.user?.employeeId?.toLowerCase().includes(key)
    );
  });

  const exportExcel = () => {
    const data = orders.map((order, index) => {
      const todayOrder = order.selectedDay;

      return {
        STT: index + 1,
        "Nhân viên": order.user?.name,
        Email: order.user?.email,
        Tuần: order.week,
        "Nhận hôm nay": todayOrder?.received ? "Đã nhận" : "Chưa nhận",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, "DanhSachDatMon.xlsx");
  };

  const loadOrders = async () => {
    try {
      const res = await getOrders({
        date: selectedDate,
      });

      const filteredOrders = res.data.data.filter((order) => {
        const day = order.selectedDay;

        if (!day) return false;

        return day.mains?.length > 0 || !!day.drink || !!day.soup;
      });

      setOrders(filteredOrders);
    } catch (err) {
      console.log(err);
    }
  };

  const loadWeekSummary = async () => {
    try {
      setWeekSummaryLoading(true);
      const res = await getWeekSummary(selectedDate);
      setWeekSummary(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Không tải được danh sách đặt món.");
      setOpenWeekSummary(false);
    } finally {
      setWeekSummaryLoading(false);
    }
  };

  const openWeekOrders = () => {
    setWeekSummaryKeyword("");
    setOpenWeekSummary(true);
    loadWeekSummary();
  };

  const weekSummaryOrders = (weekSummary?.orders || []).filter((order) => {
    const search = weekSummaryKeyword.trim().toLowerCase();

    if (!search) return true;

    return [order.user?.name, order.user?.email, order.user?.employeeId].some(
      (value) => value?.toLowerCase().includes(search),
    );
  });

  const handleDeleteOrder = async (order) => {
    const name = order.user?.name || "nhân viên này";
    const email = order.user?.email || "";
    const confirmed = window.confirm(
      `Xóa vĩnh viễn order của ${name}${email ? ` (${email})` : ""}?`,
    );

    if (!confirmed) return;

    try {
      await deleteOrder(order._id);
      setWeekSummary((current) =>
        current
          ? {
              ...current,
              orders: current.orders.filter((item) => item._id !== order._id),
            }
          : current,
      );
      await loadOrders();
      alert("Đã xóa order.");
    } catch (err) {
      alert(err.response?.data?.message || "Xóa order thất bại.");
    }
  };

  useEffect(() => {
    loadOrders();
  }, [selectedDate]);

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div />

        {(user?.role === "admin_eocmn" || user?.role === "admin_floor") && (
          <div className="flex flex-wrap gap-3">
            {user?.role === "admin_eocmn" && (
              <button
                onClick={() => setOpenManualOrder(true)}
                className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                + Đặt hộ
              </button>
            )}

            <button
              onClick={() => setOpenScanner(true)}
              className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              QR Check-in
            </button>
            <button
              onClick={openWeekOrders}
              className="rounded-xl bg-slate-700 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Người đặt cả tuần
            </button>
          </div>
        )}
      </div>

      {/* Thống kê */}

      <div className="mb-6 grid grid grid-cols-1 gap-4 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Tổng đơn</p>
          <p className="mt-2 text-3xl font-bold">{orders.length}</p>
        </div>

        <div className="rounded-xl border bg-green-50 p-5 shadow">
          <p className="text-sm text-green-600">Đã nhận hôm nay</p>
          <p className="mt-2 text-3xl font-bold text-green-700">
            {receivedCount}
          </p>
        </div>

        <div className="rounded-xl border bg-orange-50 p-5 shadow">
          <p className="text-sm text-orange-600">Chưa nhận hôm nay</p>
          <p className="mt-2 text-3xl font-bold text-orange-700">
            {notReceivedCount}
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="🔍 Tìm tên, email hoặc mã nhân viên..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full rounded-xl border p-3 sm:max-w-md"
        />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full rounded-xl border p-3 sm:w-auto"
        />
      </div>

      <div className="hidden overflow-hidden rounded-2xl border bg-white shadow lg:block">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">STT</th>

              <th className="p-4 text-left">Nhân viên</th>

              <th className="p-4 text-left">Email</th>

              <th className="p-4 text-center">Tầng</th>

              <th className="p-4 text-center">Tuần</th>

              <th className="p-4 text-center">Nhận hôm nay</th>
              <th className="p-4 text-center">Check-in</th>

              <th className="p-4 text-center">Chi tiết</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-gray-400">
                  Chưa có đơn đặt món.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, index) => {
                const todayOrder = order.selectedDay;

                return (
                  <tr key={order._id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{index + 1}</td>

                    <td className="p-4">{order.user?.name}</td>

                    <td className="p-4">{order.user?.email}</td>

                    <td className="p-4 text-center">{order.user?.floor}</td>

                    <td className="p-4 text-center">{order.week}</td>

                    <td className="p-4 text-center">
                      <span
                        title={
                          todayOrder?.receivedAt
                            ? new Date(todayOrder.receivedAt).toLocaleString(
                                "vi-VN",
                              )
                            : ""
                        }
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          todayOrder?.received
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {todayOrder?.received ? "Đã nhận" : "Chưa nhận"}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      {todayOrder?.received ? (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-green-100 px-3 py-2 text-sm font-semibold text-green-700">
                          <Check size={16} />
                          Đã nhận
                        </span>
                      ) : (
                        <button
                          onClick={() => handleManualCheckin(order)}
                          className="rounded-lg bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-600"
                        >
                          Check-in
                        </button>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <OrderDetailModal
          open={!!selectedOrder}
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      </div>
      <div className="space-y-4 lg:hidden">
        {filteredOrders.length === 0 ? (
          <div className="rounded-xl bg-white p-6 text-center shadow">
            Chưa có đơn đặt món.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const day = order.selectedDay;

            return (
              <div key={order._id} className="rounded-2xl bg-white p-5 shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold">{order.user?.name}</h2>

                    <p className="text-sm text-gray-500">{order.user?.email}</p>
                  </div>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
                    Tầng {order.user?.floor}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tuần</span>

                    <span>{order.week}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Trạng thái</span>

                    <span>{day?.received ? "✅ Đã nhận" : "⏳ Chưa nhận"}</span>
                  </div>

                  {day?.receivedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Thời gian</span>

                      <span>
                        {new Date(day.receivedAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  )}
                </div>
                {!day?.received && (
                  <button
                    onClick={() => handleManualCheckin(order)}
                    className="mt-4 w-full rounded-lg bg-orange-500 py-2 font-semibold text-white hover:bg-orange-600"
                  >
                    Check-in
                  </button>
                )}

                <button
                  onClick={() => setSelectedOrder(order)}
                  className="mt-5 w-full rounded-lg bg-blue-600 py-2 text-white"
                >
                  Xem chi tiết
                </button>
              </div>
            );
          })
        )}
      </div>
      <OrderDetailModal
        open={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
      <CheckinQrModal
        open={openScanner}
        onClose={() => setOpenScanner(false)}
      />
      <ManualOrderModal
        open={openManualOrder}
        onClose={() => setOpenManualOrder(false)}
        onSuccess={() => {
          loadOrders();
        }}
      />
      {openWeekSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="text-xl font-bold">Người đã đặt món cả tuần</h2>
                {weekSummary && (
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(`${weekSummary.weekStart}T00:00:00`).toLocaleDateString("vi-VN")} - {new Date(`${weekSummary.weekEnd}T00:00:00`).toLocaleDateString("vi-VN")}
                  </p>
                )}
              </div>
              <button
                onClick={() => setOpenWeekSummary(false)}
                className="rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                Đóng
              </button>
            </div>
            <div className="max-h-[calc(85vh-80px)] overflow-y-auto p-5">
              {weekSummaryLoading ? (
                <p className="py-10 text-center text-gray-500">Đang tải...</p>
              ) : weekSummary?.orders?.length ? (
                <div className="overflow-x-auto">
                  <div className="mb-4 flex min-w-[620px] gap-2">
                    <input
                      type="search"
                      value={weekSummaryKeyword}
                      onChange={(event) => setWeekSummaryKeyword(event.target.value)}
                      placeholder="Tìm tên, email hoặc mã nhân viên..."
                      className="w-full rounded-lg border px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() => setWeekSummaryKeyword(weekSummaryKeyword.trim())}
                      className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                    >
                      Tìm kiếm
                    </button>
                  </div>
                  <table className="w-full min-w-[620px]">
                    <thead className="border-b bg-gray-50 text-left text-sm text-gray-600">
                      <tr>
                        <th className="p-3">Nhân viên</th>
                        <th className="p-3">Email</th>
                        <th className="p-3 text-center">Tầng</th>
                        <th className="p-3 text-center">Tuần</th>
                        <th className="p-3 text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weekSummaryOrders.map((order) => (
                        <tr key={order._id} className="border-b last:border-0">
                          <td className="p-3 font-medium">{order.user?.name || "Đã xóa user"}</td>
                          <td className="p-3 text-gray-600">{order.user?.email || "-"}</td>
                          <td className="p-3 text-center">{order.user?.floor ?? "-"}</td>
                          <td className="p-3 text-center">{order.week}</td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleDeleteOrder(order)}
                              className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                            >
                              Xóa order
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {weekSummaryOrders.length === 0 && (
                    <p className="py-8 text-center text-gray-500">
                      Không tìm thấy người phù hợp.
                    </p>
                  )}
                </div>
              ) : (
                <p className="py-10 text-center text-gray-500">Chưa có ai đặt món trong tuần này.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderManagement;
