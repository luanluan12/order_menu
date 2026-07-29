import { useEffect, useState } from "react";
import { CheckCircle2, QrCode, X } from "lucide-react";
import { toast } from "react-toastify";
import socket from "../../socket";
import { getTodayCheckins, getTodayQr } from "../../api/checkinApi";

function CheckinQrModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [qr, setQr] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [queue, setQueue] = useState([]);
  const [currentCheckin, setCurrentCheckin] = useState(null);

  useEffect(() => {
    if (!open) {
      setQr(null);
      setCheckins([]);
      setQueue([]);
      setCurrentCheckin(null);
      return;
    }

    loadQr();
    loadTodayCheckins();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleCheckinSuccess = (data) => {
      setCheckins((prev) => [{ ...data, isNew: true }, ...prev]);
      setQueue((prev) => [...prev, data]);
    };

    socket.on("checkin-success", handleCheckinSuccess);

    return () => {
      socket.off("checkin-success", handleCheckinSuccess);
    };
  }, [open]);

  useEffect(() => {
    if (currentCheckin || queue.length === 0) return;

    const next = queue[0];

    setCurrentCheckin(next);
    setQueue((prev) => prev.slice(1));

    const timer = setTimeout(() => {
      setCurrentCheckin(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [queue, currentCheckin]);

  useEffect(() => {
    if (checkins.length === 0 || !checkins[0].isNew) return;

    const timer = setTimeout(() => {
      setCheckins((prev) =>
        prev.map((item, index) =>
          index === 0 ? { ...item, isNew: false } : item,
        ),
      );
    }, 10000);

    return () => clearTimeout(timer);
  }, [checkins]);

  const loadQr = async () => {
    try {
      setLoading(true);
      const res = await getTodayQr();
      setQr(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Không tải được QR.");
    } finally {
      setLoading(false);
    }
  };

  const loadTodayCheckins = async () => {
    try {
      const res = await getTodayCheckins();
      setCheckins(res.data.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Không tải được danh sách check-in.",
      );
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-6">
      <div className="flex h-[calc(100vh-1.5rem)] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl sm:h-[calc(100vh-3rem)]">
        <div className="flex shrink-0 items-center justify-between border-b bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4 text-white sm:px-8 sm:py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/20 p-2">
              <QrCode className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>

            <div>
              <h2 className="text-xl font-extrabold sm:text-2xl">
                QR nhận suất ăn
              </h2>
              <p className="text-sm text-orange-100">
                Đưa màn hình này để nhân viên quét mã
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Đóng"
            className="rounded-xl bg-white/15 p-3 transition hover:bg-white/25"
          >
            <X className="h-7 w-7" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:overflow-hidden">
          {loading ? (
            <div className="flex h-full items-center justify-center text-lg font-semibold text-gray-600">
              Đang tải QR...
            </div>
          ) : (
            qr && (
              <div className="grid h-full gap-6 lg:grid-cols-[minmax(280px,0.58fr)_minmax(600px,1.42fr)]">
                <section className="flex min-h-0 flex-col items-center justify-center rounded-3xl border border-orange-100 bg-white p-5 shadow-sm sm:p-8">
                  <div className="mb-5 text-center">
                    <p className="text-lg font-bold text-slate-800 sm:text-2xl">
                      Quét mã để nhận món
                    </p>
                    <p className="mt-1 text-sm text-slate-500 sm:text-base">
                      Đưa QR này cho người phát món
                    </p>
                  </div>

                  <img
                    src={qr.qrImage}
                    alt="QR Check-in"
                    className="aspect-square w-full max-w-[min(42vw,20rem)] rounded-3xl border-4 border-orange-200 bg-white p-3 shadow-lg"
                  />

                  <div className="mt-6 grid w-full max-w-xl grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-100 px-4 py-3 text-center sm:py-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 sm:text-sm">
                        Hôm nay
                      </div>
                      <div className="mt-1 text-base font-extrabold text-slate-800 sm:text-xl">
                        {new Date().toLocaleDateString("vi-VN")}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-orange-100 px-4 py-3 text-center sm:py-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-orange-700 sm:text-sm">
                        Tầng
                      </div>
                      <div className="mt-1 text-2xl font-extrabold text-orange-600 sm:text-3xl">
                        {qr.floor}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="flex min-h-[420px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:min-h-0">
                  <div className="shrink-0 border-b px-5 py-4 sm:px-6">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-extrabold text-slate-800 sm:text-xl">
                        Đã nhận hôm nay
                      </h3>

                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                        {checkins.length} người
                      </span>
                    </div>
                  </div>

                  <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
                    {checkins.length === 0 ? (
                      <div className="rounded-2xl bg-slate-50 p-6 text-center text-base text-slate-500">
                        Chưa có ai nhận suất ăn.
                      </div>
                    ) : (
                      checkins.map((item, index) => (
                        <div
                          key={item.orderId || index}
                          className={`rounded-2xl border p-4 transition-all sm:p-5 ${
                            item.isNew
                              ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              {item.isNew && (
                                <div className="mb-2 inline-flex animate-pulse items-center gap-2 rounded-full bg-green-600 px-3 py-1 text-xs font-extrabold text-white">
                                  <span className="h-2 w-2 rounded-full bg-white" />
                                  VỪA NHẬN
                                </div>
                              )}

                              <p className="text-xl text-lg font-extrabold text-slate-800">
                                {item.employee.name}
                              </p>
                              <p className="mt-1 text-sm font-medium text-slate-500">
                                Tầng {item.employee.floor}
                              </p>
                            </div>

                            <span className="shrink-0 text-sm font-bold text-orange-600">
                              {new Date(item.receivedAt).toLocaleTimeString(
                                "vi-VN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          </div>

                          <div className="mt-3 space-y-1 border-t pt-3 text-base text-xl font-medium text-slate-700">
                            {item.mains?.map((food, i) => (
                              <div key={i}>
                                {food.name}
                                {food.quantity > 1 && ` × ${food.quantity}`}
                              </div>
                            ))}
                            {item.soup && <div>{item.soup.name}</div>}
                            {item.drink && <div>{item.drink.name}</div>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckinQrModal;
