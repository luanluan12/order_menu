function QuantitySelector({

    quantity,

    disabled,

    onChange

}) {

    const decrease = (e) => {

        e.stopPropagation();

        if (disabled) return;

        if (quantity <= 0) return;

        onChange(quantity - 1);

    };

    const increase = (e) => {

        e.stopPropagation();

        if (disabled) return;

        if (quantity >= 2) return;

        onChange(quantity + 1);

    };

    return (

        <div className="flex items-center justify-center gap-4">

            <button

                type="button"

                disabled={disabled || quantity === 0}

                onClick={decrease}

                className={`flex h-10 w-10 items-center justify-center rounded-full border text-xl font-bold transition

                ${disabled || quantity === 0

                        ?

                        "cursor-not-allowed bg-gray-100 text-gray-400"

                        :

                        "bg-white hover:bg-red-100"

                    }`}

            >

                −

            </button>

            <span className="w-10 text-center text-xl font-bold">

                {quantity}

            </span>

            <button

                type="button"

                disabled={disabled || quantity >= 2}

                onClick={increase}

                className={`flex h-10 w-10 items-center justify-center rounded-full border text-xl font-bold transition

                ${disabled || quantity >= 2

                        ?

                        "cursor-not-allowed bg-gray-100 text-gray-400"

                        :

                        "bg-white hover:bg-green-100"

                    }`}

            >

                +

            </button>

        </div>

    );

}

export default QuantitySelector;