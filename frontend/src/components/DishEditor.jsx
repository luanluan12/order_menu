function DishEditor({

    dish,

    type,

    onChange,

    onImageChange,

    onRemove,

    onRemoveImage

}) {

    const imageUrl =

        dish.image instanceof File

            ? URL.createObjectURL(dish.image)

            : dish.image || null;

    return (

        <div className="rounded-xl border bg-white p-4 shadow-sm">

            {/* Image */}

            <div className="mb-4">

                <label className="flex h-44 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500">

                    {

                        imageUrl

                            ?

                            <img

                                src={imageUrl}

                                alt=""

                                className="h-full w-full object-cover"

                            />

                            :

                            <div className="text-center">

                                <div className="text-4xl">

                                    📷

                                </div>

                                <p className="mt-2 text-sm text-gray-500">

                                    Upload ảnh

                                </p>

                            </div>

                    }

                    <input

                        hidden

                        type="file"

                        accept="image/*"

                        onChange={(e) => {

                            onImageChange(

                                e.target.files[0]

                            );

                        }}

                    />

                </label>

                {

                    imageUrl &&

                    <button

                        type="button"

                        className="mt-2 w-full rounded bg-red-500 py-2 text-white"

                        onClick={onRemoveImage}

                    >

                        Xóa ảnh

                    </button>

                }

            </div>

            {/* Name */}

            <input

                className="mb-4 w-full rounded-lg border p-3"

                placeholder="Tên món"

                value={dish.name}

                onChange={(e) =>

                    onChange(

                        "name",

                        e.target.value

                    )

                }

            />

            {/* Type */}

            {

                type === "main" &&

                <div className="mb-4">

                    <label className="mb-2 block font-semibold">

                        Loại món

                    </label>

                    <div className="flex gap-5">

                        <label className="flex items-center gap-2">

                            <input

                                type="radio"

                                checked={

                                    dish.type ===

                                    "normal"

                                }

                                onChange={() =>

                                    onChange(

                                        "type",

                                        "normal"

                                    )

                                }

                            />

                            Thường

                        </label>

                        <label className="flex items-center gap-2">

                            <input

                                type="radio"

                                checked={

                                    dish.type ===

                                    "vegetarian"

                                }

                                onChange={() =>

                                    onChange(

                                        "type",

                                        "vegetarian"

                                    )

                                }

                            />

                            Chay

                        </label>

                    </div>

                </div>

            }

            {/* Delete */}

            <button

                type="button"

                onClick={onRemove}

                className="w-full rounded-lg bg-red-500 py-3 font-semibold text-white hover:bg-red-600"

            >

                Xóa món

            </button>

        </div>

    );

}

export default DishEditor;