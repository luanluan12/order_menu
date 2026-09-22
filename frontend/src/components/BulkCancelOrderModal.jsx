import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  bulkCancelOrderDays,
  getBulkCancelOptions,
  previewBulkCancel,
} from "../api/orderApi";

const parseEmployeeIds = (value) => [
  ...new Set(
    value
      .split(/[\s,;]+/)
      .map((item) => item.trim().toUpperCase())
      .filter(Boolean),
  ),
];

const formatDate = (value) =>
  new Date(`${value}T12:00:00`).toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  });

function BulkCancelOrderModal({ open, onClose, onSuccess }) {
  const [menus, setMenus] = useState([]);
  const [menuId, setMenuId] = useState("");
  const [dates, setDates] = useState([]);
  const [employeeText, setEmployeeText] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectedMenu = useMemo(
    () => menus.find((menu) => menu._id === menuId),
    [menuId, menus],
  );
  const employeeIds = useMemo(
    () => parseEmployeeIds(employeeText),
    [employeeText],
  );

  useEffect(() => {
    if (!open) return;

    const loadOptions = async () => {
      try {
        setLoading(true);
        setDates([]);
        setEmployeeText("");
        setPreview(null);
        const response = await getBulkCancelOptions();
        const items = response.data.data || [];
        setMenus(items);
        setMenuId(items[0]?._id || "");
      } catch (err) {
        toast.error(err.response?.data?.message || "Không tải được danh sách menu.");
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, [open]);

  const menuDates = (selectedMenu?.days || []).map((day) =>
    new Date(day.date).toLocaleDateString("en-CA", {
      timeZone: "Asia/Ho_Chi_Minh",
    }),
  );

  const toggleDate = (date) => {
    setPreview(null);
    setDates((current) =>
      current.includes(date)
        ? current.filter((item) => item !== date)
        : [...current, date],
    );
  };

  const payload = { menuId, dates, employeeIds };

  const handlePreview = async () => {
    if (!menuId || dates.length === 0 || employeeIds.length === 0) {
      toast.error("Vui lòng chọn menu, ngày và nhập mã nhân viên.");
      return;
    }

    try {
      setLoading(true);
      const response = await previewBulkCancel(payload);
      setPreview(response.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể xem trước dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!preview?.affectedCount) return;

    const confirmed = window.confirm(
      `Xác nhận hủy món theo ngày cho ${preview.affectedCount} nhân viên?`,
    );
    if (!confirmed) return;

    try {
      setSubmitting(true);
      const response = await bulkCancelOrderDays(payload);
      toast.success(response.data.message);
      onSuccess?.();
      onClose?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Hủy món hàng loạt thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-5">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">Huỷ món hàng loạt theo ngày</h2>
            <p className="mt-1 text-sm text-gray-500">
              Giữ nguyên đơn và các ngày không được chọn.
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg px-3 py-2 hover:bg-gray-100">
            Đóng
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <label className="mb-2 block font-semibold">Menu</label>
            <select
              value={menuId}
              onChange={(event) => {
                setMenuId(event.target.value);
                setDates([]);
                setPreview(null);
              }}
              disabled={loading}
              className="w-full rounded-xl border bg-white px-4 py-3"
            >
              {menus.map((menu) => (
                <option key={menu._id} value={menu._id}>
                  {menu.week}{menu.year ? ` - ${menu.year}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-semibold">Ngày cần huỷ món</label>
            <div className="grid gap-2 sm:grid-cols-5">
              {menuDates.map((date) => (
                <label
                  key={date}
                  className={`cursor-pointer rounded-xl border p-3 text-center text-sm capitalize ${
                    dates.includes(date)
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={dates.includes(date)}
                    onChange={() => toggleDate(date)}
                    className="sr-only"
                  />
                  {formatDate(date)}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block font-semibold">Mã nhân viên</label>
            <textarea
              value={employeeText}
              onChange={(event) => {
                setEmployeeText(event.target.value);
                setPreview(null);
              }}
              rows={7}
              placeholder={"Dán danh sách mã nhân viên, mỗi mã một dòng\nNV001\nNV002\nNV003"}
              className="w-full rounded-xl border p-4 font-mono outline-none focus:border-red-500"
            />
            <p className="mt-2 text-sm text-gray-500">
              Đã nhập {employeeIds.length} mã; hỗ trợ phân cách bằng xuống dòng, dấu phẩy hoặc dấu chấm phẩy.
            </p>
          </div>

          <button
            onClick={handlePreview}
            disabled={loading}
            className="w-full rounded-xl bg-slate-700 px-5 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Đang kiểm tra..." : "Xem trước kết quả"}
          </button>

          {preview && (
            <div className="space-y-4 rounded-2xl border bg-gray-50 p-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-white p-4">
                  <p className="text-sm text-gray-500">Mã đã nhập</p>
                  <p className="mt-1 text-2xl font-bold">{preview.requestedCount}</p>
                </div>
                <div className="rounded-xl bg-red-50 p-4">
                  <p className="text-sm text-red-600">Đơn sẽ thay đổi</p>
                  <p className="mt-1 text-2xl font-bold text-red-700">{preview.affectedCount}</p>
                </div>
                <div className="rounded-xl bg-white p-4">
                  <p className="text-sm text-gray-500">Ngày đã chọn</p>
                  <p className="mt-1 text-2xl font-bold">{preview.dates.length}</p>
                </div>
              </div>

              {preview.missingEmployeeIds.length > 0 && (
                <p className="text-sm text-amber-700">
                  Không tìm thấy nhân viên: {preview.missingEmployeeIds.join(", ")}
                </p>
              )}
              {preview.noOrderEmployeeIds.length > 0 && (
                <p className="text-sm text-amber-700">
                  Chưa có đơn trong menu: {preview.noOrderEmployeeIds.join(", ")}
                </p>
              )}
              {preview.receivedDays.length > 0 && (
                <p className="text-sm text-amber-700">
                  Có {preview.receivedDays.length} ngày đã nhận món và sẽ được bỏ qua.
                </p>
              )}

              <div className="max-h-52 overflow-y-auto rounded-xl border bg-white">
                {preview.affectedUsers.map((item) => (
                  <div key={item.employeeId} className="border-b px-4 py-3 last:border-0">
                    <span className="font-semibold">{item.employeeId} — {item.name}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      {item.dates.map(formatDate).join(", ")}
                    </span>
                  </div>
                ))}
                {preview.affectedUsers.length === 0 && (
                  <p className="p-5 text-center text-gray-500">Không có món nào cần huỷ.</p>
                )}
              </div>

              <button
                onClick={handleConfirm}
                disabled={submitting || preview.affectedCount === 0}
                className="w-full rounded-xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {submitting
                  ? "Đang huỷ món..."
                  : `Xác nhận huỷ món cho ${preview.affectedCount} nhân viên`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BulkCancelOrderModal;
