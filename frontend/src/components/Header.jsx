import { useEffect, useState } from "react";
import {
    FaBell,
    FaSearch,
    FaUserCircle,
} from "react-icons/fa";

function Header() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();

            setCurrentTime(
                now.toLocaleString("vi-VN", {
                    dateStyle: "full",
                    timeStyle: "medium",
                })
            );
        };

        updateTime();

        const timer = setInterval(updateTime, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8 shadow-sm">

            {/* Left */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Dashboard
                </h1>

                <p className="text-sm text-gray-500">
                    {currentTime}
                </p>
            </div>

            {/* Center */}
            <div className="hidden w-96 items-center rounded-xl border bg-gray-50 px-4 py-2 md:flex">

                <FaSearch className="mr-3 text-gray-400" />

                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-transparent outline-none"
                />

            </div>

            {/* Right */}
            <div className="flex items-center gap-6">

                <button className="relative">

                    <FaBell
                        size={22}
                        className="text-gray-600"
                    />

                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        3
                    </span>

                </button>

                <div className="flex items-center gap-3">

                    <FaUserCircle
                        size={40}
                        className="text-blue-600"
                    />

                    <div>

                        <h3 className="font-semibold">
                            {user?.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                            {user?.role}
                        </p>

                    </div>

                </div>

            </div>

        </header>
    );
}

export default Header;