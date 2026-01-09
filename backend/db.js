const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const dbPath = process.env.DB_PATH || "./data/app.db";
const absDbPath = path.resolve(dbPath);

function open() {
    fs.mkdirSync(path.dirname(absDbPath), { recursive: true });
    const db = new Database(absDbPath);
    db.pragma("foreign_keys = ON");
    return db;
}

function init() {
    const db = open();
    const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
    db.exec(schema);
    db.close();
    console.log("db initialized");
}

function seed() {
    const db = open();
    const seedSql = fs.readFileSync(path.join(__dirname, "seed.sql"), "utf8");
    db.exec(seedSql);

    const adminHash = bcrypt.hashSync("admin123", 10);
    const proctorHash = bcrypt.hashSync("proctor123", 10);

    db.prepare("INSERT INTO users (username,password_hash,role) VALUES (?,?,?)")
        .run("admin", adminHash, "ADMIN");
    db.prepare("INSERT INTO users (username,password_hash,role) VALUES (?,?,?)")
        .run("proctor", proctorHash, "PROCTOR");

    const roomId = db.prepare("INSERT INTO rooms (name,rows,cols) VALUES (?,?,?)")
        .run("B201", 5, 6).lastInsertRowid;

    const examId = db.prepare("INSERT INTO exams (title,exam_datetime,room_id) VALUES (?,?,?)")
        .run("SE342 Final", "2026-01-15 10:00:00", roomId).lastInsertRowid;

    // seats generate A1..E6
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const rows = 5, cols = 6;
    const insSeat = db.prepare("INSERT INTO seats (room_id,seat_code,row_no,col_no) VALUES (?,?,?,?)");
    for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= cols; c++) {
            const code = `${letters[r-1]}${c}`;
            insSeat.run(roomId, code, r, c);
        }
    }

    const st1 = db.prepare("INSERT INTO students (student_no,full_name,id_photo_path) VALUES (?,?,?)")
        .run("2207000001", "Student One", null).lastInsertRowid;
    const st2 = db.prepare("INSERT INTO students (student_no,full_name,id_photo_path) VALUES (?,?,?)")
        .run("2207000002", "Student Two", null).lastInsertRowid;

    const seatA1 = db.prepare("SELECT id FROM seats WHERE room_id=? AND seat_code=?").get(roomId, "A1").id;
    const seatA2 = db.prepare("SELECT id FROM seats WHERE room_id=? AND seat_code=?").get(roomId, "A2").id;

    db.prepare("INSERT INTO seating_assignments (exam_id,student_id,seat_id) VALUES (?,?,?)")
        .run(examId, st1, seatA1);
    db.prepare("INSERT INTO seating_assignments (exam_id,student_id,seat_id) VALUES (?,?,?)")
        .run(examId, st2, seatA2);

    db.close();
    console.log("db seeded");
}

module.exports = { open, init, seed };
