import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import { Camera } from "lucide-react";
import { toast } from "react-toastify";

import { checkIn } from "../../api/checkinApi";

function Checkin() {

    const webcamRef = useRef(null);

    const canvasRef = useRef(null);

    const intervalRef = useRef(null);

    const [loading, setLoading] = useState(false);

    const [success, setSuccess] = useState(false);

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

                "Check-in thất bại."

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

                    Check-in nhận suất ăn

                </h1>

            </div>

            {

                success ? (

                    <div className="rounded-3xl bg-green-50 p-10 text-center">

                        <div className="text-6xl">

                            ✅

                        </div>

                        <h2 className="mt-4 text-2xl font-bold text-green-700">

                            Check-in thành công

                        </h2>

                        <p className="mt-3 text-gray-600">

                            Chúc bạn ngon miệng!

                        </p>

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

                                    ideal: "environment"

                                }

                            }}

                            className="aspect-square w-full rounded-3xl bg-black object-cover"

                        />

                        <canvas

                            ref={canvasRef}

                            hidden

                        />

                        <p className="mt-5 text-center text-gray-500">

                            Đưa QR của Admin vào khung hình để nhận suất ăn.

                        </p>

                    </>

                )

            }

        </div>

    );

}

export default Checkin;