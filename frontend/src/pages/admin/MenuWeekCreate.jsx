import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import WeekMenuEditor from "../../components/WeekMenuEditor";

import {

    createMenu

} from "../../api/menuApi";

function MenuWeekCreate() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleSave = async (formData) => {

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

            console.log(err.response);

    console.log(err.response.data);

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

            </div>

            <WeekMenuEditor


                onSave={handleSave}

            />

        </div>

    );

}

export default MenuWeekCreate;