import { useEffect, useState } from "react";

function MenuModal({

    open,

    onClose,

    onSave,

    editingMenu

}) {

    const [form, setForm] = useState({

        date: "",

        mainNormal: "",
        mainVegetarian: "",
        drink: "",
        soup: "",
        dessert: "",
        buffet: "",

        mainNormalImage: null,
        mainVegetarianImage: null,
        drinkImage: null,
        soupImage: null,
        dessertImage: null,
        buffetImage: null

    });

    useEffect(() => {

        if (editingMenu) {

            setForm({

                date: editingMenu.date?.substring(0, 10),

                mainNormal: editingMenu.mainNormal || "",
                mainVegetarian: editingMenu.mainVegetarian || "",
                drink: editingMenu.drink || "",
                soup: editingMenu.soup || "",
                dessert: editingMenu.dessert || "",
                buffet: editingMenu.buffet || "",

                mainNormalImage: null,
                mainVegetarianImage: null,
                drinkImage: null,
                soupImage: null,
                dessertImage: null,
                buffetImage: null

            });

        }

        else {

            setForm({

                date: "",

                mainNormal: "",
                mainVegetarian: "",
                drink: "",
                soup: "",
                dessert: "",
                buffet: "",

                mainNormalImage: null,
                mainVegetarianImage: null,
                drinkImage: null,
                soupImage: null,
                dessertImage: null,
                buffetImage: null

            });

        }

    }, [editingMenu, open]);

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const handleFile = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.files[0]

        });

    };

    const handleSubmit = () => {

        if (!form.date)
            return alert("Chưa chọn ngày");

        if (!form.mainNormal)
            return alert("Nhập món chính");

        if (!form.mainVegetarian)
            return alert("Nhập món chay");

        if (!form.drink)
            return alert("Nhập nước");

        if (!form.soup)
            return alert("Nhập canh");

        onSave(form);

    };

    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-[800px] p-8">

                <h2 className="text-2xl font-bold mb-6">

                    {editingMenu ? "Sửa Menu" : "Thêm Menu"}

                </h2>

                <div className="grid grid-cols-2 gap-5">

                    <div>
                        <label>Ngày</label>

                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-lg p-3"
                        />
                    </div>

                    <div></div>

                    <div>
                        <label>Món thường</label>

                        <input
                            name="mainNormal"
                            value={form.mainNormal}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-lg p-3"
                        />

                        <input
                            type="file"
                            name="mainNormalImage"
                            accept="image/*"
                            onChange={handleFile}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <label>Món chay</label>

                        <input
                            name="mainVegetarian"
                            value={form.mainVegetarian}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-lg p-3"
                        />

                        <input
                            type="file"
                            name="mainVegetarianImage"
                            accept="image/*"
                            onChange={handleFile}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <label>Nước uống</label>

                        <input
                            name="drink"
                            value={form.drink}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-lg p-3"
                        />

                        <input
                            type="file"
                            name="drinkImage"
                            accept="image/*"
                            onChange={handleFile}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <label>Canh</label>

                        <input
                            name="soup"
                            value={form.soup}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-lg p-3"
                        />

                        <input
                            type="file"
                            name="soupImage"
                            accept="image/*"
                            onChange={handleFile}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <label>Tráng miệng</label>

                        <input
                            name="dessert"
                            value={form.dessert}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-lg p-3"
                        />

                        <input
                            type="file"
                            name="dessertImage"
                            accept="image/*"
                            onChange={handleFile}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <label>Buffet</label>

                        <input
                            name="buffet"
                            value={form.buffet}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-lg p-3"
                        />

                        <input
                            type="file"
                            name="buffetImage"
                            accept="image/*"
                            onChange={handleFile}
                            className="mt-2"
                        />
                    </div>

                </div>

                <div className="flex justify-end gap-4 mt-8">

                    <button
                        onClick={onClose}
                        className="bg-gray-300 rounded-lg px-6 py-3"
                    >
                        Hủy
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white rounded-lg px-6 py-3"
                    >
                        Lưu
                    </button>

                </div>

            </div>

        </div>

    );

}

export default MenuModal;