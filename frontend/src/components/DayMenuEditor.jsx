import { useState } from "react";

import MainSection from "./MainSection";
import SingleDishSection from "./SingleDishSection";
import AddDishModal from "./AddDishModal";

function DayMenuEditor({

    day,

    onChange

}) {

    const [open, setOpen] = useState(false);

    const [mode, setMode] = useState("");

    const [editingIndex, setEditingIndex] = useState(null);

    if (!day) return null;

    // ===========================
    // OPEN MODAL
    // ===========================

    const openMainAdd = () => {

        setMode("main-add");

        setEditingIndex(null);

        setOpen(true);

    };

    const openMainEdit = (index) => {

        setMode("main-edit");

        setEditingIndex(index);

        setOpen(true);

    };

    const openDrink = () => {

        setMode("drink");

        setOpen(true);

    };

    const openSoup = () => {

        setMode("soup");

        setOpen(true);

    };

    // ===========================
    // SAVE
    // ===========================

    const saveDish = (dish) => {

        let clone = {

            ...day

        };

        switch (mode) {

            case "main-add":

                clone.mains = [

                    ...clone.mains,

                    dish

                ];

                break;

            case "main-edit":

                clone.mains =

                    clone.mains.map(

                        (

                            item,

                            index

                        ) =>

                            index === editingIndex

                                ? dish

                                : item

                    );

                break;

            case "drink":

                clone.drink = dish;

                break;

            case "soup":

                clone.soup = dish;

                break;

            default:

                break;

        }

        onChange(clone);

    };

    // ===========================
    // REMOVE
    // ===========================

    const removeDish = () => {

        let clone = {

            ...day

        };

        switch (mode) {

            case "main-edit":

                clone.mains =

                    clone.mains.filter(

                        (

                            _,

                            index

                        ) =>

                            index !== editingIndex

                    );

                break;

            case "drink":

                clone.drink = {

                    name: "",

                    image: null

                };

                break;

            case "soup":

                clone.soup = {

                    name: "",

                    image: null

                };

                break;

            default:

                break;

        }

        onChange(clone);

    };

    // ===========================
    // CURRENT DISH
    // ===========================

    let currentDish = null;

    switch (mode) {

        case "main-edit":

            currentDish =

                day.mains[editingIndex];

            break;

        case "drink":

            currentDish =

                day.drink;

            break;

        case "soup":

            currentDish =

                day.soup;

            break;

        default:

            currentDish = null;

    }

    return (

        <div className="space-y-6 lg:space-y-12">

            {/* MAIN */}

            <MainSection

                mains={day.mains}

                onAdd={openMainAdd}

                onSelect={openMainEdit}

            />

            {/* DRINK */}

            <SingleDishSection

                title="Món nước"

                dish={day.drink}

                onAdd={openDrink}

                onSelect={openDrink}

            />

            {/* SOUP */}

            <SingleDishSection

                title="Món súp"

                dish={day.soup}

                onAdd={openSoup}

                onSelect={openSoup}

            />

            {/* MODAL */}

            <AddDishModal

                open={open}

                dish={currentDish}

                mode={mode}

                removable={

                    mode !== "main-add"

                }

                title={

                    mode === "main-add"

                        ? "Thêm món"

                        : "Chỉnh sửa món"

                }

                onClose={() =>

                    setOpen(false)

                }

                onSave={saveDish}

                onRemove={removeDish}

            />

        </div>

    );

}

export default DayMenuEditor;