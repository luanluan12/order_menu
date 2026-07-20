import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { resetPassword } from "../../api/authApi";

function ResetPassword() {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return alert(t("resetPassword_passwordNotMatch"));
    }

    try {
      setLoading(true);

      const res = await resetPassword({
        token,

        password,
      });

      alert(t(`api.${res.data.code}`));

      navigate("/");
    } catch (err) {
      alert(
        err.response?.data?.code
          ? t(`api.${err.response.data.code}`)
          : t("common_error"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-orange-50 to-blue-100 px-4">
      <div className="w-full max-w-md rounded-[32px] bg-white px-10 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
        <h1 className="text-center text-2xl font-bold">
          {t("resetPassword_title")}
        </h1>

        <p className="mt-2 text-center text-gray-500">
          {t("resetPassword_description")}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              {t("resetPassword_newPassword")}
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 pr-14"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              {t("resetPassword_confirmPassword")}
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 pr-14"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-orange-600 to-fuchsia-600 py-4 text-lg font-bold text-white"
          >
            {loading ? t("resetPassword_updating") : t("resetPassword_submit")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
