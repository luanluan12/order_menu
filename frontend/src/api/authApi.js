import axios from "./axios";

export const login = (data) => {
    return axios.post("/auth/login", data);
};

export const changePassword = (data) => {

    return axios.put(

        "/auth/change-password",

        data

    );

};