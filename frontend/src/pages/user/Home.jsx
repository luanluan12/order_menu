import WeekMenu from "./WeekMenu";
import Header from "./components/Header";

import bgFood from "../../assets/bgfood.png";

function Home() {

    return (

        <div
            className="min-h-screen bg-cover bg-center bg-fixed"
            style={{
                backgroundImage: `url(${bgFood})`,
            }}
        >

            {/* Lớp phủ trắng mờ */}

            <div className="min-h-screen">

                <Header />

                <div className="mx-auto max-w-7xl p-6">

                    <WeekMenu />

                </div>

            </div>

        </div>

    );

}

export default Home;