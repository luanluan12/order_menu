import axios from "./axios";

export const login = (data) => {
  return axios.post("/auth/login", data);
};

export const changePassword = (data) => {
  return axios.put(
    "/auth/change-password",

    data,
  );
};

export const forgotPassword = (data) => {
  return axios.post("/auth/forgot-password", data);
};

export const resetPassword = (data) => {
  return axios.post("/auth/reset-password", data);
};
