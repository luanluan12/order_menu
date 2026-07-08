import axios from "./axios";

export const getUsers = () =>
    axios.get("/user");

export const createUser = (data) =>
    axios.post("/user", data);

export const updateUser = (id, data) =>
    axios.put(`/user/${id}`, data);

export const deleteUser = (id) =>
    axios.delete(`/user/${id}`);

export const resetPassword = (id) =>
    axios.put(`/user/reset-password/${id}`);

export const searchUsers = (keyword) =>
    axios.get(`/user/search?keyword=${keyword}`);

export const importExcel = (formData) =>
    axios.post("/user/import", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });