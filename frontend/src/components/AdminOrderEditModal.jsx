import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

import { adminUpdateOrder } from "../api/orderApi";
import WeekMenuContent from "./WeekMenuContent";

function AdminOrderEditModal({ open, order, onClose, onSuccess }) {
  const [saving, setSaving] = useState(false);

  if (!open || !order?.menu) return null;

  const submit = async (days) => {
    try {
      setSaving(true);
      const response = await adminUpdateOrder(order._id, { days });

      toast.success("Đã cập nhật đơn của nhân viên.");
      onSuccess?.(response.data.data);
      onClose?.();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Cập nhật đơn thất bại.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
      <div className="flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4 sm:px-8">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">Sửa đơn đặt hộ</h2>
            <p className="mt-1 text-sm text-gray-500">
              {order.user?.name} • {order.user?.employeeId} • {order.week}
            </p>
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-gray-100 disabled:opacity-50"
            aria-label="Đóng"
          >
            <X />
          </button>
        </div>

        <div className="overflow-y-auto">
          <WeekMenuContent
            menu={order.menu}
            initialOrder={order}
            editable
            isAdminEdit
            submitText="update_order"
            onSubmit={submit}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminOrderEditModal;
