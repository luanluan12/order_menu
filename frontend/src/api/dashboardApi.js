import axios from "./axios";

export const getDashboard = () =>

    axios.get("/dashboard");