import { useState } from "react";
import { Download, Calendar, BarChart3, PieChart, FileText, Loader2 } from "lucide-react";
import { getDailyReport, exportDailyReport } from "../../api/reportApi";
import InvoiceReport from "./InvoiceReport";

function Report() {
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [report, setReport] = useState(null);
    const [tab, setTab] = useState("daily");
    

    const handleLoad = async () => {
        if (!date) {
            return alert("Vui lòng chọn ngày.");
        }
        try {
            setLoading(true);
            const res = await getDailyReport(date);
            setReport(res.data.data);
        } catch (err) {
            alert(err.response?.data?.message || "Không tải được báo cáo.");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        if (!date) {
            return alert("Vui lòng chọn ngày.");
        }
        try {
            setExporting(true);
            const res = await exportDailyReport(date);
            const blob = new Blob([res.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Food_Report_${date}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert(err.response?.data?.message || "Xuất Excel thất bại.");
        } finally {
            setExporting(false);
        }
    };
    return (

    <div className="min-h-screen bg-slate-50 p-6">

        <div className="mx-auto max-w-7xl space-y-6">

            {/* Header */}

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                <div className="px-8 py-8">

                    <div className="flex items-center gap-4">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">

                            <FileText
                                size={28}
                                className="text-blue-600"
                            />

                        </div>

                        <div>

                            <h1 className="text-3xl font-bold text-slate-900">

                                Báo cáo

                            </h1>

                            <p className="mt-1 text-sm text-slate-500">

                                Thống kê suất ăn và báo cáo hóa đơn

                            </p>

                        </div>

                    </div>

                </div>

                {/* Tabs */}

                <div className="border-t bg-slate-50">

                    <div className="flex">

                        <button

                            onClick={() => setTab("daily")}

                            className={`flex-1 py-4 text-sm font-bold transition

                            ${
                                tab === "daily"

                                    ? "border-b-4 border-blue-600 bg-white text-blue-600"

                                    : "text-slate-500 hover:bg-slate-100"

                            }`}

                        >

                            📊 Daily Report

                        </button>

                        <button

                            onClick={() => setTab("invoice")}

                            className={`flex-1 py-4 text-sm font-bold transition

                            ${
                                tab === "invoice"

                                    ? "border-b-4 border-emerald-600 bg-white text-emerald-600"

                                    : "text-slate-500 hover:bg-slate-100"

                            }`}

                        >

                            🧾 Invoice Report

                        </button>

                    </div>

                </div>

            </div>

            {/* Toolbar */}

            {

                tab === "daily" && (

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

                            <div className="w-full lg:max-w-xs">

                                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">

                                    <Calendar
                                        size={16}
                                    />

                                    Chọn ngày

                                </label>

                                <input

                                    type="date"

                                    value={date}

                                    onChange={(e) =>

                                        setDate(e.target.value)

                                    }

                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"

                                />

                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">

                                <button

                                    onClick={handleLoad}

                                    disabled={loading}

                                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"

                                >

                                    {

                                        loading

                                            ? <Loader2 className="animate-spin" size={18} />

                                            : <Calendar size={18} />

                                    }

                                    {

                                        loading

                                            ? "Đang tải..."

                                            : "Xem báo cáo"

                                    }

                                </button>

                                <button

                                    onClick={handleExport}

                                    disabled={exporting}

                                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"

                                >

                                    {

                                        exporting

                                            ? <Loader2 className="animate-spin" size={18} />

                                            : <Download size={18} />

                                    }

                                    {

                                        exporting

                                            ? "Đang xuất..."

                                            : "Xuất Excel"

                                    }

                                </button>

                            </div>

                        </div>

                    </div>

                )

            }

            {/* Daily */}

            {

                tab === "daily" &&

                report && (

                    <div className="space-y-8 animate-fadeIn">
                        {/* ================= Summary ================= */}

<div>

    <div className="mb-5 flex items-center justify-between">

        <div>

            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">

                <PieChart
                    size={20}
                    className="text-blue-600"
                />

                Tổng số lượng suất ăn

            </h2>

            <p className="mt-1 text-sm text-slate-500">

                Thống kê tổng số lượng từng món trong ngày

            </p>

        </div>

    </div>

    <div
        className="
            grid
            grid-cols-2
            gap-4

            sm:grid-cols-3

            lg:grid-cols-4

            xl:grid-cols-6
        "
    >

        {

            report.headers.map((h) => (

                <div

                    key={h.id}

                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                        shadow-sm
                        transition
                        hover:-translate-y-1
                        hover:shadow-lg
                    "

                >

                    <div className="truncate text-xs font-semibold uppercase tracking-wide text-slate-400">

                        {h.name}

                    </div>

                    <div className="mt-4 flex items-end justify-between">

                        <div className="text-3xl font-bold text-slate-900">

                            {

                                report.totals[h.name] || 0

                            }

                        </div>

                        <div className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">

                            suất

                        </div>

                    </div>

                </div>

            ))

        }

    </div>

</div>

{/* ============== End Summary ============== */}
{/* ================= Desktop Table ================= */}

<div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">

    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

        <div>

            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">

                <BarChart3
                    size={20}
                    className="text-blue-600"
                />

                Danh sách nhân viên

            </h2>

            <p className="mt-1 text-sm text-slate-500">

                Chi tiết suất ăn của từng nhân viên

            </p>

        </div>

        <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">

            {report.rows.length} nhân viên

        </div>

    </div>

    <div className="max-h-[550px] overflow-auto">

        <table className="min-w-full border-collapse">

            <thead className="sticky top-0 z-10 bg-slate-100">

                <tr>

                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">

                        Mã NV

                    </th>

                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">

                        Email

                    </th>

                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600">

                        Tầng

                    </th>

                    {

                        report.headers.map((h) => (

                            <th

                                key={h.id}

                                className="whitespace-nowrap px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600"

                            >

                                {h.name}

                            </th>

                        ))

                    }

                </tr>

            </thead>

            <tbody>

                {

                    report.rows.map((row, index) => (

                        <tr

                            key={index}

                            className="border-b border-slate-100 transition hover:bg-slate-50"

                        >

                            <td className="px-4 py-3 font-semibold text-slate-800">

                                {row.employeeId}

                            </td>

                            <td className="px-4 py-3 text-slate-600">

                                {row.email}

                            </td>

                            <td className="px-4 py-3 text-center">

                                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">

                                    {row.floor}

                                </span>

                            </td>

                            {

                                report.headers.map((h) => (

                                    <td

                                        key={h.id}

                                        className="px-4 py-3 text-center"

                                    >

                                        {

                                            row.items[h.name]

                                                ? (

                                                    <span className="inline-flex min-w-[36px] items-center justify-center rounded-lg bg-blue-50 px-2 py-1 text-sm font-semibold text-blue-700">

                                                        {row.items[h.name]}

                                                    </span>

                                                )

                                                : (

                                                    <span className="text-slate-300">

                                                        —

                                                    </span>

                                                )

                                        }

                                    </td>

                                ))

                            }

                        </tr>

                    ))

                }

            </tbody>

        </table>

    </div>

</div>

{/* ============== End Desktop Table ============== */}
{/* ================= Mobile Cards ================= */}

<div className="space-y-4 lg:hidden">

    {

        report.rows.map((row, index) => (

            <div

                key={index}

                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"

            >

                {/* Header */}

                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4">

                    <div>

                        <h3 className="text-base font-bold text-slate-800">

                            {row.employeeId}

                        </h3>

                        <p className="mt-1 break-all text-xs text-slate-500">

                            {row.email}

                        </p>

                    </div>

                    <div className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">

                        Tầng {row.floor}

                    </div>

                </div>

                {/* Body */}

                <div className="grid grid-cols-2 gap-3 p-5">

                    {

                        report.headers.map((h) => (

                            <div

                                key={h.id}

                                className="rounded-2xl bg-slate-50 p-3"

                            >

                                <div className="truncate text-xs font-medium text-slate-500">

                                    {h.name}

                                </div>

                                <div className="mt-2 flex items-center justify-between">

                                    <span className="text-lg font-bold text-slate-900">

                                        {

                                            row.items[h.name] || 0

                                        }

                                    </span>

                                    <span className="text-xs text-slate-400">

                                        suất

                                    </span>

                                </div>

                            </div>

                        ))

                    }

                </div>

            </div>

        ))

    }

</div>

{/* ============== End Mobile Cards ============== */}

{/* ================= Floor Desktop ================= */}

<div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">

    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

        <div>

            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">

                <BarChart3
                    size={20}
                    className="text-blue-600"
                />

                Thống kê theo tầng

            </h2>

            <p className="mt-1 text-sm text-slate-500">

                Tổng số lượng suất ăn của từng tầng

            </p>

        </div>

        <div className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">

            {report.floors.length} tầng

        </div>

    </div>

    <div className="overflow-auto">

        <table className="min-w-full border-collapse">

            <thead className="bg-slate-100">

                <tr>

                    <th className="w-36 px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600">

                        Tầng

                    </th>

                    {

                        report.headers.map((h) => (

                            <th

                                key={h.id}

                                className="whitespace-nowrap px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600"

                            >

                                {h.name}

                            </th>

                        ))

                    }

                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600">

                        Tổng

                    </th>

                </tr>

            </thead>

            <tbody>

                {

                    report.floors.map((floor) => {

                        const total = report.headers.reduce(

                            (sum, h) =>

                                sum +

                                (floor.items[h.name] || 0),

                            0

                        );

                        return (

                            <tr

                                key={floor.floor}

                                className="border-b border-slate-100 transition hover:bg-slate-50"

                            >

                                <td className="px-4 py-4 text-center">

                                    <span className="rounded-full bg-orange-100 px-4 py-2 font-bold text-orange-700">

                                        Tầng {floor.floor}

                                    </span>

                                </td>

                                {

                                    report.headers.map((h) => (

                                        <td

                                            key={h.id}

                                            className="px-4 py-4 text-center"

                                        >

                                            <span className="inline-flex min-w-[38px] items-center justify-center rounded-lg bg-blue-50 px-2 py-1 font-semibold text-blue-700">

                                                {

                                                    floor.items[h.name] || 0

                                                }

                                            </span>

                                        </td>

                                    ))

                                }

                                <td className="px-4 py-4 text-center">

                                    <span className="rounded-lg bg-emerald-100 px-3 py-2 font-bold text-emerald-700">

                                        {total}

                                    </span>

                                </td>

                            </tr>

                        );

                    })

                }

            </tbody>

        </table>

    </div>

</div>

{/* ============== End Floor Desktop ============== */}

{/* ================= Floor Mobile ================= */}

<div className="space-y-4 lg:hidden">

    {

        report.floors.map((floor) => {

            const total = report.headers.reduce(

                (sum, h) =>

                    sum +

                    (floor.items[h.name] || 0),

                0

            );

            return (

                <div

                    key={floor.floor}

                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"

                >

                    {/* Header */}

                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4">

                        <div>

                            <h3 className="text-lg font-bold text-slate-800">

                                Tầng {floor.floor}

                            </h3>

                            <p className="mt-1 text-xs text-slate-500">

                                Tổng số suất ăn

                            </p>

                        </div>

                        <div className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">

                            {total} suất

                        </div>

                    </div>

                    {/* Body */}

                    <div className="grid grid-cols-2 gap-3 p-5">

                        {

                            report.headers.map((h) => (

                                <div

                                    key={h.id}

                                    className="rounded-2xl bg-slate-50 p-3"

                                >

                                    <div className="truncate text-xs font-medium text-slate-500">

                                        {h.name}

                                    </div>

                                    <div className="mt-2 flex items-center justify-between">

                                        <span className="text-xl font-bold text-slate-900">

                                            {

                                                floor.items[h.name] || 0

                                            }

                                        </span>

                                        <span className="text-xs text-slate-400">

                                            suất

                                        </span>

                                    </div>

                                </div>

                            ))

                        }

                    </div>

                </div>

            );

        })

    }

</div>

{/* ============== End Floor Mobile ============== */}
                    </div>

                )

            }

            {/* ================= Invoice Report ================= */}

            {

                tab === "invoice" && (

                    <InvoiceReport />

                )

            }

        </div>

    </div>

);

}

export default Report;
//                     </div>
// }

// export default Report;