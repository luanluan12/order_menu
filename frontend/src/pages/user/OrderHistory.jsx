import { useEffect, useState } from "react";
import { getHistory, cancelOrder } from "../../apis/orderApi";

function OrderHistory() {

    const [orders, setOrders] = useState([]);

    const loadHistory = async () => {

        try {

            const res = await getHistory();

            // Nếu backend trả { success:true,data:[] }
            setOrders(res.data.data);

            // Nếu backend trả []
            // setOrders(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        loadHistory();

    }, []);

    const handleCancel = async (id) => {

        if (!window.confirm("Bạn có chắc muốn hủy?")) {

            return;

        }

        try {

            await cancelOrder(id);

            alert("Hủy thành công");

            loadHistory();

        } catch (err) {

            alert(

                err.response?.data?.message ||

                "Không thể hủy"

            );

        }

    };

    return (

        <div>

            <h2>Lịch sử đặt món</h2>

            {

                orders.length === 0 ?

                    <h3>Chưa có đơn hàng</h3>

                    :

                    orders.map(order => (

                        <div

                            key={order._id}

                            style={{

                                background: "#fff",

                                padding: 20,

                                marginBottom: 20,

                                borderRadius: 10,

                                boxShadow: "0 2px 6px rgba(0,0,0,.1)"

                            }}

                        >

                            <h3>

                                {

                                    new Date(order.menu.date)

                                        .toLocaleDateString()

                                }

                            </h3>

                            <p>

                                Món:

                                {" "}

                                {

                                    order.selectedMain === "mainNormal"

                                        ?

                                        order.menu.mainNormal

                                        :

                                        order.menu.mainVegetarian

                                }

                            </p>

                            <p>

                                Option:

                                {" "}

                                {order.option}

                            </p>

                            <p>

                                Trạng thái:

                                {" "}

                                {order.status}

                            </p>

                            {

                                order.status === "ordered"

                                &&

                                <button

                                    onClick={() =>

                                        handleCancel(order._id)

                                    }

                                >

                                    Hủy

                                </button>

                            }

                        </div>

                    ))

            }

        </div>

    );

}

export default OrderHistory;