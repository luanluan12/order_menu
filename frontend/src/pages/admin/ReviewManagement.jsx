import { useEffect, useMemo, useState } from "react";

import {
  Calendar,
  Loader2,
  MessageSquare,
  Star,
  Users,
  Trophy,
} from "lucide-react";

import { getReviews } from "../../api/orderApi";

function ReviewManagement() {
  const [week, setWeek] = useState("");

  const [loading, setLoading] = useState(false);

  const [reviews, setReviews] = useState([]);

  const loadReviews = async () => {
    try {
      setLoading(true);

      const res = await getReviews({
        week,
      });

      setReviews(res.data.data);
    } catch (err) {
      alert(
        err.response?.data?.message || "Không tải được danh sách đánh giá.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const average = useMemo(() => {
    if (!reviews.length) return 0;

    return (
      reviews.reduce(
        (sum, item) => sum + item.rating,

        0,
      ) / reviews.length
    ).toFixed(1);
  }, [reviews]);

  const highest = useMemo(() => {
    if (!reviews.length) return 0;

    return Math.max(...reviews.map((item) => item.rating));
  }, [reviews]);

  const lowest = useMemo(() => {
    if (!reviews.length) return 0;

    return Math.min(...reviews.map((item) => item.rating));
  }, [reviews]);

  const getColor = (rating) => {
    if (rating >= 9) {
      return "bg-green-100 text-green-700";
    }

    if (rating >= 7) {
      return "bg-blue-100 text-blue-700";
    }

    if (rating >= 5) {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-red-100 text-red-700";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-4 px-8 py-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100">
              <Star className="text-yellow-600" size={28} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">Reviews</h1>

              <p className="mt-1 text-sm text-slate-500">
                Đánh giá chất lượng bữa ăn
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Calendar size={16} />
                Tuần
              </label>

              <input
                type="week"
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                className="rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <button
              onClick={loadReviews}
              disabled={loading}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Xem"}
            </button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Card
            icon={<MessageSquare size={22} />}
            title="Tổng đánh giá"
            value={reviews.length}
          />

          <Card
            icon={<Star size={22} />}
            title="Điểm trung bình"
            value={average}
          />

          <Card icon={<Trophy size={22} />} title="Cao nhất" value={highest} />

          <Card icon={<Users size={22} />} title="Thấp nhất" value={lowest} />
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left">Ngày</th>

                  <th className="px-4 py-3 text-left">Mã NV</th>

                  <th className="px-4 py-3 text-left">Họ tên</th>

                  <th className="px-4 py-3 text-center">Tầng</th>

                  <th className="px-4 py-3 text-center">Điểm</th>

                  <th className="px-4 py-3">Nhận xét</th>
                </tr>
              </thead>

              <tbody>
                {reviews.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-slate-400"
                    >
                      Chưa có đánh giá.
                    </td>
                  </tr>
                )}

                {reviews.map((item) => (
                  <tr key={item.orderId + item.date} className="border-t">
                    <td className="px-4 py-3">{item.date}</td>

                    <td className="px-4 py-3">{item.employeeId}</td>

                    <td className="px-4 py-3">{item.name}</td>

                    <td className="px-4 py-3 text-center">{item.floor}</td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-bold ${getColor(item.rating)}`}
                      >
                        {item.rating}/10
                      </span>
                    </td>

                    <td className="px-4 py-3">{item.comment || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({
  icon,

  title,

  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 text-blue-600">{icon}</div>

      <div className="text-sm text-slate-500">{title}</div>

      <div className="mt-2 text-3xl font-bold">{value}</div>
    </div>
  );
}

export default ReviewManagement;
