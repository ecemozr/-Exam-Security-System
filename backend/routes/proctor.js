const express = require("express");
const path = require("path");
const multer = require("multer");
const { body, validationResult } = require("express-validator");
const { open } = require("../db");
const { verifyMatch } = require("../services/ml");

const r = express.Router();

const liveStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads", "live")),
    filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`)
});
const evidenceStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads", "evidence")),
    filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`)
});

const uploadLive = multer({ storage: liveStorage });
const uploadEvidence = multer({ storage: evidenceStorage });

r.post("/checkins",
    uploadLive.single("photo"),
    body("exam_id").isInt({ min: 1 }),
    body("student_no").isString().notEmpty(),
    body("actual_seat_code").optional().isString(),
    async (req,res) => {
        const e = validationResult(req);
        if (!e.isEmpty()) return res.status(400).json({ error: "validation", details: e.array() });
        if (!req.file) return res.status(400).json({ error: "photo_required" });

        const examId = Number(req.body.exam_id);
        const studentNo = req.body.student_no;
        const actualSeatCode = (req.body.actual_seat_code || "").trim().toUpperCase();
        const proctorId = req.user.id;

        const db = open();

        const exam = db.prepare("SELECT e.*, r.id as room_id FROM exams e JOIN rooms r ON r.id=e.room_id WHERE e.id=?").get(examId);
        if (!exam) { db.close(); return res.status(404).json({ error: "exam_not_found" }); }

        const student = db.prepare("SELECT * FROM students WHERE student_no=?").get(studentNo);
        if (!student) { db.close(); return res.status(404).json({ error: "student_not_found" }); }

        const assignment = db.prepare(`
      SELECT sa.seat_id as expected_seat_id, s.seat_code as expected_seat_code
      FROM seating_assignments sa
      JOIN seats s ON s.id=sa.seat_id
      WHERE sa.exam_id=? AND sa.student_id=?
    `).get(examId, student.id);

        const expectedSeatId = assignment?.expected_seat_id ?? null;
        const expectedSeatCode = assignment?.expected_seat_code ?? null;

        let actualSeatId = null;
        if (actualSeatCode) {
            const seat = db.prepare("SELECT id FROM seats WHERE room_id=? AND seat_code=?").get(exam.room_id, actualSeatCode);
            actualSeatId = seat?.id ?? null;
        }

        let seatResult = "UNKNOWN";
        if (expectedSeatCode && actualSeatCode) seatResult = (expectedSeatCode === actualSeatCode) ? "CORRECT" : "WRONG";

        const ml = await verifyMatch(student.id_photo_path, req.file.path);
        const mlResult = ml.result;

        let status = "APPROVED";
        if (mlResult === "NO_MATCH") status = "FLAGGED";
        if (seatResult === "WRONG") status = "FLAGGED";

        try {
            const out = db.prepare(`
        INSERT INTO checkins (
          exam_id, student_id, proctor_id, expected_seat_id, actual_seat_id,
          photo_path, ml_result, seat_result, status
        ) VALUES (?,?,?,?,?,?,?,?,?)
      `).run(
                examId, student.id, proctorId, expectedSeatId, actualSeatId,
                req.file.path, mlResult, seatResult, status
            );

            db.close();
            res.json({
                id: out.lastInsertRowid,
                ml_result: mlResult,
                seat_result: seatResult,
                status
            });
        } catch (err) {
            db.close();
            return res.status(400).json({ error: "duplicate_checkin_or_invalid" });
        }
    }
);

r.post("/violations",
    uploadEvidence.single("evidence"),
    body("checkin_id").isInt({ min: 1 }),
    body("reason").isString().notEmpty(),
    body("notes").optional().isString(),
    (req,res) => {
        const e = validationResult(req);
        if (!e.isEmpty()) return res.status(400).json({ error: "validation", details: e.array() });

        const checkinId = Number(req.body.checkin_id);
        const reason = req.body.reason;
        const notes = req.body.notes || null;
        const evidencePath = req.file ? req.file.path : null;
        const proctorId = req.user.id;

        const db = open();
        const checkin = db.prepare("SELECT * FROM checkins WHERE id=?").get(checkinId);
        if (!checkin) { db.close(); return res.status(404).json({ error: "checkin_not_found" }); }

        const out = db.prepare(`
      INSERT INTO violations (exam_id,student_id,proctor_id,checkin_id,reason,notes,evidence_path)
      VALUES (?,?,?,?,?,?,?)
    `).run(checkin.exam_id, checkin.student_id, proctorId, checkinId, reason, notes, evidencePath);

        db.close();
        res.json({ id: out.lastInsertRowid });
    }
);

r.get("/exams", (req,res) => {
    const db = open();
    const rows = db.prepare("SELECT e.*, r.name as room_name FROM exams e JOIN rooms r ON r.id=e.room_id ORDER BY e.id DESC").all();
    db.close();
    res.json(rows);
});

module.exports = r;
