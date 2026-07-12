import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";

function AddDishModal({
    open,
    dish = null,
    title = "Thêm món",
    removable = false,
    onClose,
    onSave,
    onRemove,
}) {
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (!open) return;

        setName(dish?.name || "");
        setImage(dish?.image || null);
    }, [open, dish]);

    if (!open) return null;

    const preview =
        image instanceof File
            ? URL.createObjectURL(image)
            : image || null;

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

        type: dish?.type || "normal",

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
                        Tên món
                    </label>

                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nhập tên món..."
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