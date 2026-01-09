const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const proctorRoutes = require("./routes/proctor");
const reportRoutes = require("./routes/reports");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/proctor", proctorRoutes);
app.use("/api/reports", reportRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log("backend running on port", PORT);
});
