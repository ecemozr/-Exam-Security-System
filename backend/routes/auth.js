const express = require("express");
const bcrypt = require("bcryptjs");
const { open } = require("../db");

const r = express.Router();

r.post("/login", (req, res) => {
    try {
        const { username, password } = req.body || {};

        if (!username || !password) {
            return res.status(400).json({ error: "missing credentials" });
        }

        const db = open();
        const user = db
            .prepare("SELECT id, username, password_hash, role FROM users WHERE username = ?")
            .get(username);
        db.close();

        if (!user) {
            return res.status(401).json({ error: "invalid credentials" });
        }

        const ok = bcrypt.compareSync(password, user.password_hash);
        if (!ok) {
            return res.status(401).json({ error: "invalid credentials" });
        }

        // JWT YOK → sahte token
        return res.json({
            token: "DEV_TOKEN",
            role: user.role,
            username: user.username
        });

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        return res.status(500).json({ error: "server error" });
    }
});

module.exports = r;
