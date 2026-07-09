import axios from "./axios";

/**
 * Đặt món cả tuần
 */
export const createOrder = (data) => {

    return axios.post(

        "/order",

        data

    );

};

/**
 * Cập nhật đặt món cả tuần
 */
export const updateOrder = (data) => {

    return axios.put(

        "/order",

        data

    );

};

/**
 * Hủy đặt món cả tuần
 */
export const cancelOrder = (menuId) => {

    return axios.put(

        "/order/cancel",

        {

            menuId

        }

    );

};

/**
 * Lịch sử đặt món
 */
export const getHistory = () => {

    return axios.get(

        "/order/history"

    );

};

/**
 * Kiểm tra Link Email
 */
export const verifyInvite = (token) => {

    return axios.post(

        "/order/verify",

        {

            token

        }

    );

};

/**
 * Đặt món từ Link Email
 */
export const createOrderFromInvite = (data) => {

    return axios.post(

        "/order/invite",

        data

    );

};

export const getOrders = (params = {}) => {

    return axios.get(
        "/order",
        {
            params
        }
    );

};