import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";


function AddDishModal({
    open,
    dish = null,
    mode,
    title = "Thêm món",
    removable = false,
    onClose,
    onSave,
    onRemove,
}) {
    const [name, setName] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [image, setImage] = useState(null);
    const [vegetarian, setVegetarian] = useState(false);
    const [nameKo, setNameKo] = useState("");
    const [subtitleKo, setSubtitleKo] = useState("");

    useEffect(() => {

    if (!open) return;

    setName(dish?.name || "");

    setNameKo(dish?.nameKo || "");

    setSubtitle(dish?.subtitle || "");

    setSubtitleKo(dish?.subtitleKo || "");

    setImage(dish?.image || null);

    setVegetarian(dish?.vegetarian || false);

}, [open, dish]);

    if (!open) return null;

    const API_URL = import.meta.env.VITE_API_URL;

const preview =
    image instanceof File
        ? URL.createObjectURL(image)
        : image
            ? `${API_URL}${image}`
            : null;

    const submit = () => {

    if (!name.trim()) {

        alert("Vui lòng nhập tên món.");

        return;

    }

    if (!image) {

        alert("Vui lòng chọn ảnh món ăn.");

        return;

    }

    onSave({

    name: name.trim(),

    nameKo: nameKo.trim(),

    subtitle: subtitle.trim(),

    subtitleKo: subtitleKo.trim(),

    vegetarian,

    type:
    mode === "drink"
        ? "drink"
        : mode === "soup"
            ? "soup"
            : "normal",

    image,

});

    onClose();

};

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

            <div className="w-[300px] rounded-[24px] bg-white p-5 shadow-2xl">

                {/* Header */}

                <div className="mb-5 flex items-center justify-between">

                    <h2 className="text-[22px] font-bold text-slate-800">
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded-full p-2 transition hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Image */}

                <label
                    className="
    group
    mx-auto
    flex
    h-[180px]
    w-[180px]
    cursor-pointer
    items-center
    justify-center
    overflow-hidden
    rounded-2xl
    border-2
    border-dashed
    border-orange-300
    bg-orange-50
    transition
    hover:border-orange-500
    hover:bg-orange-100
"
                >
                    {preview ? (
                        <img
                            src={preview}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow">

                                <ImagePlus
                                    size={30}
                                    className="text-orange-500"
                                />

                            </div>

                            <p className="mt-4 text-sm font-medium text-gray-500">
                                Chọn ảnh món ăn
                            </p>

                        </div>
                    )}

                    <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setImage(e.target.files[0])
                        }
                    />
                </label>

                {/* Name */}

                <div className="mt-5">

                    <label className="mb-2 block text-sm font-semibold text-slate-700">

    Tên món (Tiếng Việt)

</label>

<input
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="Ví dụ: Cơm gà..."
    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[15px] outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
/>

<div className="mt-4">

    <label className="mb-2 block text-sm font-semibold text-slate-700">

        Tên món (한국어)

    </label>

    <input
        value={nameKo}
        onChange={(e) => setNameKo(e.target.value)}
        placeholder="예: 치킨 덮밥"
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[15px] outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
    />

</div>
                    <div className="mt-4">

    <label className="mb-2 block text-sm font-semibold text-slate-700">

        Định lượng

    </label>

    <input

        value={subtitle}

        onChange={(e) => setSubtitle(e.target.value)}

        placeholder="VD: 🔥 520 kcal • 180g"

        className="
            w-full
            rounded-xl
            border
            border-gray-300
            px-4
            py-3
            text-[15px]
            outline-none
            transition
            focus:border-orange-500
            focus:ring-2
            focus:ring-orange-100
        "

    />

</div>
<div className="mt-4">

    <label className="mb-2 block text-sm font-semibold text-slate-700">

        Định lượng (한국어)

    </label>

    <input
        value={subtitleKo}
        onChange={(e) => setSubtitleKo(e.target.value)}
        placeholder="예: 🔥 520 kcal • 180g"
        className="
            w-full
            rounded-xl
            border
            border-gray-300
            px-4
            py-3
            text-[15px]
            outline-none
            transition
            focus:border-orange-500
            focus:ring-2
            focus:ring-orange-100
        "
    />

</div>

                </div>
                {/*Chay*/}
                {

    (mode === "main-add" || mode === "main-edit")  && (

        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3">

            <label className="flex cursor-pointer items-center gap-3">

                <input

                    type="checkbox"

                    checked={vegetarian}

                    onChange={(e) =>

                        setVegetarian(e.target.checked)

                    }

                    className="h-5 w-5 accent-green-600"

                />

                <span className="font-medium text-green-700">

                    🌱 Món chay

                </span>

            </label>

        </div>

    )

}
                {/* Footer */}

                <div className="mt-6 flex items-center justify-between">

                    <div>

                        {removable && (
                            <button
                                onClick={() => {
                                    if (window.confirm("Xóa món này?")) {
                                        onRemove();
                                        onClose();
                                    }
                                }}
                                className="
                                    h-10
                                    rounded-xl
                                    bg-red-500
                                    px-5
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-red-600
                                "
                            >
                                Xóa
                            </button>
                        )}

                    </div>

                    <div className="flex gap-3">

                        <button
                            onClick={onClose}
                            className="
                                h-10
                                rounded-xl
                                border
                                border-gray-300
                                px-5
                                text-sm
                                font-semibold
                                transition
                                hover:bg-gray-50
                            "
                        >
                            Hủy
                        </button>

                        <button
                            onClick={submit}
                            className="
                                h-10
                                rounded-xl
                                bg-orange-500
                                px-6
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-orange-600
                            "
                        >
                            {dish ? "Lưu" : "Thêm"}
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AddDishModal;