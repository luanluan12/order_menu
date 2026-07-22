// import { useState } from "react";
// import {
//   Download,
//   Calendar,
//   BarChart3,
//   PieChart,
//   FileText,
//   Loader2,
// } from "lucide-react";
// import {
//   getDailyReport,
//   exportDailyReport,
//   getLeftoverReport,
//   exportLeftoverReport,
// } from "../../api/reportApi";
// import InvoiceReport from "./InvoiceReport";

// function Report() {
//   const [date, setDate] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [exporting, setExporting] = useState(false);
//   const [report, setReport] = useState(null);
//   const [tab, setTab] = useState("daily");
//   const [leftover, setLeftover] = useState(null);

//   const handleLoad = async () => {
//     if (!date) {
//       return alert("Vui lòng chọn ngày.");
//     }
//     try {
//       setLoading(true);
//       const res = await getDailyReport(date);
//       setReport(res.data.data);
//     } catch (err) {
//       alert(err.response?.data?.message || "Không tải được báo cáo.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleExport = async () => {
//     if (!date) {
//       return alert("Vui lòng chọn ngày.");
//     }
//     try {
//       setExporting(true);
//       const res = await exportDailyReport(date);
//       const blob = new Blob([res.data], {
//         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `Food_Report_${date}.xlsx`;
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.log(err);
//       console.log(err.response);
//       console.log(err.response?.data);

//       alert(JSON.stringify(err.response?.data || err.message));
//     } finally {
//       setExporting(false);
//     }
//   };

//   const loadLeftover = async () => {
//     if (!date) {
//       return alert("Vui lòng chọn ngày.");
//     }

//     try {
//       setLoading(true);

//       const res = await getLeftoverReport(date);

//       console.log("LEFTOVER DATA:", res.data.data);

//       setLeftover(res.data.data);
//     } catch (err) {
//       console.log(err);
//       console.log(err.response);
//       console.log(err.response?.data);

//       alert(JSON.stringify(err.response?.data || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleLeftoverExport = async () => {
//     if (!date) {
//       return alert("Vui lòng chọn ngày.");
//     }

//     try {
//       setLoading(true);

//       const res = await exportLeftoverReport(date);

//       const url = window.URL.createObjectURL(new Blob([res.data]));

//       const link = document.createElement("a");

//       link.href = url;

//       link.download = `Leftover_Report_${date}.xlsx`;

//       document.body.appendChild(link);

//       link.click();

//       link.remove();

//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.log(err);
//       console.log(err.response);
//       console.log(err.response?.data);

//       alert(JSON.stringify(err.response?.data || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div className="min-h-screen bg-slate-50 p-6">
//       <div className="mx-auto max-w-7xl space-y-6">
//         {/* Header */}

//         <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
//           <div className="px-8 py-8">
//             <div className="flex items-center gap-4">
//               <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
//                 <FileText size={28} className="text-blue-600" />
//               </div>

//               <div>
//                 <h1 className="text-3xl font-bold text-slate-900">Báo cáo</h1>

//                 <p className="mt-1 text-sm text-slate-500">
//                   Thống kê suất ăn và báo cáo hóa đơn
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Tabs */}

//           <div className="border-t bg-slate-50">
//             <div className="flex">
//               <button
//                 onClick={() => setTab("daily")}
//                 className={`flex-1 py-4 text-sm font-bold transition

//                             ${
//                               tab === "daily"
//                                 ? "border-b-4 border-blue-600 bg-white text-blue-600"
//                                 : "text-slate-500 hover:bg-slate-100"
//                             }`}
//               >
//                 Daily Report
//               </button>

//               <button
//                 onClick={() => setTab("invoice")}
//                 className={`flex-1 py-4 text-sm font-bold transition

//                             ${
//                               tab === "invoice"
//                                 ? "border-b-4 border-emerald-600 bg-white text-emerald-600"
//                                 : "text-slate-500 hover:bg-slate-100"
//                             }`}
//               >
//                 Invoice Report
//               </button>

//               <button
//                 onClick={() => setTab("leftover")}
//                 className={`flex-1 py-4 text-sm font-bold transition
//         ${
//           tab === "leftover"
//             ? "border-b-4 border-red-600 bg-white text-red-600"
//             : "text-slate-500 hover:bg-slate-100"
//         }`}
//               >
//                 Leftover Report
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Toolbar */}

//         {(tab === "daily" || tab === "leftover") && (
//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//             <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
//               <div className="w-full lg:max-w-xs">
//                 <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
//                   <Calendar size={16} />
//                   Chọn ngày
//                 </label>

//                 <input
//                   type="date"
//                   value={date}
//                   onChange={(e) => setDate(e.target.value)}
//                   className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
//                 />
//               </div>

//               <div className="flex flex-col gap-3 sm:flex-row">
//                 <button
//                   onClick={tab === "daily" ? handleLoad : loadLeftover}
//                   disabled={loading}
//                   className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
//                 >
//                   {loading ? (
//                     <Loader2 className="animate-spin" size={18} />
//                   ) : (
//                     <Calendar size={18} />
//                   )}

//                   {loading ? "Đang tải..." : "Xem báo cáo"}
//                 </button>

//                 <button
//                   onClick={
//                     tab === "daily" ? handleExport : handleLeftoverExport
//                   }
//                   disabled={exporting}
//                   className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
//                 >
//                   {exporting ? (
//                     <Loader2 className="animate-spin" size={18} />
//                   ) : (
//                     <Download size={18} />
//                   )}

//                   {exporting ? "Đang xuất..." : "Xuất Excel"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Daily */}

//         {tab === "daily" && report && (
//           <div className="space-y-8 animate-fadeIn">
//             {/* ================= Summary ================= */}

//             <div>
//               <div className="mb-5 flex items-center justify-between">
//                 <div>
//                   <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
//                     <PieChart size={20} className="text-blue-600" />
//                     Tổng số lượng suất ăn
//                   </h2>

//                   <p className="mt-1 text-sm text-slate-500">
//                     Thống kê tổng số lượng từng món trong ngày
//                   </p>
//                 </div>
//               </div>

//               <div
//                 className="
//             grid
//             grid-cols-2
//             gap-4

//             sm:grid-cols-3

//             lg:grid-cols-4

//             xl:grid-cols-6
//         "
//               >
//                 {report.headers.map((h) => (
//                   <div
//                     key={h.id}
//                     className="
//                         rounded-2xl
//                         border
//                         border-slate-200
//                         bg-white
//                         p-5
//                         shadow-sm
//                         transition
//                         hover:-translate-y-1
//                         hover:shadow-lg
//                     "
//                   >
//                     <div className="truncate text-xs font-semibold uppercase tracking-wide text-slate-400">
//                       {h.name}
//                     </div>

//                     <div className="mt-4 flex items-end justify-between">
//                       <div className="text-3xl font-bold text-slate-900">
//                         {report.totals[h.name] || 0}
//                       </div>

//                       <div className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
//                         suất
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* ============== End Summary ============== */}
//             {/* ================= Desktop Table ================= */}

//             <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">
//               <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
//                 <div>
//                   <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
//                     <BarChart3 size={20} className="text-blue-600" />
//                     Danh sách nhân viên
//                   </h2>

//                   <p className="mt-1 text-sm text-slate-500">
//                     Chi tiết suất ăn của từng nhân viên
//                   </p>
//                 </div>

//                 <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
//                   {report.rows.length} nhân viên
//                 </div>
//               </div>

//               <div className="max-h-[550px] overflow-auto">
//                 <table className="min-w-full border-collapse">
//                   <thead className="sticky top-0 z-10 bg-slate-100">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
//                         Mã NV
//                       </th>

//                       <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
//                         Email
//                       </th>

//                       <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
//                         Tầng
//                       </th>

//                       {report.headers.map((h) => (
//                         <th
//                           key={h.id}
//                           className="whitespace-nowrap px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600"
//                         >
//                           {h.name}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {report.rows.map((row, index) => (
//                       <tr
//                         key={index}
//                         className="border-b border-slate-100 transition hover:bg-slate-50"
//                       >
//                         <td className="px-4 py-3 font-semibold text-slate-800">
//                           {row.employeeId}
//                         </td>

//                         <td className="px-4 py-3 text-slate-600">
//                           {row.email}
//                         </td>

//                         <td className="px-4 py-3 text-center">
//                           <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
//                             {row.floor}
//                           </span>
//                         </td>

//                         {report.headers.map((h) => (
//                           <td key={h.id} className="px-4 py-3 text-center">
//                             {row.items[h.name] ? (
//                               <span className="inline-flex min-w-[36px] items-center justify-center rounded-lg bg-blue-50 px-2 py-1 text-sm font-semibold text-blue-700">
//                                 {row.items[h.name]}
//                               </span>
//                             ) : (
//                               <span className="text-slate-300">—</span>
//                             )}
//                           </td>
//                         ))}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* ============== End Desktop Table ============== */}
//             {/* ================= Mobile Cards ================= */}

//             <div className="space-y-4 lg:hidden">
//               {report.rows.map((row, index) => (
//                 <div
//                   key={index}
//                   className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
//                 >
//                   {/* Header */}

//                   <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4">
//                     <div>
//                       <h3 className="text-base font-bold text-slate-800">
//                         {row.employeeId}
//                       </h3>

//                       <p className="mt-1 break-all text-xs text-slate-500">
//                         {row.email}
//                       </p>
//                     </div>

//                     <div className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
//                       Tầng {row.floor}
//                     </div>
//                   </div>

//                   {/* Body */}

//                   <div className="grid grid-cols-2 gap-3 p-5">
//                     {report.headers.map((h) => (
//                       <div key={h.id} className="rounded-2xl bg-slate-50 p-3">
//                         <div className="truncate text-xs font-medium text-slate-500">
//                           {h.name}
//                         </div>

//                         <div className="mt-2 flex items-center justify-between">
//                           <span className="text-lg font-bold text-slate-900">
//                             {row.items[h.name] || 0}
//                           </span>

//                           <span className="text-xs text-slate-400">suất</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* ============== End Mobile Cards ============== */}

//             {/* ================= Floor Desktop ================= */}

//             <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">
//               <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
//                 <div>
//                   <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
//                     <BarChart3 size={20} className="text-blue-600" />
//                     Thống kê theo tầng
//                   </h2>

//                   <p className="mt-1 text-sm text-slate-500">
//                     Tổng số lượng suất ăn của từng tầng
//                   </p>
//                 </div>

//                 <div className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
//                   {report.floors.length} tầng
//                 </div>
//               </div>

//               <div className="overflow-auto">
//                 <table className="min-w-full border-collapse">
//                   <thead className="bg-slate-100">
//                     <tr>
//                       <th className="w-36 px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
//                         Tầng
//                       </th>

//                       {report.headers.map((h) => (
//                         <th
//                           key={h.id}
//                           className="whitespace-nowrap px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600"
//                         >
//                           {h.name}
//                         </th>
//                       ))}

//                       <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
//                         Tổng
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {report.floors.map((floor) => {
//                       const total = floor.total;

//                       return (
//                         <tr
//                           key={floor.floor}
//                           className="border-b border-slate-100 transition hover:bg-slate-50"
//                         >
//                           <td className="px-4 py-4 text-center">
//                             <span className="rounded-full bg-orange-100 px-4 py-2 font-bold text-orange-700">
//                               Tầng {floor.floor}
//                             </span>
//                           </td>

//                           {report.headers.map((h) => (
//                             <td key={h.id} className="px-4 py-4 text-center">
//                               <span className="inline-flex min-w-[38px] items-center justify-center rounded-lg bg-blue-50 px-2 py-1 font-semibold text-blue-700">
//                                 {floor.items[h.name] || 0}
//                               </span>
//                             </td>
//                           ))}

//                           <td className="px-4 py-4 text-center">
//                             <span className="rounded-lg bg-emerald-100 px-3 py-2 font-bold text-emerald-700">
//                               {total}
//                             </span>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* ============== End Floor Desktop ============== */}

//             {/* ================= Floor Mobile ================= */}

//             <div className="space-y-4 lg:hidden">
//               {report.floors.map((floor) => {
//                 const total = floor.total;

//                 return (
//                   <div
//                     key={floor.floor}
//                     className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
//                   >
//                     {/* Header */}

//                     <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4">
//                       <div>
//                         <h3 className="text-lg font-bold text-slate-800">
//                           Tầng {floor.floor}
//                         </h3>

//                         <p className="mt-1 text-xs text-slate-500">
//                           Tổng số suất ăn
//                         </p>
//                       </div>

//                       <div className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
//                         {total} suất
//                       </div>
//                     </div>

//                     {/* Body */}

//                     <div className="grid grid-cols-2 gap-3 p-5">
//                       {report.headers.map((h) => (
//                         <div key={h.id} className="rounded-2xl bg-slate-50 p-3">
//                           <div className="truncate text-xs font-medium text-slate-500">
//                             {h.name}
//                           </div>

//                           <div className="mt-2 flex items-center justify-between">
//                             <span className="text-xl font-bold text-slate-900">
//                               {floor.items[h.name] || 0}
//                             </span>

//                             <span className="text-xs text-slate-400">suất</span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* ============== End Floor Mobile ============== */}
//           </div>
//         )}

//         {tab === "leftover" && leftover && (
//           <div className="space-y-8">
//             {/* Tổng món thừa */}

//             <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
//               <div className="border-b px-6 py-5">
//                 <h2 className="text-lg font-bold">Thống kê món thừa</h2>
//               </div>

//               <table className="min-w-full">
//                 <thead className="bg-slate-100">
//                   <tr>
//                     <th className="px-4 py-3 text-left">Món</th>

//                     <th className="px-4 py-3 text-center">Loại</th>

//                     <th className="px-4 py-3 text-center">Số lượng</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {leftover.leftovers.map((item) => (
//                     <tr key={item.name} className="border-b">
//                       <td className="px-4 py-3">{item.name}</td>

//                       <td className="px-4 py-3 text-center">
//                         {{
//                           main: "Món cơm",
//                           drink: "Món nước",
//                           soup: "Món súp",
//                         }[item.type] || item.type}
//                       </td>

//                       <td className="px-4 py-3 text-center font-bold text-red-600">
//                         {item.quantity}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Theo tầng */}

//             <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
//               <div className="border-b px-6 py-5">
//                 <h2 className="text-lg font-bold">Thống kê theo tầng</h2>
//               </div>

//               <table className="min-w-full">
//                 <thead className="bg-slate-100">
//                   <tr>
//                     <th className="px-4 py-3">Tầng</th>

//                     {leftover.leftovers.map((item) => (
//                       <th key={item.name} className="px-4 py-3">
//                         {item.name}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {leftover.floors.map((floor) => (
//                     <tr key={floor.floor} className="border-b">
//                       <td className="px-4 py-3 font-bold">{floor.floor}</td>

//                       {leftover.leftovers.map((item) => (
//                         <td key={item.name} className="text-center">
//                           {floor.items[item.name] || 0}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Danh sách nhân viên chưa nhận */}

//             <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
//               <div className="border-b px-6 py-5">
//                 <h2 className="text-lg font-bold">
//                   Danh sách nhân viên chưa nhận
//                 </h2>
//               </div>

//               <div className="overflow-auto">
//                 <table className="min-w-full">
//                   <thead className="bg-slate-100">
//                     <tr>
//                       <th className="px-4 py-3 text-left">Mã NV</th>

//                       <th className="px-4 py-3 text-left">Tên</th>

//                       <th className="px-4 py-3 text-center">Tầng</th>

//                       <th className="px-4 py-3 text-left">Đã đặt món</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {leftover.users.length === 0 ? (
//                       <tr>
//                         <td
//                           colSpan={4}
//                           className="py-8 text-center text-gray-400"
//                         >
//                           Không có nhân viên chưa nhận.
//                         </td>
//                       </tr>
//                     ) : (
//                       leftover.users.map((user, index) => (
//                         <tr key={index} className="border-b hover:bg-slate-50">
//                           <td className="px-4 py-3 font-semibold">
//                             {user.employeeId}
//                           </td>

//                           <td className="px-4 py-3">{user.name}</td>

//                           <td className="px-4 py-3 text-center">
//                             <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
//                               {user.floor}
//                             </span>
//                           </td>

//                           <td className="px-4 py-3">
//                             <div className="flex flex-wrap gap-2">
//                               {user.foods.map((food, i) => (
//                                 <span
//                                   key={i}
//                                   className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
//                                 >
//                                   {food}
//                                 </span>
//                               ))}
//                             </div>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ================= Invoice Report ================= */}

//         {tab === "invoice" && <InvoiceReport />}
//       </div>
//     </div>
//   );
// }

// export default Report;

import { useState } from "react";
import {
  Download,
  Calendar,
  BarChart3,
  PieChart,
  FileText,
  Loader2,
} from "lucide-react";
import {
  getDailyReport,
  exportDailyReport,
  getLeftoverReport,
  exportLeftoverReport,
} from "../../api/reportApi";
import InvoiceReport from "./InvoiceReport";

function Report() {
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [report, setReport] = useState(null);
  const [tab, setTab] = useState("daily");
  const [leftover, setLeftover] = useState(null);

  const handleLoad = async () => {
    if (!date) return alert("Vui lòng chọn ngày.");

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
    if (!date) return alert("Vui lòng chọn ngày.");

    try {
      setExporting(true);

      const res = await exportDailyReport(date);
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `Food_Report_${date}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(JSON.stringify(err.response?.data || err.message));
    } finally {
      setExporting(false);
    }
  };

  const loadLeftover = async () => {
    if (!date) return alert("Vui lòng chọn ngày.");

    try {
      setLoading(true);
      const res = await getLeftoverReport(date);
      setLeftover(res.data.data);
    } catch (err) {
      alert(JSON.stringify(err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleLeftoverExport = async () => {
    if (!date) return alert("Vui lòng chọn ngày.");

    try {
      setExporting(true);

      const res = await exportLeftoverReport(date);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.download = `Leftover_Report_${date}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(JSON.stringify(err.response?.data || err.message));
    } finally {
      setExporting(false);
    }
  };

  const isReportTab = tab === "daily" || tab === "leftover";

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="px-5 py-6 sm:px-8 sm:py-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100">
                <FileText size={28} className="text-blue-600" />
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  Báo cáo
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Thống kê suất ăn và báo cáo hóa đơn
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border-t bg-slate-50">
            <div className="flex min-w-max sm:min-w-0">
              <TabButton
                active={tab === "daily"}
                activeClass="border-blue-600 bg-white text-blue-600"
                onClick={() => setTab("daily")}
              >
                Daily Report
              </TabButton>

              <TabButton
                active={tab === "invoice"}
                activeClass="border-emerald-600 bg-white text-emerald-600"
                onClick={() => setTab("invoice")}
              >
                Invoice Report
              </TabButton>

              <TabButton
                active={tab === "leftover"}
                activeClass="border-red-600 bg-white text-red-600"
                onClick={() => setTab("leftover")}
              >
                Leftover Report
              </TabButton>
            </div>
          </div>
        </div>

        {isReportTab && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="w-full lg:max-w-xs">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Calendar size={16} />
                  Chọn ngày
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={tab === "daily" ? handleLoad : loadLeftover}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Calendar size={18} />
                  )}

                  {loading ? "Đang tải..." : "Xem báo cáo"}
                </button>

                <button
                  onClick={
                    tab === "daily" ? handleExport : handleLeftoverExport
                  }
                  disabled={exporting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {exporting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Download size={18} />
                  )}

                  {exporting ? "Đang xuất..." : "Xuất Excel"}
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === "daily" && report && <DailyReport report={report} />}

        {tab === "leftover" && leftover && (
          <LeftoverReport leftover={leftover} />
        )}

        {tab === "invoice" && <InvoiceReport />}
      </div>
    </div>
  );
}

function TabButton({ active, activeClass, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`min-w-[132px] flex-1 whitespace-nowrap border-b-4 px-4 py-4 text-sm font-bold transition sm:min-w-0 ${
        active
          ? activeClass
          : "border-transparent text-slate-500 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}

function DailyReport({ report }) {
  return (
    <div className="space-y-8">
      <section>
        <div className="mb-5">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <PieChart size={20} className="text-blue-600" />
            Tổng số lượng suất ăn
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Thống kê tổng số lượng từng món trong ngày
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
          {report.headers.map((h) => (
            <div
              key={h.id}
              className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-5"
            >
              <div className="truncate text-xs font-semibold uppercase tracking-wide text-slate-400">
                {h.name}
              </div>

              <div className="mt-4 flex items-end justify-between gap-2">
                <div className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {report.totals[h.name] || 0}
                </div>

                <div className="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                  suất
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <DesktopEmployeeTable report={report} />
      <MobileEmployeeCards report={report} />

      <DesktopFloorTable report={report} />
      <MobileFloorCards report={report} />
    </div>
  );
}

function SectionTitle({ icon, title, description, badge }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-6">
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          {icon}
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>

      {badge}
    </div>
  );
}

function DesktopEmployeeTable({ report }) {
  return (
    <section className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">
      <SectionTitle
        icon={<BarChart3 size={20} className="text-blue-600" />}
        title="Danh sách nhân viên"
        description="Chi tiết suất ăn của từng nhân viên"
        badge={
          <div className="shrink-0 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            {report.rows.length} nhân viên
          </div>
        }
      />

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

              {report.headers.map((h) => (
                <th
                  key={h.id}
                  className="whitespace-nowrap px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  {h.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {report.rows.map((row, index) => (
              <tr
                key={index}
                className="border-b border-slate-100 transition hover:bg-slate-50"
              >
                <td className="px-4 py-3 font-semibold text-slate-800">
                  {row.employeeId}
                </td>
                <td className="px-4 py-3 text-slate-600">{row.email}</td>
                <td className="px-4 py-3 text-center">
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
                    {row.floor}
                  </span>
                </td>

                {report.headers.map((h) => (
                  <td key={h.id} className="px-4 py-3 text-center">
                    {row.items[h.name] ? (
                      <span className="inline-flex min-w-[36px] items-center justify-center rounded-lg bg-blue-50 px-2 py-1 text-sm font-semibold text-blue-700">
                        {row.items[h.name]}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MobileEmployeeCards({ report }) {
  return (
    <section className="space-y-4 lg:hidden">
      {report.rows.length === 0 ? (
        <EmptyState text="Chưa có dữ liệu nhân viên." />
      ) : (
        report.rows.map((row, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4">
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-800">
                  {row.employeeId}
                </h3>

                <p className="mt-1 break-all text-xs text-slate-500">
                  {row.email}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
                Tầng {row.floor}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 sm:p-5">
              {report.headers.map((h) => (
                <FoodCountCard
                  key={h.id}
                  name={h.name}
                  quantity={row.items[h.name] || 0}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </section>
  );
}

function DesktopFloorTable({ report }) {
  return (
    <section className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">
      <SectionTitle
        icon={<BarChart3 size={20} className="text-blue-600" />}
        title="Thống kê theo tầng"
        description="Tổng số lượng suất ăn của từng tầng"
        badge={
          <div className="shrink-0 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
            {report.floors.length} tầng
          </div>
        }
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-slate-100">
            <tr>
              <th className="w-36 px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
                Tầng
              </th>

              {report.headers.map((h) => (
                <th
                  key={h.id}
                  className="whitespace-nowrap px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  {h.name}
                </th>
              ))}

              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
                Tổng
              </th>
            </tr>
          </thead>

          <tbody>
            {report.floors.map((floor) => (
              <tr
                key={floor.floor}
                className="border-b border-slate-100 transition hover:bg-slate-50"
              >
                <td className="px-4 py-4 text-center">
                  <span className="rounded-full bg-orange-100 px-4 py-2 font-bold text-orange-700">
                    Tầng {floor.floor}
                  </span>
                </td>

                {report.headers.map((h) => (
                  <td key={h.id} className="px-4 py-4 text-center">
                    <span className="inline-flex min-w-[38px] items-center justify-center rounded-lg bg-blue-50 px-2 py-1 font-semibold text-blue-700">
                      {floor.items[h.name] || 0}
                    </span>
                  </td>
                ))}

                <td className="px-4 py-4 text-center">
                  <span className="rounded-lg bg-emerald-100 px-3 py-2 font-bold text-emerald-700">
                    {floor.total}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MobileFloorCards({ report }) {
  return (
    <section className="space-y-4 lg:hidden">
      {report.floors.map((floor) => (
        <div
          key={floor.floor}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Tầng {floor.floor}
              </h3>
              <p className="mt-1 text-xs text-slate-500">Tổng số suất ăn</p>
            </div>

            <span className="shrink-0 rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
              {floor.total} suất
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 sm:p-5">
            {report.headers.map((h) => (
              <FoodCountCard
                key={h.id}
                name={h.name}
                quantity={floor.items[h.name] || 0}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function FoodCountCard({ name, quantity }) {
  return (
    <div className="min-w-0 rounded-2xl bg-slate-50 p-3">
      <div className="truncate text-xs font-medium text-slate-500">{name}</div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-lg font-bold text-slate-900 sm:text-xl">
          {quantity}
        </span>
        <span className="shrink-0 text-xs text-slate-400">suất</span>
      </div>
    </div>
  );
}

function LeftoverReport({ leftover }) {
  const foodType = {
    main: "Món cơm",
    drink: "Món nước",
    soup: "Món súp",
  };

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-4 px-1">
          <h2 className="text-lg font-bold">Thống kê món thừa</h2>
        </div>

        <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left">Món</th>
                  <th className="px-4 py-3 text-center">Loại</th>
                  <th className="px-4 py-3 text-center">Số lượng</th>
                </tr>
              </thead>

              <tbody>
                {leftover.leftovers.map((item) => (
                  <tr key={item.name} className="border-b">
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3 text-center">
                      {foodType[item.type] || item.type}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-red-600">
                      {item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:hidden">
          {leftover.leftovers.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="min-w-0">
                <p className="truncate font-bold text-slate-800">{item.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {foodType[item.type] || item.type}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-red-100 px-4 py-2 font-bold text-red-600">
                {item.quantity} suất
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 px-1">
          <h2 className="text-lg font-bold">Thống kê theo tầng</h2>
        </div>

        <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3">Tầng</th>

                  {leftover.leftovers.map((item) => (
                    <th key={item.name} className="whitespace-nowrap px-4 py-3">
                      {item.name}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {leftover.floors.map((floor) => (
                  <tr key={floor.floor} className="border-b">
                    <td className="px-4 py-3 text-center font-bold">
                      {floor.floor}
                    </td>

                    {leftover.leftovers.map((item) => (
                      <td key={item.name} className="px-4 py-3 text-center">
                        {floor.items[item.name] || 0}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4 lg:hidden">
          {leftover.floors.map((floor) => (
            <div
              key={floor.floor}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="mb-4 text-lg font-bold text-slate-800">
                Tầng {floor.floor}
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {leftover.leftovers.map((item) => (
                  <FoodCountCard
                    key={item.name}
                    name={item.name}
                    quantity={floor.items[item.name] || 0}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 px-1">
          <h2 className="text-lg font-bold">Danh sách nhân viên chưa nhận</h2>
        </div>

        <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left">Mã NV</th>
                  <th className="px-4 py-3 text-left">Tên</th>
                  <th className="px-4 py-3 text-center">Tầng</th>
                  <th className="px-4 py-3 text-left">Đã đặt món</th>
                </tr>
              </thead>

              <tbody>
                {leftover.users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400">
                      Không có nhân viên chưa nhận.
                    </td>
                  </tr>
                ) : (
                  leftover.users.map((user, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold">
                        {user.employeeId}
                      </td>
                      <td className="px-4 py-3">{user.name}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
                          {user.floor}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {user.foods.map((food, i) => (
                            <span
                              key={i}
                              className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                            >
                              {food}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4 lg:hidden">
          {leftover.users.length === 0 ? (
            <EmptyState text="Không có nhân viên chưa nhận." />
          ) : (
            leftover.users.map((user, index) => (
              <div
                key={index}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold">{user.name}</h3>
                    <p className="truncate text-sm text-slate-500">
                      {user.employeeId}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
                    Tầng {user.floor}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-sm text-slate-500">Đã đặt món</p>

                  <div className="flex flex-wrap gap-2">
                    {user.foods.map((food, i) => (
                      <span
                        key={i}
                        className="break-words rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                      >
                        {food}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-400 shadow-sm">
      {text}
    </div>
  );
}

export default Report;
