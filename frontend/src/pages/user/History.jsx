import { useEffect, useState } from "react";

import { getHistory } from "../../api/orderApi";

import HistoryCard from "../../components/HistoryCard";

function History() {

    const [histories, setHistories] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadHistory();

    }, []);

    const loadHistory = async () => {

        try {

            const res = await getHistory();

            setHistories(res.data.data);

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="p-10">

                Đang tải...

            </div>

        );

    }

    return (

        <div className="mx-auto max-w-5xl p-8">

            <h1 className="mb-8 text-3xl font-bold">

                Lịch sử đặt món

            </h1>

            <div className="space-y-6">

                {

                    histories.length === 0 ?

                        (

                            <div className="rounded-xl border p-10 text-center text-gray-500">

                                Chưa có lịch sử đặt món

                            </div>

                        )

                        :

                        (

                            histories.map(history => (

                                <HistoryCard

                                    key={history.menuId}

                                    history={history}

                                />

                            ))

                        )

                }

            </div>

        </div>

    );

}

export default History;