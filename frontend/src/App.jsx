import React, { useState } from "react";
import Login from "./pages/Login.jsx";
import Admin from "./pages/Admin.jsx";
import Proctor from "./pages/Proctor.jsx";

export default function App() {
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [role, setRole] = useState(localStorage.getItem("role") || "");
    const [username, setUsername] = useState(localStorage.getItem("username") || "");

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        setToken("");
        setRole("");
        setUsername("");
    }

    if (!token) {
        return (
            <Login
                onLogin={(t, r, u) => {
                    setToken(t);
                    setRole(r);
                    setUsername(u);
                }}
            />
        );
    }

    return (
        <div className="shell">
            <div className="topbar">
                <div className="brand">
                    <span className="brand-badge" />
                    <div>exam security system</div>
                </div>

                <div className="top-actions">
                    <span className="pill">welcome, {username}</span>
                    <button className="btn btn-primary" onClick={logout}>logout</button>
                </div>
            </div>

            {role === "ADMIN" ? <Admin /> : <Proctor />}
        </div>
    );
}
