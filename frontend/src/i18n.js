import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import vi from "./locales/vi/translation.json";
import ko from "./locales/ko/translation.json";

const savedLanguage =
    localStorage.getItem("language") || "vi";

i18n

    .use(initReactI18next)

    .init({

        resources: {

            vi: {

                translation: vi,

            },

            ko: {

                translation: ko,

            },

        },

        lng: savedLanguage,

        fallbackLng: "vi",

        interpolation: {

            escapeValue: false,

        },

    });

export default i18n;