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
  const [leftover, setLeftover] = useState(null);
  const [tab, setTab] = useState("daily");

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

  const loadLeftover = async () => {
    if (!date) return alert("Vui lòng chọn ngày.");

    try {
      setLoading(true);
      const res = await getLeftoverReport(date);
      setLeftover(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Không tải được báo cáo món thừa.");
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (data, filename) => {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    if (!date) return alert("Vui lòng chọn ngày.");

    try {
      setExporting(true);
      const res = await exportDailyReport(date);
      downloadFile(res.data, `Food_Report_${date}.xlsx`);
    } catch (err) {
      alert(JSON.stringify(err.response?.data || err.message));
    } finally {
      setExporting(false);
    }
  };

  const handleLeftoverExport = async () => {
    if (!date) return alert("Vui lòng chọn ngày.");

    try {
      setExporting(true);
      const res = await exportLeftoverReport(date);
      downloadFile(res.data, `Leftover_Report_${date}.xlsx`);
    } catch (err) {
      alert(JSON.stringify(err.response?.data || err.message));
    } finally {
      setExporting(false);
    }
  };

  const isDataTab = tab === "daily" || tab === "leftover";

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
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
                color="blue"
                onClick={() => setTab("daily")}
              >
                Daily Report
              </TabButton>

              <TabButton
                active={tab === "invoice"}
                color="emerald"
                onClick={() => setTab("invoice")}
              >
                Invoice Report
              </TabButton>

              <TabButton
                active={tab === "leftover"}
                color="red"
                onClick={() => setTab("leftover")}
              >
                Leftover Report
              </TabButton>
            </div>
          </div>
        </section>

        {isDataTab && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
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
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
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
          </section>
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

function TabButton({ active, color, onClick, children }) {
  const activeClass = {
    blue: "border-blue-600 bg-white text-blue-600",
    emerald: "border-emerald-600 bg-white text-emerald-600",
    red: "border-red-600 bg-white text-red-600",
  }[color];

  return (
    <button
      onClick={onClick}
      className={`min-w-[135px] flex-1 whitespace-nowrap border-b-4 px-4 py-4 text-sm font-bold transition sm:min-w-0 ${
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
          {report.headers.map((header) => (
            <div
              key={header.id}
              className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-5"
            >
              <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-400">
                {header.name}
              </p>

              <div className="mt-4 flex items-end justify-between gap-2">
                <strong className="text-2xl text-slate-900 sm:text-3xl">
                  {report.totals[header.name] || 0}
                </strong>

                <span className="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                  suất
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">
        <SectionHeader
          icon={<BarChart3 size={20} className="text-blue-600" />}
          title="Danh sách nhân viên"
          description="Chi tiết suất ăn của từng nhân viên"
          badge={`${report.rows.length} nhân viên`}
          badgeClass="bg-blue-50 text-blue-700"
        />

        <div className="max-h-[550px] overflow-auto">
          <table className="min-w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-100">
              <tr>
                <TableHeader>Mã NV</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader align="center">Tầng</TableHeader>

                {report.headers.map((header) => (
                  <TableHeader key={header.id} align="center">
                    {header.name}
                  </TableHeader>
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
                    <FloorBadge floor={row.floor} />
                  </td>

                  {report.headers.map((header) => (
                    <td key={header.id} className="px-4 py-3 text-center">
                      <CountBadge value={row.items[header.name] || 0} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

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

                <FloorBadge floor={row.floor} />
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 sm:p-5">
                {report.headers.map((header) => (
                  <FoodCard
                    key={header.id}
                    name={header.name}
                    value={row.items[header.name] || 0}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      <section className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">
        <SectionHeader
          icon={<BarChart3 size={20} className="text-blue-600" />}
          title="Thống kê theo tầng"
          description="Tổng số lượng suất ăn của từng tầng"
          badge={`${report.floors.length} tầng`}
          badgeClass="bg-orange-50 text-orange-600"
        />

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-slate-100">
              <tr>
                <TableHeader align="center">Tầng</TableHeader>

                {report.headers.map((header) => (
                  <TableHeader key={header.id} align="center">
                    {header.name}
                  </TableHeader>
                ))}

                <TableHeader align="center">Tổng</TableHeader>
              </tr>
            </thead>

            <tbody>
              {report.floors.map((floor) => (
                <tr
                  key={floor.floor}
                  className="border-b border-slate-100 transition hover:bg-slate-50"
                >
                  <td className="px-4 py-4 text-center">
                    <FloorBadge floor={floor.floor} />
                  </td>

                  {report.headers.map((header) => (
                    <td key={header.id} className="px-4 py-4 text-center">
                      <CountBadge value={floor.items[header.name] || 0} />
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
              {report.headers.map((header) => (
                <FoodCard
                  key={header.id}
                  name={header.name}
                  value={floor.items[header.name] || 0}
                />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function LeftoverReport({ leftover }) {
  const getType = (type) =>
    ({
      main: "Món cơm",
      drink: "Món nước",
      soup: "Món súp",
    })[type] || type;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 px-1 text-lg font-bold">Thống kê món thừa</h2>

        <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr>
                  <TableHeader>Món</TableHeader>
                  <TableHeader align="center">Loại</TableHeader>
                  <TableHeader align="center">Số lượng</TableHeader>
                </tr>
              </thead>

              <tbody>
                {leftover.leftovers.map((item) => (
                  <tr key={item.name} className="border-b">
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3 text-center">
                      {getType(item.type)}
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

        <div className="space-y-3 lg:hidden">
          {leftover.leftovers.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="min-w-0">
                <p className="truncate font-bold text-slate-800">{item.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {getType(item.type)}
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
        <h2 className="mb-4 px-1 text-lg font-bold">Thống kê theo tầng</h2>

        <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr>
                  <TableHeader align="center">Tầng</TableHeader>

                  {leftover.leftovers.map((item) => (
                    <TableHeader key={item.name} align="center">
                      {item.name}
                    </TableHeader>
                  ))}
                  <TableHeader align="center">Tổng</TableHeader>
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

                    <td className="px-4 py-3 text-center">
                      <span className="rounded-lg bg-emerald-100 px-3 py-2 font-bold text-emerald-700">
                        {floor.total}
                      </span>
                    </td>
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
              <div className="mb-4">
                <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
                  Tổng: {floor.total} suất
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {leftover.leftovers.map((item) => (
                  <FoodCard
                    key={item.name}
                    name={item.name}
                    value={floor.items[item.name] || 0}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 px-1 text-lg font-bold">
          Danh sách nhân viên chưa nhận
        </h2>

        <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr>
                  <TableHeader>Mã NV</TableHeader>
                  <TableHeader>Tên</TableHeader>
                  <TableHeader align="center">Tầng</TableHeader>
                  <TableHeader>Đã đặt món</TableHeader>
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
                        <FloorBadge floor={user.floor} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {user.foods.map((food, foodIndex) => (
                            <FoodTag key={foodIndex} food={food} />
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
                    <h3 className="truncate text-lg font-bold text-slate-800">
                      {user.name}
                    </h3>
                    <p className="truncate text-sm text-slate-500">
                      {user.employeeId}
                    </p>
                  </div>

                  <FloorBadge floor={user.floor} />
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-sm text-slate-500">Đã đặt món</p>

                  <div className="flex flex-wrap gap-2">
                    {user.foods.map((food, foodIndex) => (
                      <FoodTag key={foodIndex} food={food} />
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

function SectionHeader({ icon, title, description, badge, badgeClass }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-6">
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          {icon}
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <span
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${badgeClass}`}
      >
        {badge}
      </span>
    </div>
  );
}

function TableHeader({ children, align = "left" }) {
  return (
    <th
      className={`whitespace-nowrap px-4 py-3 text-${align} text-xs font-bold uppercase tracking-wider text-slate-600`}
    >
      {children}
    </th>
  );
}

function FloorBadge({ floor }) {
  return (
    <span className="shrink-0 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
      Tầng {floor}
    </span>
  );
}

function CountBadge({ value }) {
  if (!value) return <span className="text-slate-300">—</span>;

  return (
    <span className="inline-flex min-w-[36px] items-center justify-center rounded-lg bg-blue-50 px-2 py-1 text-sm font-semibold text-blue-700">
      {value}
    </span>
  );
}

function FoodCard({ name, value }) {
  return (
    <div className="min-w-0 rounded-2xl bg-slate-50 p-3">
      <p className="truncate text-xs font-medium text-slate-500">{name}</p>

      <div className="mt-2 flex items-center justify-between gap-2">
        <strong className="text-lg text-slate-900 sm:text-xl">{value}</strong>
        <span className="shrink-0 text-xs text-slate-400">suất</span>
      </div>
    </div>
  );
}

function FoodTag({ food }) {
  return (
    <span className="break-words rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
      {food}
    </span>
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
