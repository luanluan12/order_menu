import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import WeekMenuContent from "../../components/WeekMenuContent";

import {
    getOrderById,
    updateOrder,
} from "../../api/orderApi";

function OrderEdit() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [order, setOrder] = useState(null);

    const [menu, setMenu] = useState(null);

    useEffect(() => {

        loadOrder();

    }, [id]);

    const loadOrder = async () => {

        try {

            setLoading(true);

            const res = await getOrderById(id);

            setOrder(res.data.data);

            setMenu(res.data.data.menu);

        }

        catch (err) {

            console.error(err);

            toast.error(

                err.response?.data?.message ||

                "Không tải được đơn đặt món."

            );

            navigate("/history");

        }

        finally {

            setLoading(false);

        }

    };

    const submit = async (days) => {

        try {

            await updateOrder(id, {

                days

            });

            toast.success("Cập nhật thành công.");

            navigate("/history");

            return true;

        }

        catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Cập nhật thất bại."

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

    if (!menu || !order) {

        return (

            <div className="flex h-screen items-center justify-center">

                Không tìm thấy đơn đặt món.

            </div>

        );

    }

    return (

        <WeekMenuContent

            menu={menu}

            initialOrder={order}

            editable={true}

            submitText="update_order"

            onSubmit={submit}

        />

    );

}

export default OrderEdit;