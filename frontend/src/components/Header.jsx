import {
    FaBell,
    FaCog,
    FaSearch
} from "react-icons/fa";

function Header() {

    const user = JSON.parse(

        localStorage.getItem("user")

    );

    return (

        <header className="flex h-24 items-center justify-between border-b border-gray-200 bg-[#F7F8FC] px-10">

            {/* Left */}

            <div>

                <h1 className="text-3xl font-bold text-gray-800">

                    Hello,

                    <span className="ml-2 text-violet-600">

                        {user?.name || "Admin"}

                    </span>

                    👋

                </h1>

            </div>

            {/* Right */}

            <div className="flex items-center gap-5">

                {/* Setting */}

                <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition hover:bg-violet-50">

                    <FaCog className="text-gray-600" />

                </button>


            </div>

        </header>

    );

}

export default Header;