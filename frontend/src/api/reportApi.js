import axios from "./axios";

export const getDashboard = () =>
    axios.get("/report/dashboard");

export const getWeeklyReport = (week) =>
    axios.get(`/report/weekly?week=${week}`);

export const exportExcel = (week) =>
    axios.get(`/report/export?week=${week}`, {
        responseType: "blob"
    });