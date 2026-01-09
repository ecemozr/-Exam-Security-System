const express = require("express");
const { open } = require("../db");

const r = express.Router();

r.get("/checkins", (req,res) => {
    const examId = req.query.exam_id ? Number(req.query.exam_id) : null;
    const db = open();
    const q = `
    SELECT c.*, st.student_no, st.full_name, u.username as proctor_username,
           es.seat_code as expected_seat_code,
           as2.seat_code as actual_seat_code
    FROM checkins c
    JOIN students st ON st.id=c.student_id
    JOIN users u ON u.id=c.proctor_id
    LEFT JOIN seats es ON es.id=c.expected_seat_id
    LEFT JOIN seats as2 ON as2.id=c.actual_seat_id
    ${examId ? "WHERE c.exam_id=?" : ""}
    ORDER BY c.id DESC
  `;
    const rows = examId ? db.prepare(q).all(examId) : db.prepare(q).all();
    db.close();
    res.json(rows);
});

r.get("/violations", (req,res) => {
    const examId = req.query.exam_id ? Number(req.query.exam_id) : null;
    const db = open();
    const q = `
    SELECT v.*, st.student_no, st.full_name, u.username as proctor_username
    FROM violations v
    JOIN students st ON st.id=v.student_id
    JOIN users u ON u.id=v.proctor_id
    ${examId ? "WHERE v.exam_id=?" : ""}
    ORDER BY v.id DESC
  `;
    const rows = examId ? db.prepare(q).all(examId) : db.prepare(q).all();
    db.close();
    res.json(rows);
});

module.exports = r;
