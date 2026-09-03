import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import WeekMenuEditor from "../../components/WeekMenuEditor";

import {

    createMenu,
    getMenus

} from "../../api/menuApi";

function MenuWeekCreate() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [historyMenus, setHistoryMenus] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    useEffect(() => {
        const loadHistoryMenus = async () => {
            try {
                const res = await getMenus();
                setHistoryMenus(res.data.data ?? res.data ?? []);
            } catch (err) {
                toast.error(err.response?.data?.message || "Không tải được menu các tuần trước.");
            } finally {
                setHistoryLoading(false);
            }
        };

        loadHistoryMenus();
    }, []);

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
                loading={loading}
                historyMenus={historyMenus}
                historyLoading={historyLoading}
                onSave={handleSave}

            />

        </div>

    );

}

export default MenuWeekCreate;
