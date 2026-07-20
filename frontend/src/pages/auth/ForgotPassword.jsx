import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../api/authApi";
import { useTranslation } from "react-i18next";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await forgotPassword({
        email,
      });

      setMessage(t(`api.${res.data.code}`));
    } catch (err) {
      setMessage(
        err.response?.data?.code
          ? t(`api.${err.response.data.code}`)
          : t("common_error"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-2">
          {t("forgotPassword_title")}
        </h1>

        <p className="text-gray-500 text-center mb-6">
          {t("forgotPassword_description")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder={t("forgotPassword_emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg"
          >
            {loading ? t("forgotPassword_sending") : t("forgotPassword_send")}
          </button>
        </form>

        {message && (
          <div className="mt-4 text-center text-sm text-green-600">
            {message}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/" className="text-blue-600 hover:underline">
            {t("forgotPassword_backToLogin")}
          </Link>
        </div>
      </div>
    </div>
  );
}
