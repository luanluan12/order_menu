import React from "react";

function DayEditor({

    index,

    day,

    onChange

}) {

    const handleInput = (e) => {

        onChange(

            index,

            e.target.name,

            e.target.value

        );

    };

    const handleFile = (e) => {

        onChange(

            index,

            e.target.name,

            e.target.files[0]

        );

    };

    return (

        <div className="rounded-xl border bg-white p-6 shadow">

            <h2 className="mb-5 text-xl font-bold">

                Thứ {index + 2}

            </h2>

            <div className="grid grid-cols-2 gap-6">

                {/* Date */}

                <div>

                    <label>

                        Ngày

                    </label>

                    <input

                        type="date"

                        name="date"

                        value={day.date}

                        onChange={handleInput}

                        className="mt-1 w-full rounded border p-3"

                    />

                </div>

            </div>

            <div className="mt-6 grid grid-cols-2 gap-6">

                {/* Main Normal */}

                <div>

                    <label>

                        Cơm thường

                    </label>

                    <input

                        name="mainNormal"

                        value={day.mainNormal}

                        onChange={handleInput}

                        className="mt-1 w-full rounded border p-3"

                    />

                </div>

                <div>

                    <label>

                        Ảnh

                    </label>

                    <input

                        type="file"

                        name="mainNormalImage"

                        accept="image/*"

                        onChange={handleFile}

                        className="mt-1 w-full"

                    />

                </div>

                {/* Main Vegetarian */}

                <div>

                    <label>

                        Cơm chay

                    </label>

                    <input

                        name="mainVegetarian"

                        value={day.mainVegetarian}

                        onChange={handleInput}

                        className="mt-1 w-full rounded border p-3"

                    />

                </div>

                <div>

                    <label>

                        Ảnh

                    </label>

                    <input

                        type="file"

                        name="mainVegetarianImage"

                        accept="image/*"

                        onChange={handleFile}

                        className="mt-1 w-full"

                    />

                </div>

                {/* Drink */}

                <div>

                    <label>

                        Nước

                    </label>

                    <input

                        name="drink"

                        value={day.drink}

                        onChange={handleInput}

                        className="mt-1 w-full rounded border p-3"

                    />

                </div>

                <div>

                    <label>

                        Ảnh

                    </label>

                    <input

                        type="file"

                        name="drinkImage"

                        accept="image/*"

                        onChange={handleFile}

                        className="mt-1 w-full"

                    />

                </div>

                {/* Soup */}

                <div>

                    <label>

                        Canh

                    </label>

                    <input

                        name="soup"

                        value={day.soup}

                        onChange={handleInput}

                        className="mt-1 w-full rounded border p-3"

                    />

                </div>

                <div>

                    <label>

                        Ảnh

                    </label>

                    <input

                        type="file"

                        name="soupImage"

                        accept="image/*"

                        onChange={handleFile}

                        className="mt-1 w-full"

                    />

                </div>

                {/* Dessert */}

                <div>

                    <label>

                        Tráng miệng

                    </label>

                    <input

                        name="dessert"

                        value={day.dessert}

                        onChange={handleInput}

                        className="mt-1 w-full rounded border p-3"

                    />

                </div>

                <div>

                    <label>

                        Ảnh

                    </label>

                    <input

                        type="file"

                        name="dessertImage"

                        accept="image/*"

                        onChange={handleFile}

                        className="mt-1 w-full"

                    />

                </div>

            </div>

        </div>

    );

}

export default DayEditor;