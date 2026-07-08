import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { toast } from "react-toastify";

import {

    verifyInvite,

    createOrderFromInvite

} from "../../api/orderApi";

import WeekMenuContent from "../../components/WeekMenuContent";

function InviteOrder() {

    const { token } = useParams();

    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState(null);

    const [menu, setMenu] = useState(null);

    useEffect(() => {

        loadInvite();

    }, []);

    const loadInvite = async () => {

        try {

            const res = await verifyInvite(token);

            setUser(

                res.data.data.user

            );

            setMenu(

                res.data.data.menu

            );

        }

        catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Link không hợp lệ."

            );

        }

        finally {

            setLoading(false);

        }

    };

    const submit = async (days) => {

        try {

            const res = await createOrderFromInvite({

                token,

                days

            });

            toast.success(

                res.data.message

            );

        }

        catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Đặt món thất bại."

            );

        }

    };

    if (loading) {

        return (

            <div className="flex h-screen items-center justify-center">

                Đang tải...

            </div>

        );

    }

    if (!menu) {

        return (

            <div className="flex h-screen items-center justify-center">

                Link không hợp lệ.

            </div>

        );

    }

    return (

        <div className="mx-auto max-w-7xl p-6">

            <div className="mb-8">

                <h1 className="text-3xl font-bold">

                    Đặt món theo lời mời

                </h1>

                <p className="mt-2 text-gray-500">

                    Xin chào {user.name}

                </p>

                <p className="text-gray-500">

                    {user.email}

                </p>

            </div>

            <WeekMenuContent

                menu={menu}

                initialOrder={null}

                submitText="ĐẶT MÓN"

                onSubmit={submit}

            />

        </div>

    );

}

export default InviteOrder;