import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import WeekTableEditor from "../../components/WeekTableEditor";

import {

    createMenu

} from "../../api/menuApi";

function MenuWeekCreate() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleSave = async (formData) => {
        console.log("===== HANDLE SAVE =====");
        console.log(formData);

        alert("handleSave");

        try {

            setLoading(true);

            const res = await createMenu(formData);

            toast.success(

                res.data.message ||

                "Tạo Menu tuần thành công."

            );

            navigate("/admin/menu");

        }

        catch (err) {

            console.log(err);

            toast.error(

                err.response?.data?.message ||

                "Tạo Menu thất bại."

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="p-6">

            <div className="mb-6 flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">

                        Tạo Menu Tuần

                    </h1>

                    <p className="mt-2 text-gray-500">

                        Nhập thực đơn cho cả tuần

                    </p>

                </div>

            </div>

            <WeekTableEditor

                loading={loading}

                onSave={handleSave}

            />

        </div>

    );

}

export default MenuWeekCreate;