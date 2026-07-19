import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import { Camera } from "lucide-react";
import { toast } from "react-toastify";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { checkIn } from "../../api/checkinApi";

function Checkin() {

    const webcamRef = useRef(null);

    const canvasRef = useRef(null);

    const intervalRef = useRef(null);

    const [loading, setLoading] = useState(false);

    const [success, setSuccess] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {

        intervalRef.current = setInterval(

            scanFrame,

            300

        );

        return () => {

            clearInterval(intervalRef.current);

        };

    }, []);

    const scanFrame = async () => {

        if (loading || success) return;

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

            const res = await checkIn({

                token

            });

            toast.success(

                res.data.message

            );

            setSuccess(true);

        }

        catch (err) {

            toast.error(
    err.response?.data?.message ||
    t("checkin_failed")
);

            intervalRef.current = setInterval(

                scanFrame,

                300

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="mx-auto max-w-xl p-6">

            <div className="mb-6 flex items-center gap-3">

                <Camera className="text-orange-500" />

                <h1 className="text-2xl font-bold">

                    {t("checkin_title")}

                </h1>

            </div>

            {success ? (
    <div className="mx-auto mt-6 max-w-lg rounded-[36px] bg-white px-8 py-12 text-center shadow-2xl">
        <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-orange-500">
            <Check
                size={72}
                strokeWidth={3.5}
                className="text-white"
            />
        </div>

        <h2 className="mt-10 text-4xl font-extrabold text-[#132B6B]">
            {t("checkin_success")}
        </h2>

        <p className="mt-5 text-2xl text-gray-500">
            {t("enjoy_meal")}
        </p>

        <button
            onClick={() => {

        navigate("/history");

    }}
            className="
                mt-12
                h-16
                w-full
                rounded-full
                bg-orange-500
                text-3xl
                font-bold
                text-white
                transition
                hover:bg-orange-600
            "
        >
            {t("close")}
        </button>
    </div>
) : (
    <>
        <Webcam
            ref={webcamRef}
            audio={false}
            mirrored={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{
                facingMode: {
                    ideal: "environment",
                },
            }}
            className="aspect-square w-full rounded-3xl bg-black object-cover"
        />

        <canvas ref={canvasRef} hidden />

        <p className="mt-5 text-center text-gray-500">
            {t("checkin_instruction")}
        </p>
    </>
)}

        </div>

    );

}

export default Checkin;