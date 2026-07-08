import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import WeekMenuContent from "../../components/WeekMenuContent";

import { getWeekMenu } from "../../api/menuApi";

import {

    createOrder,

    updateOrder,

} from "../../api/orderApi";

function WeekMenu() {

    const [loading, setLoading] = useState(true);

    const [menu, setMenu] = useState(null);

    const [order, setOrder] = useState(null);

    useEffect(() => {

        loadData();

    }, []);

    const loadData = async () => {

        try {

            const menuRes = await getWeekMenu();

            const menuData = menuRes.data.data;

            setMenu(menuData);


            if (

                orderRes.data.ordered &&

                orderRes.data.data

            ) {

                setOrder(

                    orderRes.data.data

                );

            }

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

            if (order) {

                await updateOrder(

                    order._id,

                    {

                        days

                    }

                );

                toast.success(

                    "Cập nhật thành công."

                );

            }

            else {

                await createOrder({

                    menuId: menu._id,

                    days

                });

                toast.success(

                    "Đặt món thành công."

                );

            }

            loadData();

        }

        catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Có lỗi xảy ra."

            );

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

            submitText={

                order

                    ?

                    "CẬP NHẬT ĐƠN"

                    :

                    "ĐẶT MÓN"

            }

            onSubmit={submit}

        />

    );

}

export default WeekMenu;