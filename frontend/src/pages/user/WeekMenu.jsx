import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import WeekMenuContent from "../../components/WeekMenuContent";

import { getWeekMenu } from "../../api/menuApi";

import { useSearchParams } from "react-router-dom";

import {

    createOrder,

    updateOrder,

} from "../../api/orderApi";


import {
    verifyInvite,
    createOrderFromInvite
} from "../../api/orderApi";

function WeekMenu() {

    const [loading, setLoading] = useState(true);

    const [menu, setMenu] = useState(null);

    const [order, setOrder] = useState(null);

    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    useEffect(() => {

    loadData();

}, [token]);

    const loadData = async () => {

    try {

        if (token) {

            const res =
                await verifyInvite(token);

            setMenu(
                res.data.data.menu
            );

            return;
        }

        const menuRes =
            await getWeekMenu();

        setMenu(
            menuRes.data.data
        );

    }

    catch (err) {

        toast.error(

            err.response?.data?.message ||

            "Không tải được thực đơn."

        );

    }

    finally {

        setLoading(false);

    }

};

const submit = async (days) => {
    try {

        if (token) {

            const res = await createOrderFromInvite({
                token,
                days,
            });

            toast.success(res.data.message);

            return true;
        }

        if (order) {

            await updateOrder(order._id, {
                days,
            });

            toast.success("Cập nhật thành công.");

        } else {

            await createOrder({
                menuId: menu._id,
                days,
            });

            toast.success("Đặt món thành công.");

        }

        await loadData();

        return true;

    } catch (err) {

        toast.error(
            err.response?.data?.message ||
            "Có lỗi xảy ra."
        );

        return false;
    }
};

    if (loading) {

        return (

            <div className="flex h-screen items-center justify-center">

                Đang tải...

            </div>

        );

    }

    if (!menu) {

        return (

            <div className="flex h-screen items-center justify-center">

                Chưa có thực đơn tuần.

            </div>

        );

    }

    return (

        <WeekMenuContent

    menu={menu}

    initialOrder={order}

    editable={!token || !order}

    submitText={
    token
        ? "submit_order"
        : order
            ? "update_order"
            : "submit_order"
}

    onSubmit={submit}

/>

    );

}

export default WeekMenu;