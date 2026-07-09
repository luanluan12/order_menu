import { useEffect, useState } from "react";
import { getOrders } from "../../api/orderApi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import OrderDetailModal from "./OrderDetailModal";

function OrderManagement() {

    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const exportExcel = () => {

    const data = orders.map((order, index) => ({

        STT: index + 1,
        "Nhân viên": order.user?.name,
        Email: order.user?.email,
        Tuần: order.week,
        "Trạng thái":
            order.status === "ordered"
                ? "Đã đặt"
                : "Đã hủy"

    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Orders"
    );

    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
    });

    const blob = new Blob(
        [excelBuffer],
        {
            type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        }
    );

    saveAs(blob, "DanhSachDatMon.xlsx");
};
    const loadOrders = async () => {

    try {

        const res = await getOrders();
        console.log("ORDER API:");
        console.log(res.data);

        setOrders(
            res.data.data
        );

    }

    catch (err) {

        console.log(err);

    }

};

    useEffect(() => {

        // TODO:
        loadOrders()

    }, []);

    return (

        <div className="mx-auto max-w-7xl p-8">

            <div className="mb-5 flex items-center justify-between">

                <div>

                </div>

                <button onClick={exportExcel} className="rounded-xl bg-green-600 px-2 py-2 font-semibold text-white hover:bg-green-700">

                    Xuất Excel

                </button>

            </div>

            <div className="mb-6 flex gap-4">

                <input

                    placeholder="Tìm nhân viên..."

                    className="w-80 rounded-xl border p-3"

                />

                <select className="rounded-xl border p-3">

                    <option>Tất cả tuần</option>

                </select>

                <select className="rounded-xl border p-3">

                    <option>Tất cả trạng thái</option>

                </select>

            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow">

                <table className="w-full">

                    <thead className="bg-gray-50">

                        <tr>

                            <th className="p-4 text-left">

                                STT

                            </th>

                            <th className="p-4 text-left">

                                Nhân viên

                            </th>

                            <th className="p-4 text-left">

                                Email

                            </th>

                            <th className="p-4 text-center">

                                Tuần

                            </th>

                            <th className="p-4 text-center">

                                Trạng thái

                            </th>

                            <th className="p-4 text-center">

                                Chi tiết

                            </th>

                        </tr>

                    </thead>
                    <tbody>

{
    orders.length === 0 ? (

        <tr>

            <td
                colSpan={6}
                className="py-12 text-center text-gray-400"
            >
                Chưa có đơn đặt món.
            </td>

        </tr>

    ) : (

        orders.map((order, index) => (

            <tr
                key={order._id}
                className="border-t hover:bg-gray-50"
            >

                <td className="p-4">
                    {index + 1}
                </td>

                <td className="p-4">
                    {order.user?.name}
                </td>

                <td className="p-4">
                    {order.user?.email}
                </td>

                <td className="p-4 text-center">
                    {order.week}
                </td>

                <td className="p-4 text-center">

                    <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                            order.status === "ordered"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                        {order.status === "ordered"
                            ? "Đã đặt"
                            : "Đã hủy"}
                    </span>

                </td>

                <td className="p-4 text-center">

                    <button onClick={() =>

        setSelectedOrder(order)

    }
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Xem
                    </button>

                </td>

            </tr>

        ))

    )
}

</tbody>

                </table>
                <OrderDetailModal

    open={!!selectedOrder}

    order={selectedOrder}

    onClose={() =>

        setSelectedOrder(null)

    }

/>

            </div>

        </div>

    );

}

export default OrderManagement;