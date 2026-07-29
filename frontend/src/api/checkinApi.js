import axios from "./axios";

export const getTodayQr = () => {
  return axios.get("/checkin/today");
};

export const getTodayCheckins = () => {
  return axios.get("/checkin/today/checkins");
};

export const checkIn = (data) => {
  return axios.post("/checkin", data);
};
