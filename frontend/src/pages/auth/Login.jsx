import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login as loginApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const handleLogin = async () => {

        try {

            const res = await loginApi({

                email,

                password

            });

            login(

                res.data.token,

                res.data.user

            );

            switch (res.data.user.role) {

                case "guest":
                    navigate("/home");
                    break;

                case "admin_eocmn":
                    navigate("/admin/dashboard");
                    break;

                case "admin_nexon":
                    navigate("/admin/dashboard");
                    break;

                default:
                    navigate("/");
            }

        }

        catch (err) {

            alert(
                err.response?.data?.message ||
                "Login failed"
            );

        }

    };

    return (

        <div style={{ padding: 50 }}>

            <h2>Login</h2>

            <input
                placeholder="Email"
                value={email}
                onChange={(e) =>
                    setEmail(e.target.value)
                }
            />

            <br /><br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                    setPassword(e.target.value)
                }
            />

            <br /><br />

            <button
                onClick={handleLogin}
            >
                Login
            </button>

        </div>

    );

}

export default Login;