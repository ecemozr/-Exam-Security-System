import React, { useState } from "react";
import { api } from "../api.js";

export default function Login({ onLogin }) {
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("admin123");
    const [err, setErr] = useState("");

    async function submit(e) {
        e.preventDefault();
        setErr("");
        try {
            const out = await api("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            localStorage.setItem("token", out.token);
            localStorage.setItem("role", out.role);
            localStorage.setItem("username", out.username);
            onLogin(out.token, out.role, out.username);
        } catch (ex) {
            setErr(ex?.error ? String(ex.error) : "login failed");
        }
    }

    return (
        <div className="centerwrap">
            <div className="loginbox">
                <div className="loginhead">
                    <div className="lock">🔒</div>
                    <h1>exam security system</h1>
                    <div className="sub">login</div>
                </div>

                <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
                    <input value={username} onChange={e => setUsername(e.target.value)} placeholder="username" />
                    <input value={password} onChange={e => setPassword(e.target.value)} placeholder="password" type="password" />
                    <button className="btn btn-primary" type="submit" style={{ justifyContent: "center" }}>
                        login
                    </button>
                </form>

                <div className="helper">access for proctor and admin roles</div>
                {err && <div style={{ marginTop: 10, color: "#ef4444", fontWeight: 800, textAlign: "center" }}>{err}</div>}
            </div>
        </div>
    );
}
