import { Lightbulb } from "lucide-react";
import bepImage from "../assets/anh.png";

function OrderNotice() {
    return (
        <div
            className="
                mt-8
                flex
                items-center
                justify-between
                rounded-[28px]
                bg-gradient-to-r
                from-[#f8fcf8]
                via-[#f7fcfb]
                to-[#f6fbf7]
                px-10
                py-7
                shadow-sm
            "
        >
            {/* Left */}

            <div className="flex items-center gap-6">

                <div
                    className="
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-full
                        bg-orange-500
                        text-white
                        shadow-lg
                    "
                >
                    <Lightbulb size={32} />
                </div>

                <div>

                    <p className="text-[18px] font-semibold text-slate-800">
                        Bạn chỉ được chọn tối đa
                        <span className="text-orange-500">
                            {" "}2 phần món chính
                        </span>
                        {" "}hoặc
                        <span className="text-orange-500">
                            {" "}1 món nước / cháo.
                        </span>
                    </p>

                    <p className="mt-2 text-[15px] text-slate-500">
                        Vui lòng chọn đúng số lượng trước khi xác nhận.
                    </p>

                </div>

            </div>

            {/* Right */}

            <div className="hidden lg:flex items-center gap-6 text-6xl">

                <img
        src={bepImage}
        alt="Bep"
        className="h-24 w-auto object-contain"
    />

            </div>

        </div>
    );
}

export default OrderNotice;