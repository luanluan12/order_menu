import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import WeekMenuContent from "../../components/WeekMenuContent";

import { getWeekMenu } from "../../api/menuApi";

import { useSearchParams } from "react-router-dom";

import DeadlineBanner from "../../components/DeadlineBanner";

import { useTranslation } from "react-i18next";

import { createOrder, updateOrder } from "../../api/orderApi";

import { verifyInvite, createOrderFromInvite } from "../../api/orderApi";

function WeekMenu() {
  const [loading, setLoading] = useState(true);

  const [menu, setMenu] = useState(null);

  const [order, setOrder] = useState(null);

  const [searchParams] = useSearchParams();

  const { t } = useTranslation();

  const token = searchParams.get("token");

  useEffect(() => {
    loadData();
  }, [token]);

  const loadData = async () => {
    try {
      if (token) {
        const res = await verifyInvite(token);

        setMenu(res.data.data.menu);

        return;
      }

      const menuRes = await getWeekMenu();

      setMenu(menuRes.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Không tải được thực đơn.");
    } finally {
      setLoading(false);
    }
  };

  //   const submit = async (days) => {
  //     try {
  //       if (token) {
  //         const res = await createOrderFromInvite({
  //           token,
  //           days,
  //         });

  //         toast.success(res.data.message);

  //         return true;
  //       }

  //       if (order) {
  //         await updateOrder(order._id, {
  //           days,
  //         });

  //         toast.success("Cập nhật thành công.");
  //       } else {
  //         await createOrder({
  //           menuId: menu._id,
  //           days,
  //         });

  //         toast.success("Đặt món thành công.");
  //       }

  //       await loadData();

  //       return true;
  //     } catch (err) {
  //       toast.error(err.response?.data?.message || "Có lỗi xảy ra.");

  //       return false;
  //     }
  //   };
  const submit = async (days) => {
    try {
      console.log("A");

      if (order) {
        await updateOrder(order._id, {
          days,
        });
      } else {
        await createOrder({
          menuId: menu._id,
          days,
        });
      }

      console.log("B");

      toast.success("Đặt món thành công.");

      console.log("C");

      await loadData();

      console.log("D");

      return true;
    } catch (err) {
      console.log("ERROR", err);

      toast.error(err.response?.data?.message || "Có lỗi xảy ra.");

      return false;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        {t("loading")}
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="flex h-screen items-center justify-center">
        {t("no_week_menu")}
      </div>
    );
  }

  const expired = new Date() > new Date(menu.deadline);

  if (expired) {
    return (
      <div className="mx-auto mt-20 max-w-2xl rounded-3xl bg-white/90 p-12 text-center shadow-xl">
        <div className="text-6xl">🍽️</div>

        <h2 className="mt-6 text-3xl font-bold">{t("order_closed")}</h2>

        <p className="mt-4 text-gray-500">{t("order_closed_message")}</p>

        <p className="mt-2 text-gray-500">{t("wait_next_menu")}</p>
      </div>
    );
  }

  return (
    <>
      <DeadlineBanner />

      <WeekMenuContent
        menu={menu}
        initialOrder={order}
        editable={!token || !order}
        submitText={
          token ? "submit_order" : order ? "update_order" : "submit_order"
        }
        onSubmit={submit}
      />
    </>
  );
}

export default WeekMenu;
