const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { open } = require("../db");

const r = express.Router();

/* ---------- UPLOAD ---------- */
const idStorage = multer.diskStorage({
    destination: (req, file, cb) =>
        cb(null, path.join(__dirname, "..", "uploads", "id")),
    filename: (req, file, cb) =>
        cb(null, `${Date.now()}_${file.originalname}`)
});
const uploadId = multer({ storage: idStorage });

/* ---------- CREATE ---------- */
r.post("/rooms",
    body("name").notEmpty(),
    body("rows").isInt({ min: 1 }),
    body("cols").isInt({ min: 1 }),
    (req,res)=>{
        const db = open();
        const { name, rows, cols } = req.body;
        const out = db.prepare(
            "INSERT INTO rooms (name,rows,cols) VALUES (?,?,?)"
        ).run(name, rows, cols);
        db.close();
        res.json({ id: out.lastInsertRowid });
    }
);

r.post("/exams",
    body("title").notEmpty(),
    body("exam_datetime").notEmpty(),
    body("room_id").isInt(),
    (req,res)=>{
        const db = open();
        const { title, exam_datetime, room_id } = req.body;
        const out = db.prepare(
            "INSERT INTO exams (title,exam_datetime,room_id) VALUES (?,?,?)"
        ).run(title, exam_datetime, room_id);
        db.close();
        res.json({ id: out.lastInsertRowid });
    }
);

r.post("/students",
    uploadId.single("id_photo"),
    body("student_no").notEmpty(),
    body("full_name").notEmpty(),
    (req,res)=>{
        const db = open();
        const out = db.prepare(
            "INSERT INTO students (student_no,full_name,id_photo_path) VALUES (?,?,?)"
        ).run(
            req.body.student_no,
            req.body.full_name,
            req.file ? req.file.path : null
        );
        db.close();
        res.json({ id: out.lastInsertRowid });
    }
);

/* ---------- LIST ---------- */
r.get("/rooms",(req,res)=>{
    const db=open();
    const rows=db.prepare("SELECT * FROM rooms").all();
    db.close();
    res.json(rows);
});

r.get("/exams",(req,res)=>{
    const db=open();
    const rows=db.prepare(`
    SELECT e.*, r.name AS room_name
    FROM exams e JOIN rooms r ON r.id=e.room_id
  `).all();
    db.close();
    res.json(rows);
});

r.get("/students",(req,res)=>{
    const db=open();
    const rows=db.prepare("SELECT * FROM students").all();
    db.close();
    res.json(rows);
});

/* ---------- DELETE ---------- */
r.delete("/rooms/:id",(req,res)=>{
    const db=open();
    db.prepare("DELETE FROM rooms WHERE id=?").run(req.params.id);
    db.close();
    res.json({ ok:true });
});

r.delete("/exams/:id",(req,res)=>{
    const db=open();
    db.prepare("DELETE FROM exams WHERE id=?").run(req.params.id);
    db.close();
    res.json({ ok:true });
});

r.delete("/students/:id",(req,res)=>{
    const db=open();
    db.prepare("DELETE FROM students WHERE id=?").run(req.params.id);
    db.close();
    res.json({ ok:true });
});

module.exports = r;
