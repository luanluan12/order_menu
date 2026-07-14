import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function DeadlineBanner() {

    const [text, setText] = useState("");

    const [expired, setExpired] = useState(false);

    const { t , i18n} = useTranslation();

    useEffect(() => {

        const update = () => {

            const now = new Date();

            const deadline = new Date();

            // Tìm thứ 6 tuần hiện tại
            const day = now.getDay(); // CN=0 ... T7=6

            const diff =
                day === 0
                    ? 5
                    : 5 - day;

            deadline.setDate(now.getDate() + diff);

            deadline.setHours(17, 0, 0, 0);

            const remain = deadline - now;

            if (remain <= 0) {

                setExpired(true);

                setText(t("order_closed"));

                return;

            }

            const days = Math.floor(remain / 86400000);

            const hours = Math.floor(
                (remain % 86400000) / 3600000
            );

            const minutes = Math.floor(
                (remain % 3600000) / 60000
            );

            setExpired(false);

            let value = "";

            if (days > 0) {
    value += `${days} ${t("day")} `;
}

value += `${hours} ${t("hour")} ${minutes} ${t("minute")}`;

            setText(value);

        };

        update();

        const timer = setInterval(update, 1000);

        return () => clearInterval(timer);

    }, [i18n.language]);

    return (

        <div
            className={`
                mb-6 rounded-2xl border p-4 text-center shadow

                ${
                    expired
                        ? "border-red-300 bg-red-50"
                        : "border-orange-300 bg-orange-50"
                }
            `}
        >

            <div className="text-sm text-gray-500">

                ⏰ {t("order_deadline_remaining")}

            </div>

            <div
                className={`
                    mt-2 text-2xl font-bold

                    ${
                        expired
                            ? "text-red-600"
                            : "text-orange-600"
                    }
                `}
            >

                {text}

            </div>

        </div>

    );

}

export default DeadlineBanner;