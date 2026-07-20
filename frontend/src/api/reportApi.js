import axios from "./axios";

export const exportDailyReport = (date) => {
  return axios.get(
    "/report/export-daily",

    {
      params: {
        date,
      },

      responseType: "blob",
    },
  );
};

export const getDailyReport = (date) =>
  axios.get(
    "/report/daily",

    {
      params: {
        date,
      },
    },
  );
// ======================================
// Invoice Report
// ======================================

export const getInvoiceReport = (params) => {
  return axios.get(
    "/report/invoice",

    {
      params,
    },
  );
};

export const exportInvoiceReport = (params) => {
  return axios.get(
    "/report/invoice/export",

    {
      params,

      responseType: "blob",
    },
  );
};

export const getLeftoverReport = (date) =>
  axios.get("/report/leftover", {
    params: { date },
  });

export const exportLeftoverReport = (date) =>
  axios.get("/report/leftover/export", {
    params: { date },
    responseType: "blob",
  });
