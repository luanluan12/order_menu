import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ClipboardList, CalendarDays, Star, X } from "lucide-react";
import { getHistory, submitReview } from "../../api/orderApi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";

function History() {
  const [orders, setOrders] = useState([]);
  const [openReview, setOpenReview] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [selectedDay, setSelectedDay] = useState(null);

  const [rating, setRating] = useState(10);

  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const API_URL = import.meta.env.VITE_API_URL;

  const getImageUrl = (image) => {
    if (!image) {
      return "https://placehold.co/600";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return API_URL + image;
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await getHistory();
      setOrders(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || t("cannot_load_history"));
    }
  };

  const formatDay = (date) =>
    new Date(date).toLocaleDateString(
      i18n.language === "ko" ? "ko-KR" : "vi-VN",
      {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
      },
    );
  const handleReview = (orderId, day) => {
    setSelectedOrder(orderId);

    setSelectedDay(day);

    setRating(10);

    setComment("");

    setOpenReview(true);
  };

  const saveReview = async () => {
    try {
      await submitReview({
        orderId: selectedOrder,

        date: selectedDay.date.substring(0, 10),

        rating,

        comment,
      });

      toast.success(t("review_success"));

      setOpenReview(false);

      loadHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || t("review_failed"));
    }
  };

  const DishCard = ({ dish, type = "", quantity }) => (
    <div className="w-[135px] sm:w-[150px] overflow-hidden rounded-[20px] border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="p-2">
        <img
          src={getImageUrl(dish.image)}
          alt={dish.name}
          className="h-[125px] w-full rounded-[16px] object-cover"
        />
      </div>

      <div className="px-3 pb-4">
        <h3 className="min-h-[42px] text-center text-[16px] font-semibold text-slate-800">
          {dish.name}
        </h3>

        <div className="mt-2 text-center text-xs font-medium text-gray-500">
          {type}
        </div>

        {quantity && (
          <div className="mt-3 flex justify-center">
            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-600">
              x{quantity}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1080px] px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}

      <div className="mb-10 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm transition hover:bg-orange-50"
        >
          <ArrowLeft size={22} />
        </button>

        <h1 className="text-3xl font-bold text-slate-800">{t("history")}</h1>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl bg-white py-20 text-center shadow">
          <ClipboardList size={60} className="mx-auto text-orange-300" />

          <h2 className="mt-5 text-2xl font-bold text-slate-700">
            {t("no_order")}
          </h2>
        </div>
      ) : (
        <div className="space-y-10">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-[30px] bg-white p-4 shadow sm:p-6 lg:p-8"
            >
              {/* Week */}

              {/* Header */}

              <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">
                    {order.week}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-5 py-2 font-semibold ${
                      order.status === "ordered"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status === "ordered" ? t("ordered") : t("cancelled")}
                  </span>

                  {order.status === "ordered" && (
                    <button
                      onClick={() => navigate(`/order/edit/${order._id}`)}
                      className="rounded-xl bg-orange-500 px-5 py-2 font-semibold text-white transition hover:bg-orange-600"
                    >
                      {t("edit")}
                    </button>
                  )}
                </div>
              </div>

              {/* Days */}

              <div className="space-y-8">
                {order.days.map((day) => (
                  <div
                    key={day._id || day.date}
                    className="rounded-[24px] bg-orange-50 p-6"
                  >
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-xl font-bold text-slate-800">
                        {formatDay(day.date)}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2">
                        {day.received && (
                          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
                            {t("received")}
                          </span>
                        )}

                        {day.received && !day.review && (
                          <button
                            onClick={() => handleReview(order._id, day)}
                            className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                          >
                            {t("review")}
                          </button>
                        )}

                        {day.review && (
                          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                            {day.review.rating}/10
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 sm:justify-start sm:gap-5">
                      {day.mains.map((dish) => (
                        <DishCard
                          key={dish.dishId || dish.name}
                          dish={dish}
                          quantity={dish.quantity}
                          type={t("main_dish")}
                        />
                      ))}

                      {day.drink && (
                        <DishCard dish={day.drink} type={`🥤 ${t("drink")}`} />
                      )}

                      {day.soup && (
                        <DishCard dish={day.soup} type={`🥣 ${t("soup")}`} />
                      )}
                    </div>
                    {day.review && (
                      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2 font-bold text-slate-800">
                          <Star size={18} className="text-yellow-500" />

                          {t("your_review")}
                        </div>

                        <div className="mt-3">
                          <span className="rounded-full bg-orange-100 px-4 py-2 font-bold text-orange-600">
                            {day.review.rating}/10
                          </span>
                        </div>

                        {day.review.comment && (
                          <p className="mt-4 whitespace-pre-wrap text-slate-600">
                            {day.review.comment}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {openReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 w-full max-w-md rounded-3xl bg-white p-5 sm:p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t("meal_review")}</h2>

              <button onClick={() => setOpenReview(false)}>
                <X />
              </button>
            </div>

            <div>
              <div className="mb-3 font-semibold">{t("select_rating")}</div>

              <div className="grid grid-cols-5 gap-3">
                {Array.from(
                  { length: 10 },

                  (_, i) => i + 1,
                ).map((score) => (
                  <button
                    key={score}
                    onClick={() => setRating(score)}
                    className={`rounded-xl border py-3 font-bold transition

                                    ${
                                      rating === score
                                        ? "bg-orange-500 text-white"
                                        : "hover:bg-orange-50"
                                    }`}
                  >
                    {score}
                  </button>
                ))}
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder={t("review_placeholder")}
                className="mt-5 w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-orange-500"
              />

              <button
                onClick={saveReview}
                className="mt-5 w-full rounded-xl bg-orange-500 py-3 font-bold text-white transition hover:bg-orange-600"
              >
                {t("submit_review")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;
