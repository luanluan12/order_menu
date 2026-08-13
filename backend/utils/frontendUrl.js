const defaultFrontendUrl = "https://www.eocmenu.food";

const getFrontendUrl = () => {
  const configuredUrl = (process.env.FRONTEND_URL || defaultFrontendUrl)
    .trim()
    .replace(/\/$/, "");

  // Domain không có "www" không còn truy cập được. Chuẩn hóa cả cấu hình cũ
  // để những email đang dùng FRONTEND_URL=https://eocmenu.food vẫn có link đúng.
  return configuredUrl.replace(
    /^https?:\/\/eocmenu\.food(?=\/|$)/i,
    "https://www.eocmenu.food",
  );
};

module.exports = getFrontendUrl;
