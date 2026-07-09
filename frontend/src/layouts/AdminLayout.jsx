import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function AdminLayout() {

    return (

        <div className="flex h-screen bg-[#F7F8FC]">

            {/* Sidebar */}

            <aside className="w-[280px] shrink-0 border-r border-gray-200 bg-white">

                <Sidebar />

            </aside>

            {/* Main */}

            <div className="flex flex-1 flex-col overflow-hidden">

                {/* Header */}

                <Header />

                {/* Content */}

                <main className="flex-1 overflow-y-auto p-8">

                    <div className="mx-auto max-w-[1500px]">

                        <Outlet />

                    </div>

                </main>

            </div>

        </div>

    );

}

export default AdminLayout;