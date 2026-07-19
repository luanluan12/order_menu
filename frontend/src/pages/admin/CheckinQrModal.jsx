import { useEffect, useState } from "react";
import { X, QrCode } from "lucide-react";
import { toast } from "react-toastify";
import socket from "../../socket";
import { getTodayQr } from "../../api/checkinApi";

function CheckinQrModal({ open, onClose }) {

    const [loading, setLoading] = useState(false);

    const [qr, setQr] = useState(null);

    const [checkins, setCheckins] = useState([]);

    const [queue, setQueue] = useState([]);

    const [currentCheckin, setCurrentCheckin] = useState(null);

    useEffect(() => {

        if (!open) {

            setQr(null);

            return;

        }

        loadQr();

    }, [open]);

    useEffect(() => {

    if (!open) return;

    socket.on("checkin-success", (data) => {

    setCheckins(prev => [

        {
        ...data,
        isNew: true
    },

        ...prev

    ]);

    setQueue(prev => [

        ...prev,

        data

    ]);

});

    return () => {

        socket.off("checkin-success");

    };

}, [open]);
useEffect(() => {

    if (currentCheckin) return;

    if (queue.length === 0) return;

    const next = queue[0];

    setCurrentCheckin(next);

    setQueue(prev => prev.slice(1));

    const timer = setTimeout(() => {

        setCurrentCheckin(null);

    }, 4000);

    return () => clearTimeout(timer);

}, [queue, currentCheckin]);
useEffect(() => {

    if (checkins.length === 0) return;

    const newest = checkins[0];

    if (!newest.isNew) return;

    const timer = setTimeout(() => {

        setCheckins(prev =>

            prev.map((item, index) =>

                index === 0

                    ? {
                          ...item,
                          isNew: false
                      }

                    : item

            )

        );

    }, 10000);

    return () => clearTimeout(timer);

}, [checkins]);

    const loadQr = async () => {

        try {

            setLoading(true);

            const res = await getTodayQr();
            console.log("Response:", res.data);

            setQr(res.data.data);

        }

        catch (err) {

            console.log("Error:", err);

        console.log(err.response);

            toast.error(

                err.response?.data?.message ||

                "Không tải được QR."

            );

        }

        finally {

            setLoading(false);

        }

    };

    if (!open) return null;

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

            <div className="w-full max-w-md rounded-3xl bg-white shadow-xl">

                {/* Header */}

                <div className="flex items-center justify-between border-b p-5">

                    <div className="flex items-center gap-3">

                        <QrCode className="text-orange-500" />

                        <h2 className="text-xl font-bold">

                            QR Check-in

                        </h2>

                    </div>

                    <button

                        onClick={onClose}

                        className="rounded-lg p-2 hover:bg-gray-100"

                    >

                        <X />

                    </button>

                </div>

                {/* Body */}

                <div className="p-6">

                    {

                        loading ? (

                            <div className="py-16 text-center">

                                Đang tải QR...

                            </div>

                        ) : (

                            qr && (

                                <>

                                    <div className="flex flex-col items-center">

    <img
        src={qr.qrImage}
        alt="QR Check-in"
        className="h-44 w-44 rounded-2xl border border-gray-200 bg-white p-2 shadow"
    />

    <div className="mt-5 w-full rounded-2xl border border-orange-100 bg-orange-50 p-4">

        <div className="grid grid-cols-2 gap-4">

            <div className="rounded-xl bg-white p-3 text-center shadow-sm">

                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    📅 Ngày
                </div>

                <div className="mt-1 text-base font-bold text-gray-800">
    {new Date().toLocaleDateString("vi-VN")}
</div>

            </div>

            <div className="rounded-xl bg-white p-3 text-center shadow-sm">

                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    🏢 Tầng
                </div>

                <div className="mt-1 text-xl font-bold text-orange-600">
                    {qr.floor}
                </div>

            </div>

        </div>

    </div>

</div>


                                    <div className="mt-8">

    <h3 className="mb-3 text-lg font-bold">

        Đã nhận hôm nay

    </h3>

    <div className="max-h-80 space-y-3 overflow-y-auto">

        {

            checkins.length === 0 ? (

                <div className="rounded-xl bg-gray-50 p-4 text-center text-gray-500">

                    Chưa có ai nhận suất ăn.

                </div>

            ) : (

                checkins.map((item, index) => (

                    <div

                        key={index}

                        className={`rounded-xl border p-4 shadow transition-all duration-300 ${
    item.isNew
        ? "border-green-500 bg-green-50"
        : "border-gray-200 bg-white"
}`}

                    >

                        <div className="flex items-center justify-between">

                            <div>
                                {item.isNew && (

    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white animate-pulse">

        <span className="h-2 w-2 rounded-full bg-white"></span>

        MỚI

    </div>

)}

                                <p className="font-bold">

                                    {item.employee.name}

                                </p>

                                <p className="text-sm text-gray-500">

                                    Tầng {item.employee.floor}

                                </p>

                            </div>

                            <div className="text-sm text-orange-600">

                                {

                                    new Date(item.receivedAt)

                                        .toLocaleTimeString("vi-VN")

                                }

                            </div>

                        </div>

                        <div className="mt-3 text-sm">

                            {

                                item.mains?.map((food, i) => (

                                    <div key={i}>

                                        🍱 {food.name}

                                        {

                                            food.quantity > 1 &&

                                            ` x${food.quantity}`

                                        }

                                    </div>

                                ))

                            }

                            {

                                item.soup && (

                                    <div>

                                        🍲 {item.soup.name}

                                    </div>

                                )

                            }

                            {

                                item.drink && (

                                    <div>

                                        🥤 {item.drink.name}

                                    </div>

                                )

                            }

                        </div>

                    </div>

                ))

            )

        }

    </div>

</div>

                                </>

                            )

                        )

                    }

                </div>

            </div>

        </div>

    );

}

export default CheckinQrModal;