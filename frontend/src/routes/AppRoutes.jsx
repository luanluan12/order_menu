import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import { useAuth } from "../context/AuthContext";

const Login = lazy(() => import("../pages/auth/Login"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const Home = lazy(() => import("../pages/user/Home"));
const ChangePassword = lazy(() => import("../pages/user/ChangePassword"));
const History = lazy(() => import("../pages/user/History"));
const OrderEdit = lazy(() => import("../pages/user/OrderEdit"));
const Checkin = lazy(() => import("../pages/user/Checkin"));
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const MenuManagement = lazy(() => import("../pages/admin/MenuManagement"));
const UserManagement = lazy(() => import("../pages/admin/UserManagement"));
const OrderManagement = lazy(() => import("../pages/admin/OrderManagement"));
const Report = lazy(() => import("../pages/admin/Report"));
const ReviewManagement = lazy(() => import("../pages/admin/ReviewManagement"));
const MenuWeekCreate = lazy(() => import("../pages/admin/MenuWeekCreate"));
const MenuWeekEdit = lazy(() => import("../pages/admin/MenuWeekEdit"));

const PageLoading = () => (
  <div className="flex min-h-screen items-center justify-center text-slate-500">
    Đang tải...
  </div>
);

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
      {/* Login */}
      <Route
        path="/"
        element={
          user ? (
            user.role === "guest" || user.role === "admin_nexon_order" ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/admin/dashboard" replace />
            )
          ) : (
            <Login />
          )
        }
      />

      {/* User */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/order/edit/:id"
        element={
          <PrivateRoute>
            <OrderEdit />
          </PrivateRoute>
        }
      />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route
        path="/history"
        element={
          <PrivateRoute>
            <History />
          </PrivateRoute>
        }
      />

      <Route
        path="/checkin"
        element={
          <PrivateRoute>
            <Checkin />
          </PrivateRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Admin */}
      <Route
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route path="/admin/dashboard" element={<Dashboard />} />

        <Route path="/admin/menu" element={<MenuManagement />} />

        <Route path="/admin/user" element={<UserManagement />} />

        <Route path="/admin/order" element={<OrderManagement />} />

        <Route path="/admin/report" element={<Report />} />

        <Route path="/admin/review" element={<ReviewManagement />} />

        <Route path="admin/menu/edit/:id" element={<MenuWeekEdit />} />

        <Route path="/admin/menu/create" element={<MenuWeekCreate />} />
      </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
