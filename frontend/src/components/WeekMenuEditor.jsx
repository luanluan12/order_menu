import { useEffect, useState } from "react";

import DayMenuEditor from "./DayMenuEditor";

function WeekMenuEditor({
  initialData = null,

  onSave,

  loading = false,
  historyMenus = [],
  historyLoading = false,
}) {
  const [week, setWeek] = useState("");

  const [days, setDays] = useState([]);

  const [currentDay, setCurrentDay] = useState(0);

  const [openTime, setOpenTime] = useState("");

  const [deadline, setDeadline] = useState("");

  const [allowedWeek, setAllowedWeek] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [importedWeek, setImportedWeek] = useState("");
  useEffect(() => {
    if (!initialData) return;

    setWeek(initialData.week);

    setOpenTime(initialData.openTime ? initialData.openTime.slice(0, 16) : "");

    setDeadline(initialData.deadline ? initialData.deadline.slice(0, 16) : "");

    const loadedDays = initialData.days.map((day) => ({
      ...day,

      date: new Date(day.date),

      drink: day.drinks?.[0] || {
        name: "",
        image: null,
      },

      soup: day.soups?.[0] || {
        name: "",
        image: null,
      },

      mains: day.mains || [],
    }));

    setDays(loadedDays);

    setCurrentDay(0);
  }, [initialData]);

  useEffect(() => {
    if (initialData) return;

    const now = new Date();

    // Luôn tạo menu cho tuần sau
    now.setDate(now.getDate() + 7);

    const getISOWeek = (date) => {
      const d = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
      );

      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));

      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

      const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);

      return {
        year: d.getUTCFullYear(),

        week,
      };
    };

    const { year, week } = getISOWeek(now);

    const value = `${year}-W${String(week).padStart(2, "0")}`;
    setAllowedWeek(value);
    setWeek(value);
  }, [initialData]);
  // useEffect(() => {

  //     const now = new Date();

  //     // Demo: tạo menu tuần hiện tại
  //     // now.setDate(now.getDate() + 7);

  //     const getISOWeek = (date) => {

  //         const d = new Date(Date.UTC(
  //             date.getFullYear(),
  //             date.getMonth(),
  //             date.getDate()
  //         ));

  //         d.setUTCDate(
  //             d.getUTCDate() + 4 - (d.getUTCDay() || 7)
  //         );

  //         const yearStart = new Date(Date.UTC(
  //             d.getUTCFullYear(),
  //             0,
  //             1
  //         ));

  //         const week = Math.ceil(
  //             (((d - yearStart) / 86400000) + 1) / 7
  //         );

  //         return {
  //             year: d.getUTCFullYear(),
  //             week
  //         };

  //     };

  //     const { year, week } = getISOWeek(now);

  //     const value =
  //         `${year}-W${String(week).padStart(2, "0")}`;

  //     setAllowedWeek(value);

  //     setWeek(value);

  // }, []);
  useEffect(() => {
    if (initialData) return;

    if (!week) {
      setDays([]);

      return;
    }

    generateDays(week);
  }, [week, initialData]);

  const generateDays = (weekString) => {
    const [year, weekNumber] = weekString.split("-W");

    const monday = getMonday(
      Number(year),

      Number(weekNumber),
    );

    const names = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu"];

    const list = [];

    for (let i = 0; i < 5; i++) {
      const date = new Date(monday);

      date.setDate(monday.getDate() + i);

      list.push({
        name: names[i],

        date,

        mains: [],

        drink: {
          name: "",

          image: null,
        },

        soup: {
          name: "",

          image: null,
        },
      });
    }

    setDays(list);

    setCurrentDay(0);

    // ========================
    // Open Time
    // Thứ 4 tuần trước 09:00
    // ========================

    const openDate = new Date(monday);

    openDate.setDate(monday.getDate() - 5);

    // // Open Time: Thứ 4 tuần này
    // openDate.setDate(monday.getDate() + 2);

    openDate.setHours(9, 0, 0, 0);

    // ========================
    // Deadline
    // Thứ 6 tuần trước 16:00
    // ========================

    const deadlineDate = new Date(monday);

    deadlineDate.setDate(monday.getDate() - 3);

    // // Deadline: Thứ 6 tuần này
    // deadlineDate.setDate(monday.getDate() + 4);

    deadlineDate.setHours(16, 0, 0, 0);

    const formatDateTime = (date) => {
      const pad = (n) => String(n).padStart(2, "0");

      return (
        `${date.getFullYear()}-` +
        `${pad(date.getMonth() + 1)}-` +
        `${pad(date.getDate())}T` +
        `${pad(date.getHours())}:` +
        `${pad(date.getMinutes())}`
      );
    };

    setOpenTime(formatDateTime(openDate));

    setDeadline(formatDateTime(deadlineDate));
  };

  const getMonday = (year, week) => {
    const simple = new Date(Date.UTC(year, 0, 4));

    const day = simple.getUTCDay() || 7;

    simple.setUTCDate(simple.getUTCDate() - day + 1);

    simple.setUTCDate(simple.getUTCDate() + (week - 1) * 7);

    return new Date(simple);
  };

  // ===============================
  // Update day
  // ===============================

  const updateDay = (newDay) => {
    const clone = [...days];

    clone[currentDay] = newDay;

    setDays(clone);
  };

  const importMenu = (menu) => {
    setDays((currentDays) =>
      currentDays.map((day, index) => {
        const sourceDay = menu.days?.[index] || {};
        const cloneDish = (dish) => ({
          name: dish?.name || "",
          nameKo: dish?.nameKo || "",
          subtitle: dish?.subtitle || "",
          subtitleKo: dish?.subtitleKo || "",
          vegetarian: dish?.vegetarian || false,
          type: dish?.type || "normal",
          image: dish?.image || null,
          imagePublicId: dish?.imagePublicId || "",
        });

        return {
          ...day,
          mains: (sourceDay.mains || []).map(cloneDish),
          drink: sourceDay.drinks?.[0]
            ? cloneDish(sourceDay.drinks[0])
            : { name: "", image: null },
          soup: sourceDay.soups?.[0]
            ? cloneDish(sourceDay.soups[0])
            : { name: "", image: null },
        };
      }),
    );
    setCurrentDay(0);
    setImportedWeek(menu.week);
    setHistoryOpen(false);
  };

  // ===============================
  // Submit
  // ===============================

  const submit = () => {
    if (loading) return;

    if (!week) {
      alert("Vui lòng chọn tuần");

      return;
    }
    for (const day of days) {
      // Main
      for (const dish of day.mains) {
        if (!dish.name?.trim()) {
          alert(`${day.name}: Vui lòng nhập tên món.`);
          return;
        }

        if (!dish.image) {
          alert(`${day.name}: ${dish.name || "Món chính"} chưa có ảnh.`);
          return;
        }
      }

      // Drink
      if (day.drink?.name?.trim()) {
        if (!day.drink.image) {
          alert(`${day.name}: ${day.drink.name} chưa có ảnh.`);
          return;
        }
      }

      // Soup
      if (day.soup?.name?.trim()) {
        if (!day.soup.image) {
          alert(`${day.name}: ${day.soup.name} chưa có ảnh.`);
          return;
        }
      }
    }

    const formData = new FormData();

    // ========================
    // Week
    // ========================

    formData.append("week", week);

    formData.append(
      "year",

      Number(week.split("-W")[0]),
    );

    formData.append("openTime", openTime);

    formData.append("deadline", deadline);

    // ========================
    // JSON
    // ========================

    const jsonDays = days.map((day) => ({
      date: day.date,

      mains: day.mains.map((dish) => ({
        name: dish.name,

        nameKo: dish.nameKo || "",

        subtitle: dish.subtitle || "",

        subtitleKo: dish.subtitleKo || "",

        vegetarian: dish.vegetarian || false,

        type: dish.type || "normal",

        image: dish.image instanceof File ? "" : dish.image || "",
        imagePublicId: dish.imagePublicId || "",
      })),

      drinks: day.drink?.name
        ? [
            {
              name: day.drink.name,

              nameKo: day.drink.nameKo || "",

              subtitle: day.drink.subtitle || "",

              subtitleKo: day.drink.subtitleKo || "",

              type: "drink",

              image:
                day.drink.image instanceof File ? "" : day.drink.image || "",
              imagePublicId: day.drink.imagePublicId || "",
            },
          ]
        : [],

      soups: day.soup?.name
        ? [
            {
              name: day.soup.name,

              nameKo: day.soup.nameKo || "",

              subtitle: day.soup.subtitle || "",

              subtitleKo: day.soup.subtitleKo || "",

              type: "soup",

              image: day.soup.image instanceof File ? "" : day.soup.image || "",
              imagePublicId: day.soup.imagePublicId || "",
            },
          ]
        : [],

      desserts: [],
    }));

    console.log("DAYS", JSON.stringify(days, null, 2));

    formData.append(
      "days",

      JSON.stringify(jsonDays),
    );

    // ========================
    // Upload Images
    // ========================

    days.forEach((day, dayIndex) => {
      // Main

      day.mains.forEach((dish, dishIndex) => {
        if (dish.image instanceof File) {
          formData.append(
            `main_${dayIndex}_${dishIndex}_image`,

            dish.image,
          );
        }
      });

      // Drink

      if (day.drink?.image instanceof File) {
        formData.append(
          `drink_${dayIndex}_0_image`,

          day.drink.image,
        );
      }

      // Soup

      if (day.soup?.image instanceof File) {
        formData.append(
          `soup_${dayIndex}_0_image`,

          day.soup.image,
        );
      }
    });

    console.log(JSON.stringify(jsonDays, null, 2));

    onSave(formData);
  };

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="rounded-2xl bg-white p-4 shadow sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="week"
            value={week}
            min={allowedWeek}
            max={allowedWeek}
            disabled={!!initialData}
            onChange={(e) => setWeek(e.target.value)}
            className="w-full rounded-xl border p-3 sm:w-auto"
          />

          {!initialData && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setHistoryOpen((open) => !open)}
                disabled={historyLoading || historyMenus.length === 0}
                className="flex w-full items-center justify-between gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 font-semibold text-orange-700 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <span>{historyLoading ? "Đang tải menu cũ..." : "Menu của các tuần trước"}</span>
                <span aria-hidden="true">⌄</span>
              </button>

              {historyOpen && (
                <div className="absolute right-0 z-20 mt-2 max-h-72 w-full min-w-72 overflow-y-auto rounded-xl border bg-white p-2 shadow-xl sm:w-80">
                  {historyMenus
                    .filter((menu) => !week || menu.week < week)
                    .map((menu) => (
                    <button
                      key={menu._id}
                      type="button"
                      onClick={() => importMenu(menu)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left hover:bg-orange-50"
                    >
                      <span className="font-semibold">Tuần {menu.week}</span>
                      <span className="text-sm text-gray-500">
                        {menu.status === "published" ? "Đã gửi" : "Bản nháp"}
                      </span>
                    </button>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        {importedWeek && (
          <p className="mt-3 text-sm text-green-700">
            Đã lấy món từ tuần {importedWeek}. Ngày và thời gian gửi vẫn thuộc tuần {week}.
          </p>
        )}
      </div>

      <div className="mt-5">
        <div className="mt-5 grid grid-cols-2 gap-6"></div>
      </div>

      {week && (
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          {/* LEFT */}

          <div className="overflow-x-auto rounded-2xl bg-white p-3 shadow">
            <div className="flex gap-3 lg:block">
              {days.map(
                (
                  day,

                  index,
                ) => (
                  <button
                    key={index}
                    onClick={() => setCurrentDay(index)}
                    className={`min-w-[150px] lg:mb-3 lg:w-full rounded-xl p-4 transition

                                            ${
                                              currentDay === index
                                                ? "bg-orange-600 text-white"
                                                : "bg-gray-100"
                                            }`}
                  >
                    <div className="font-semibold">{day.name}</div>

                    <div className="text-sm">
                      {day.date.toLocaleDateString("vi-VN")}
                    </div>
                  </button>
                ),
              )}
            </div>
          </div>

          {/* RIGHT */}

          <div className="rounded-2xl bg-white p-4 shadow sm:p-6 lg:p-8">
            <DayMenuEditor day={days[currentDay]} onChange={updateDay} />
          </div>
        </div>
      )}

      {/* Submit */}

      {week && (
        <div className="flex justify-center lg:justify-end">
          <button
            onClick={submit}
            disabled={loading}
            className={`w-full rounded-xl px-8 py-4 font-semibold text-white transition lg:w-auto
        ${
          loading
            ? "cursor-not-allowed bg-gray-400"
            : "bg-orange-600 hover:bg-orange-700"
        }`}
          >
            {loading ? "Đang tạo menu..." : "💾 Lưu Menu Tuần"}
          </button>
        </div>
      )}
    </div>
  );
}

export default WeekMenuEditor;
