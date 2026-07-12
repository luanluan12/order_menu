import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import { Camera, X } from "lucide-react";
import { toast } from "react-toastify";

import {

    previewQr,

    confirmReceive

} from "../../api/orderApi";

function QrScannerModal({

    open,

    onClose,

    onSuccess

}) {

    const webcamRef = useRef(null);

    const canvasRef = useRef(null);

    const intervalRef = useRef(null);

    const [loading, setLoading] = useState(false);

    const [preview, setPreview] = useState(null);

    const [orderId, setOrderId] = useState(null);

    useEffect(() => {

        if (!open) {

            clearInterval(intervalRef.current);

            setPreview(null);

            setOrderId(null);

            setLoading(false);

            return;

        }

        intervalRef.current = setInterval(

            scanFrame,

            300

        );

        return () => {

            clearInterval(intervalRef.current);

        };

    }, [open]);

    const scanFrame = async () => {

    if (loading) return;

    const webcam = webcamRef.current;

    if (!webcam?.video) return;

    const video = webcam.video;

    if (video.readyState !== 4) return;

    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;

    canvas.height = video.videoHeight;

    ctx.drawImage(

        video,

        0,

        0,

        canvas.width,

        canvas.height

    );

    const imageData = ctx.getImageData(

        0,

        0,

        canvas.width,

        canvas.height

    );

    const qr = jsQR(

        imageData.data,

        imageData.width,

        imageData.height

    );

    if (!qr) return;

    clearInterval(intervalRef.current);

    setLoading(true);

    try {

        let token = "";

        try {

            token = JSON.parse(qr.data).token;

        }

        catch {

            token = qr.data;

        }
        const res = await previewQr({

            token

        });

        setOrderId(

            res.data.data.orderId

        );

        setPreview(

            res.data.data

        );
        setLoading(false);

    }

    // catch (err) {

    //     toast.error(

    //         err.response?.data?.message ||

    //         "QR không hợp lệ."

    //     );

    //     intervalRef.current = setInterval(

    //         scanFrame,

    //         300

    //     );

    // }

    // finally {

    //     setLoading(false);

    // }
catch (err) {

    console.log(err);

    intervalRef.current = setInterval(

        scanFrame,

        300

    );

    setLoading(false);

}

};

const handleConfirm = async () => {
    if (!preview?.hasMeal) {

        toast.warning("Hôm nay nhân viên không đăng ký suất ăn.");

        return;

    }

    if (!orderId) return;

    try {

        setLoading(true);

        await confirmReceive({

            orderId

        });

        toast.success(

            "Nhận món thành công."

        );

        setPreview(null);

        setOrderId(null);

        onClose();

        await onSuccess?.();

    }

    catch (err) {

        toast.error(

            err.response?.data?.message ||

            "Xác nhận thất bại."

        );

    }

    finally {

        setLoading(false);

    }

};

const handleScanAgain = () => {

    setPreview(null);

    setOrderId(null);

    setLoading(false);

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(

        scanFrame,

        300

    );

};

const handleClose = () => {

    clearInterval(intervalRef.current);

    setPreview(null);

    setOrderId(null);

    setLoading(false);

    onClose();

};
if (!open) return null;

return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

        <div className="w-full max-w-lg rounded-3xl bg-white shadow-xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b p-5">

                <div className="flex items-center gap-3">

                    <Camera className="text-orange-500" />

                    <h2 className="text-xl font-bold">

                        Nhận suất ăn

                    </h2>

                </div>

                <button

                    onClick={handleClose}

                    className="rounded-lg p-2 hover:bg-gray-100"

                >

                    <X />

                </button>

            </div>

            <div className="p-6">

                {

                    !preview && (

                        <>

                            <Webcam

                                ref={webcamRef}

                                audio={false}

                                mirrored={false}

                                screenshotFormat="image/jpeg"

                                videoConstraints={{

                                    facingMode: {

                                        ideal: "environment"

                                    }

                                }}

                                className="aspect-square w-full rounded-2xl bg-black object-cover"

                            />

                            <canvas

                                ref={canvasRef}

                                hidden

                            />

                            <p className="mt-5 text-center text-gray-500">

                                Đưa mã QR của nhân viên vào khung hình.

                            </p>

                        </>

                    )

                }

                {

                    preview && (

                        <div>

                            <div className="rounded-2xl bg-orange-50 p-5">

                                <h3 className="text-xl font-bold">

                                    {preview.employee.name}

                                </h3>

                                <p className="mt-2">

                                    Employee ID :

                                    <b>

                                        {" "}

                                        {preview.employee.employeeId}

                                    </b>

                                </p>

                                <p>

                                    Email :

                                    <b>

                                        {" "}

                                        {preview.employee.email}

                                    </b>

                                </p>

                                <p>

                                    Floor :

                                    <b>

                                        {" "}

                                        {preview.employee.floor}

                                    </b>

                                </p>

                            </div>

                            <div className="mt-6">

                                <h3 className="mb-3 text-lg font-bold">

    {preview.hasMeal
        ? "Món đã đặt"
        : "Hôm nay không đăng ký suất ăn"}

</h3>

                                {preview.hasMeal ? (

    <div className="space-y-3">

        {preview.mains.map((item, index) => (

            <div
                key={index}
                className="flex items-center justify-between rounded-xl border p-3"
            >
                <span>🍛 {item.name}</span>
                <span>x{item.quantity}</span>
            </div>

        ))}

        {preview.drink && (

            <div className="rounded-xl border p-3">

                🥤 {preview.drink.name}

            </div>

        )}

        {preview.soup && (

            <div className="rounded-xl border p-3">

                🍲 {preview.soup.name}

            </div>

        )}

    </div>

) : (

    <div className="rounded-2xl bg-yellow-50 p-5 text-center">

        <div className="text-5xl">🍽️</div>

        <p className="mt-3 font-semibold text-orange-600">

            Nhân viên không đăng ký suất ăn hôm nay.

        </p>

    </div>

)}

                            </div>

                            {

                                preview.received && (

                                    <div className="mt-5 rounded-xl bg-red-100 p-4 text-center font-bold text-red-600">

                                        Nhân viên đã nhận suất ăn.

                                    </div>

                                )

                            }

                            <div className="mt-8 flex gap-3">

    {preview.hasMeal ? (

        <button

            onClick={handleConfirm}

            disabled={
                loading ||
                preview.received
            }

            className="flex-1 rounded-xl bg-green-600 py-3 font-bold text-white hover:bg-green-700 disabled:bg-gray-400"

        >

            {

                loading

                    ? "Đang xác nhận..."

                    : "Xác nhận nhận món"

            }

        </button>

    ) : (

        <button

            onClick={handleScanAgain}

            className="flex-1 rounded-xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600"

        >

            Quét QR khác

        </button>

    )}

</div>

                        </div>

                    )

                }

            </div>

        </div>

    </div>

);

}

export default QrScannerModal;