import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import {

    getInvoiceReport,
    exportInvoiceReport

} from "../../api/reportApi";

function InvoiceReport() {

    const today = new Date();

    const monday = new Date(today);

    monday.setDate(

        today.getDate() -

        ((today.getDay() + 6) % 7)

    );

    const friday = new Date(monday);

    friday.setDate(

        monday.getDate() + 4

    );

    const formatInput = (date) =>

        date.toISOString().split("T")[0];

    const [from, setFrom] = useState(

        formatInput(monday)

    );

    const [to, setTo] = useState(

        formatInput(friday)

    );

    const [loading, setLoading] = useState(false);

    const [rows, setRows] = useState([]);

    const [summary, setSummary] = useState({});

    // =====================================
    // Load Report
    // =====================================

    const loadReport = async () => {

        try {

            setLoading(true);

            const res = await getInvoiceReport({

                from,

                to,

            });

            setRows(

                res.data.data.rows

            );

            setSummary(

                res.data.data.summary

            );

        }

        catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Không tải được báo cáo."

            );

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadReport();

    }, []);

    // =====================================
    // Export
    // =====================================

    const handleExport = async () => {

        try {

            const res = await exportInvoiceReport({

                from,

                to,

            });

            const url =

                window.URL.createObjectURL(

                    new Blob([res.data])

                );

            const link =

                document.createElement("a");

            link.href = url;

            link.download =

                `Invoice_Report_${from}_${to}.xlsx`;

            link.click();

            window.URL.revokeObjectURL(url);

        }

        catch (err) {

            toast.error(

                "Xuất Excel thất bại."

            );

        }

    };

    return (

        <div className="space-y-6">

            {/* Toolbar */}

            <div className="rounded-2xl bg-white p-5 shadow">

                <div className="grid gap-4 md:grid-cols-4">

                    <div>

                        <label className="mb-2 block text-sm font-semibold">

                            Từ ngày

                        </label>

                        <input

                            type="date"

                            value={from}

                            onChange={(e) =>

                                setFrom(e.target.value)

                            }

                            className="w-full rounded-xl border p-3"

                        />

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-semibold">

                            Đến ngày

                        </label>

                        <input

                            type="date"

                            value={to}

                            onChange={(e) =>

                                setTo(e.target.value)

                            }

                            className="w-full rounded-xl border p-3"

                        />

                    </div>

                    <div className="flex items-end">

                        <button

                            onClick={loadReport}

                            disabled={loading}

                            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"

                        >

                            {

                                loading

                                    ? "Đang tải..."

                                    : "Xem báo cáo"

                            }

                        </button>

                    </div>

                    <div className="flex items-end">

                        <button

                            onClick={handleExport}

                            className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700"

                        >

                            Xuất Excel

                        </button>

                    </div>

                </div>

            </div>
                        {/* Desktop Table */}

            <div className="hidden overflow-hidden rounded-2xl bg-white shadow lg:block">

                <div className="overflow-x-auto">

                    <table className="min-w-full">

                        <thead className="bg-orange-500 text-white">

                            <tr>

                                <th className="px-4 py-3 text-center">Ngày</th>

                                <th className="px-4 py-3 text-center">Mã NV</th>

                                <th className="px-4 py-3 text-left">Tên nhân viên</th>

                                <th className="px-4 py-3 text-left">Email</th>

                                <th className="px-4 py-3 text-center">Công ty</th>

                                <th className="px-4 py-3 text-left">Món ăn</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                rows.length === 0

                                    ? (

                                        <tr>

                                            <td

                                                colSpan={6}

                                                className="py-10 text-center text-gray-500"

                                            >

                                                Không có dữ liệu

                                            </td>

                                        </tr>

                                    )

                                    : (

                                        rows.map((item, index) => (

                                            <tr

                                                key={index}

                                                className="border-b hover:bg-orange-50"

                                            >

                                                <td className="px-4 py-3 text-center">

                                                    {item.date}

                                                </td>

                                                <td className="px-4 py-3 text-center">

                                                    {item.employeeId}

                                                </td>

                                                <td className="px-4 py-3">

                                                    {item.name}

                                                </td>

                                                <td className="px-4 py-3">

                                                    {item.email}

                                                </td>

                                                <td className="px-4 py-3 text-center">

                                                    <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">

                                                        {item.company}

                                                    </span>

                                                </td>

                                                <td className="px-4 py-3">

                                                    {item.food}

                                                </td>

                                            </tr>

                                        ))

                                    )

                            }

                        </tbody>

                    </table>

                </div>

            </div>

            {/* Mobile Card */}

            <div className="space-y-4 lg:hidden">

                {

                    rows.length === 0

                        ? (

                            <div className="rounded-2xl bg-white p-10 text-center shadow">

                                Không có dữ liệu

                            </div>

                        )

                        : (

                            rows.map((item, index) => (

                                <div

                                    key={index}

                                    className="rounded-2xl bg-white p-5 shadow"

                                >

                                    <div className="mb-3 flex items-center justify-between">

                                        <div className="text-lg font-bold">

                                            {item.name}

                                        </div>

                                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">

                                            {item.date}

                                        </span>

                                    </div>

                                    <div className="space-y-2 text-sm">

                                        <div>

                                            <span className="font-semibold">

                                                Mã NV:

                                            </span>{" "}

                                            {item.employeeId}

                                        </div>

                                        <div>

                                            <span className="font-semibold">

                                                Email:

                                            </span>{" "}

                                            {item.email}

                                        </div>

                                        <div>

                                            <span className="font-semibold">

                                                Công ty:

                                            </span>{" "}

                                            {item.company}

                                        </div>

                                        <div>

                                            <span className="font-semibold">

                                                Món ăn:

                                            </span>{" "}

                                            {item.food}

                                        </div>

                                    </div>

                                </div>

                            ))

                        )

                }

            </div>
                        {/* Summary */}

            <div className="rounded-2xl bg-white p-6 shadow">

                <h2 className="mb-5 text-xl font-bold text-slate-800">

                    Thống kê theo công ty

                </h2>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    {

                        Object.keys(summary).length === 0

                            ? (

                                <div className="col-span-full rounded-xl border border-dashed border-gray-300 py-10 text-center text-gray-500">

                                    Chưa có dữ liệu thống kê

                                </div>

                            )

                            : (

                                Object.entries(summary).map(

                                    ([company, total]) => (

                                        <div

                                            key={company}

                                            className="rounded-2xl border border-orange-100 bg-orange-50 p-5"

                                        >

                                            <div className="text-sm font-medium text-gray-500">

                                                Công ty

                                            </div>

                                            <div className="mt-2 text-lg font-bold text-slate-800">

                                                {company}

                                            </div>

                                            <div className="mt-5 flex items-end justify-between">

                                                <span className="text-sm text-gray-500">

                                                    Tổng suất ăn

                                                </span>

                                                <span className="text-3xl font-bold text-orange-600">

                                                    {total}

                                                </span>

                                            </div>

                                        </div>

                                    )

                                )

                            )

                    }

                </div>

            </div>

        </div>

    );

}

export default InvoiceReport;