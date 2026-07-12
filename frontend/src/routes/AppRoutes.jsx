import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";

import Home from "../pages/user/Home";
import ChangePassword from "../pages/user/ChangePassword";

import Dashboard from "../pages/admin/Dashboard";
import MenuManagement from "../pages/admin/MenuManagement";
import UserManagement from "../pages/admin/UserManagement";
import OrderManagement from "../pages/admin/OrderManagement";
import Report from "../pages/admin/Report";
import History from "../pages/user/History";
import MyQr from "../pages/user/MyQr";
import OrderEdit from "../pages/user/OrderEdit";

import AdminLayout from "../layouts/AdminLayout";

import PrivateRoute from "../components/PrivateRoute";

import MenuWeekCreate from "../pages/admin/MenuWeekCreate";

import MenuWeekEdit from "../pages/admin/MenuWeekEdit";

function AppRoutes() {

    return (

        <Routes>

            {/* Login */}
            <Route
                path="/"
                element={<Login />}
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
        <Route
            

    path="/change-password"

    element={<ChangePassword />}

/>
            <Route

                path="/history"

                element={

                    <PrivateRoute>

                        <History />

                    </PrivateRoute>

                }

            />

            <Route
    path="/my-qr"
    element={
        <PrivateRoute>
            <MyQr />
        </PrivateRoute>
    }
/>

            {/* Admin */}
            <Route
                element={
                    <PrivateRoute>
                        <AdminLayout />
                    </PrivateRoute>
                }
            >

                <Route
                    path="/admin/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/admin/menu"
                    element={<MenuManagement />}
                />

                <Route
                    path="/admin/user"
                    element={<UserManagement />}
                />

                <Route
                    path="/admin/order"
                    element={<OrderManagement />}
                />

                <Route
                    path="/admin/report"
                    element={<Report />}
                />

                <Route
                    path="admin/menu/edit/:id"
                    element={<MenuWeekEdit />}
                />

                <Route

                    path="/admin/menu/create"

                    element={<MenuWeekCreate />}

                />

            </Route>

        </Routes>

    );

}

export default AppRoutes;