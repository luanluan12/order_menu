import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import WeekMenuEditor from "../../components/WeekMenuEditor";

import {
    getMenuById,
    updateMenu,
} from "../../api/menuApi";

function MenuWeekEdit() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [loading, setLoading] = useState(true);

    const [menu, setMenu] = useState(null);

    useEffect(() => {

        loadMenu();

    }, [id]);

    const loadMenu = async () => {

        try {

            setLoading(true);

            const res = await getMenuById(id);

            setMenu(res.data.data);

        }

        catch (err) {

            console.log(err);

            toast.error(

                err.response?.data?.message ||

                "Không tải được menu."

            );

            navigate("/admin/menu");

        }

        finally {

            setLoading(false);

        }

    };

    const handleSave = async (formData) => {

        try {

            setLoading(true);

            const res = await updateMenu(
                id,
                formData
            );

            toast.success(

                res.data.message ||

                "Cập nhật menu thành công."

            );

            navigate("/admin/menu");

        }

        catch (err) {

            console.log(err);

            toast.error(

                err.response?.data?.message ||

                "Cập nhật thất bại."

            );

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="flex h-[70vh] items-center justify-center">

                <div className="text-lg font-semibold">

                    Đang tải...

                </div>

            </div>

        );

    }

    if (!menu) {

        return (

            <div className="flex h-[70vh] items-center justify-center">

                <div className="text-lg text-red-500">

                    Không tìm thấy menu.

                </div>

            </div>

        );

    }

    return (

        <div className="p-6">

            <WeekMenuEditor

                initialData={menu}

                onSave={handleSave}

            />

        </div>

    );

}

export default MenuWeekEdit;