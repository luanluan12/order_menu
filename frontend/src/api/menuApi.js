import axios from "./axios";

/**
 * Danh sách Menu tuần
 */
export const getMenus = () => {

    return axios.get("/menu");

};

/**
 * Menu tuần hiện tại
 */
export const getWeekMenu = (week = "") => {

    if (week) {

        return axios.get(`/menu/week?week=${week}`);

    }

    return axios.get("/menu/week");

};

/**
 * Chi tiết 1 Menu tuần
 */
export const getMenuById = (id) => {

    return axios.get(`/menu/${id}`);

};

/**
 * Tạo Menu tuần
 */
export const createMenu = (formData) => {

    return axios.post(

        "/menu",

        formData,

        {

            headers: {

                "Content-Type": "multipart/form-data"

            }

        }

    );

};

/**
 * Cập nhật Menu tuần
 */
export const updateMenu = (

    id,

    formData

) => {

    return axios.put(

        `/menu/${id}`,

        formData,

        {

            headers: {

                "Content-Type": "multipart/form-data"

            }

        }

    );

};

/**
 * Publish Menu tuần
 */
export const publishMenu = (id) => {

    return axios.put(

        `/menu/publish/${id}`

    );

};

/**
 * Xóa Menu tuần
 */
export const deleteMenu = (id) => {

    return axios.delete(

        `/menu/${id}`

    );

};