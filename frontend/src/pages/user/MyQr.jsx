import { useEffect, useState } from "react";
import { getMyQr } from "../../api/orderApi";
import { toast } from "react-toastify";
import { QrCode } from "lucide-react";
import { useTranslation } from "react-i18next";

function MyQr() {

    const [qr, setQr] = useState(null);

    const { t } = useTranslation();

    useEffect(() => {

        loadQr();

    }, []);

    const loadQr = async () => {

        try {

            const res = await getMyQr();

            setQr(res.data.data);

        }

        catch (err) {

            toast.error(

                err.response?.data?.message ||

                t("cannot_load_qr")

            );

        }

    };

    if (!qr) {

        return (

            <div className="flex h-screen items-center justify-center">

                {t("loading")}

            </div>

        );

    }

    return (

        <div className="mx-auto mt-10 max-w-md">

            <div className="rounded-[28px] bg-white p-8 shadow-xl">

                <div className="text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">

                        <QrCode

                            size={34}

                            className="text-orange-500"

                        />

                    </div>

                    <h2 className="mt-5 text-3xl font-bold">

                        {t("qr_receive")}

                    </h2>

                    <p className="mt-2 text-gray-500">

                        {t("week")} {qr.week}

                    </p>

                </div>

                <img

                    src={qr.qrImage}

                    alt="QR"

                    className="mx-auto mt-8 w-[260px]"

                />

                <p className="mt-6 text-center text-gray-500">

                    {t("qr_description")}

                </p>

            </div>

        </div>

    );

}

export default MyQr;