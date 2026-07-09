import axios from "./axios";

export const getDashboard = () =>
    axios.get("/report/dashboard");

export const getWeeklyReport = (week) =>
    axios.get(`/report/weekly?week=${week}`);

export const exportExcel = (week) =>
    axios.get(`/report/export?week=${week}`, {
        responseType: "blob"
    });

export const getFloorDailyReport = (date) => {

    return axios.get(

        `/report/floor/daily?date=${date}`

    );

};

export const getFloorMonthlyReport = (month) => {

    return axios.get(

        `/report/floor/monthly?month=${month}`

    );

};