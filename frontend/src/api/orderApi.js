import axios from "./axios";

/**
 * Đặt món cả tuần
 */
export const createOrder = (data) => {
  return axios.post(
    "/order",

    data,
  );
};

/**
 * Cập nhật đặt món cả tuần
 */
export const updateOrder = (id, data) => {
  return axios.put(
    `/order/${id}`,

    data,
  );
};

/**
 * Hủy đặt món cả tuần
 */
export const cancelOrder = (menuId) => {
  return axios.put(
    "/order/cancel",

    {
      menuId,
    },
  );
};

/**
 * Lịch sử đặt món
 */
export const getHistory = () => {
  return axios.get("/order/history");
};

/**
 * Đánh giá bữa ăn
 */
export const submitReview = (data) => {
  return axios.post(
    "/order/review",

    data,
  );
};

/**
 * Chi tiết đơn đặt món
 */
export const getOrderById = (id) => {
  return axios.get(`/order/${id}`);
};

/**
 * Kiểm tra Link Email
 */
export const verifyInvite = (token) => {
  return axios.post(
    "/order/verify",

    {
      token,
    },
  );
};

/**
 * Đặt món từ Link Email
 */
export const createOrderFromInvite = (data) => {
  return axios.post(
    "/order/invite",

    data,
  );
};

export const getOrders = (params = {}) => {
  return axios.get("/order", {
    params,
  });
};

/**
 * Danh sách đánh giá
 */
export const getReviews = (params = {}) => {
  return axios.get(
    "/order/reviews",

    {
      params,
    },
  );
};

export const scanQr = (data) => {
  return axios.post("/order/scan", data);
};

// ===============================
// Preview QR
// ===============================

export const previewQr = (data) => {
  return axios.post(
    "/order/preview",

    data,
  );
};

export const manualCheckin = (data) => axios.put("/order/checkin/manual", data);

// ===============================
// Confirm Receive
// ===============================

export const confirmReceive = (data) => {
  return axios.post(
    "/order/receive",

    data,
  );
};
