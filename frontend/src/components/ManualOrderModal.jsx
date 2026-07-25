import { useEffect, useMemo, useState } from "react";
import { X, Search } from "lucide-react";
import { toast } from "react-toastify";
import WeekMenuContent from "./WeekMenuContent";
import { getAvailableUsers, createManualOrder } from "../api/orderApi";

function ManualOrderModal({ open, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState(null);
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!open) return;

    setSelectedUser(null);
    setKeyword("");
    loadUsers();
  }, [open]);

  const loadUsers = async () => {
    try {
      setLoading(true);

      // Backend tự lấy menu Publish mới nhất
      const res = await getAvailableUsers();

      setUsers(res.data.data.users);
      setMenu(res.data.data.menu);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Không tải được danh sách nhân viên.",
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const text = keyword.trim().toLowerCase();

    if (!text) return users;

    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(text) ||
        u.employeeId.toLowerCase().includes(text) ||
        u.email.toLowerCase().includes(text),
    );
  }, [users, keyword]);

  const submitManual = async (days) => {
    try {
      await createManualOrder({
        userId: selectedUser._id,
        menuId: menu._id,
        days,
      });

      toast.success("Đặt hộ thành công.");

      onSuccess?.();
      onClose?.();

      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Đặt hộ thất bại.");

      return false;
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[95vh] w-full max-w-7xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-8 py-5">
          <div>
            <h2 className="text-2xl font-bold">Đặt hộ</h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-gray-100"
          >
            <X />
          </button>
        </div>

        {!selectedUser ? (
          <div className="flex-1 overflow-hidden">
            <div className="border-b p-6">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Tìm theo mã NV, tên hoặc email..."
                  className="w-full rounded-2xl border pl-12 pr-4 py-3 outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-6">
              {loading ? (
                <div className="py-20 text-center">Đang tải...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="py-20 text-center text-gray-400">
                  Không còn nhân viên nào chưa đặt.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredUsers.map((user) => (
                    <button
                      key={user._id}
                      onClick={() => setSelectedUser(user)}
                      className="rounded-2xl border p-5 text-left transition hover:border-orange-500 hover:bg-orange-50"
                    >
                      <h3 className="text-lg font-bold">{user.name}</h3>

                      <p className="mt-2 text-sm text-gray-500">
                        {user.employeeId}
                      </p>

                      <p className="text-sm text-gray-500">{user.email}</p>

                      <span className="mt-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
                        Tầng {user.floor}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto">
            <div className="border-b bg-orange-50 px-8 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold">{selectedUser.name}</h3>

                  <p className="text-sm text-gray-600">
                    {selectedUser.employeeId} • Tầng {selectedUser.floor}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="rounded-xl border px-4 py-2 hover:bg-white"
                >
                  Đổi nhân viên
                </button>
              </div>
            </div>

            {menu && (
              <WeekMenuContent
                menu={menu}
                isManualOrder
                editable
                submitText="Đặt hộ"
                onSubmit={submitManual}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManualOrderModal;
