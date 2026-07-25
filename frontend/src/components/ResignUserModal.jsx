import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { resignUser } from "../api/userApi";

function ResignUserModal({ open, user, onClose, onSuccess }) {
  const [date, setDate] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const today = new Date();

    const yyyy = today.getFullYear();

    const mm = String(today.getMonth() + 1).padStart(2, "0");

    const dd = String(today.getDate()).padStart(2, "0");

    setDate(`${yyyy}-${mm}-${dd}`);
  }, [open]);

  const handleSubmit = async () => {
    if (!date) {
      return toast.error("Vui lòng chọn ngày nghỉ việc.");
    }

    try {
      setLoading(true);

      await resignUser(user._id, {
        date,
      });

      toast.success("Đã cập nhật nghỉ việc.");

      onSuccess?.();

      onClose?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header */}

        <div className="border-b px-8 py-6">
          <h2 className="text-2xl font-bold">Nghỉ việc</h2>

          <p className="mt-2 text-gray-500">Hủy suất ăn và khóa tài khoản</p>
        </div>

        {/* Body */}

        <div className="space-y-6 p-8">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Nhân viên
            </label>

            <div className="rounded-xl border bg-gray-50 px-4 py-3">
              <div className="font-bold">{user.name}</div>

              <div className="mt-1 text-sm text-gray-500">
                {user.employeeId}
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Ngày nghỉ việc
            </label>

            <input
              type="date"
              value={date}
              min={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border p-3 outline-none focus:border-orange-500"
            />
          </div>

          <div className="rounded-xl bg-orange-50 p-4 text-sm leading-7 text-gray-700">
            <div>✓ Hủy toàn bộ suất ăn từ ngày được chọn.</div>

            <div>✓ Đến đúng ngày này tài khoản sẽ tự bị khóa.</div>

            <div>✓ Các ngày trước đó vẫn giữ nguyên.</div>
          </div>
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t px-8 py-5">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl bg-gray-200 px-6 py-3 hover:bg-gray-300"
          >
            Hủy
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Đang xử lý..." : "Xác nhận nghỉ việc"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResignUserModal;
