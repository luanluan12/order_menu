import { useEffect, useState } from "react";

function AddDishModal({

    open,

    dish = null,

    title = "Thêm món",

    removable = false,

    onClose,

    onSave,

    onRemove

}) {

    const [name, setName] = useState("");

    const [image, setImage] = useState(null);

    useEffect(() => {

        if (!open) {

            return;

        }

        setName(

            dish?.name || ""

        );

        setImage(

            dish?.image || null

        );

    }, [

        open,

        dish

    ]);

    if (!open) {

        return null;

    }

    const preview =

        image instanceof File

            ?

            URL.createObjectURL(image)

            :

            image || null;

    const submit = () => {

        if (!name.trim()) {

            alert("Vui lòng nhập tên món.");

            return;

        }

        onSave({

            name,

            type:

                dish?.type ||

                "normal",

            image

        });

        onClose();

    };

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            <div className="w-[520px] rounded-3xl bg-white p-8 shadow-xl">

                {/* Header */}

                <div className="mb-8 flex items-center justify-between">

                    <h2 className="text-2xl font-bold">

                        {title}

                    </h2>

                    <button

                        onClick={onClose}

                        className="text-2xl text-gray-400 hover:text-red-500"

                    >

                        ✕

                    </button>

                </div>

                {/* Image */}

                <label className="flex h-64 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 transition hover:border-violet-500">

                    {

                        preview

                            ?

                            <img

                                src={preview}

                                alt=""

                                className="h-full w-full object-cover"

                            />

                            :

                            <div className="text-center">

                                <div className="text-6xl">

                                    📷

                                </div>

                                <p className="mt-4 text-gray-500">

                                    Chọn ảnh

                                </p>

                            </div>

                    }

                    <input

                        hidden

                        type="file"

                        accept="image/*"

                        onChange={(e) =>

                            setImage(

                                e.target.files[0]

                            )

                        }

                    />

                </label>

                {/* Name */}

                <div className="mt-8">

                    <label className="mb-2 block font-semibold">

                        Tên món

                    </label>

                    <input

                        value={name}

                        onChange={(e) =>

                            setName(

                                e.target.value

                            )

                        }

                        placeholder="Nhập tên món..."

                        className="w-full rounded-xl border border-gray-300 p-4 outline-none transition focus:border-violet-500"

                    />

                </div>

                {/* Footer */}

                <div className="mt-10 flex justify-between">

                    <div>

                        {

                            removable && (

                                <button

                                    onClick={() => {

                                        if (

                                            window.confirm(

                                                "Xóa món này?"

                                            )

                                        ) {

                                            onRemove();

                                            onClose();

                                        }

                                    }}

                                    className="rounded-xl bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600"

                                >

                                    Xóa

                                </button>

                            )

                        }

                    </div>

                    <div className="flex gap-3">

                        <button

                            onClick={onClose}

                            className="rounded-xl border border-gray-300 px-6 py-3 font-semibold"

                        >

                            Hủy

                        </button>

                        <button

                            onClick={submit}

                            className="rounded-xl bg-violet-600 px-8 py-3 font-semibold text-white transition hover:bg-violet-700"

                        >

                            {

                                dish

                                    ?

                                    "Lưu"

                                    :

                                    "Thêm"

                            }

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default AddDishModal;