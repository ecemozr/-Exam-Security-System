-- =========================
-- USERS
-- =========================
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('ADMIN', 'PROCTOR'))
);

-- =========================
-- STUDENTS
-- =========================
CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_no TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    id_photo TEXT
);

-- =========================
-- ROOMS
-- =========================
CREATE TABLE rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    rows INTEGER NOT NULL,
    cols INTEGER NOT NULL
);

-- =========================
-- EXAMS
-- =========================
CREATE TABLE exams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    exam_datetime TEXT NOT NULL,
    room_id INTEGER NOT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- =========================
-- SEATS
-- =========================
CREATE TABLE seats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL,
    seat_code TEXT NOT NULL,
    row_no INTEGER NOT NULL,
    col_no INTEGER NOT NULL,
    UNIQUE (room_id, seat_code),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- =========================
-- SEATING ASSIGNMENTS
-- =========================
CREATE TABLE seat_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exam_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    seat_id INTEGER NOT NULL,
    assigned_at TEXT NOT NULL,
    UNIQUE (exam_id, student_id),
    UNIQUE (exam_id, seat_id),
    FOREIGN KEY (exam_id) REFERENCES exams(id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (seat_id) REFERENCES seats(id)
);

-- =========================
-- CHECKINS
-- =========================
CREATE TABLE checkins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exam_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    proctor_id INTEGER NOT NULL,
    expected_seat_id INTEGER NOT NULL,
    actual_seat_id INTEGER,
    live_photo TEXT,
    ml_result TEXT CHECK (ml_result IN ('MATCH', 'NO_MATCH')),
    seat_result TEXT CHECK (seat_result IN ('CORRECT', 'WRONG', 'UNKNOWN')),
    status TEXT CHECK (status IN ('APPROVED', 'FLAGGED')),
    checked_at TEXT NOT NULL,
    UNIQUE (exam_id, student_id),
    FOREIGN KEY (exam_id) REFERENCES exams(id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (proctor_id) REFERENCES users(id),
    FOREIGN KEY (expected_seat_id) REFERENCES seats(id),
    FOREIGN KEY (actual_seat_id) REFERENCES seats(id)
);

-- =========================
-- VIOLATIONS
-- =========================
CREATE TABLE violations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    checkin_id INTEGER NOT NULL,
    proctor_id INTEGER NOT NULL,
    reason TEXT NOT NULL,
    notes TEXT,
    evidence TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (checkin_id) REFERENCES checkins(id),
    FOREIGN KEY (proctor_id) REFERENCES users(id)
);
