PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
                                     id INTEGER PRIMARY KEY AUTOINCREMENT,
                                     username TEXT UNIQUE NOT NULL,
                                     password_hash TEXT NOT NULL,
                                     role TEXT NOT NULL CHECK (role IN ('ADMIN','PROCTOR')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS students (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        student_no TEXT UNIQUE NOT NULL,
                                        full_name TEXT NOT NULL,
                                        id_photo_path TEXT,
                                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rooms (
                                     id INTEGER PRIMARY KEY AUTOINCREMENT,
                                     name TEXT NOT NULL,
                                     rows INTEGER NOT NULL,
                                     cols INTEGER NOT NULL,
                                     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exams (
                                     id INTEGER PRIMARY KEY AUTOINCREMENT,
                                     title TEXT NOT NULL,
                                     exam_datetime DATETIME NOT NULL,
                                     room_id INTEGER NOT NULL,
                                     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                     FOREIGN KEY (room_id) REFERENCES rooms(id)
    );

CREATE TABLE IF NOT EXISTS seats (
                                     id INTEGER PRIMARY KEY AUTOINCREMENT,
                                     room_id INTEGER NOT NULL,
                                     seat_code TEXT NOT NULL,
                                     row_no INTEGER NOT NULL,
                                     col_no INTEGER NOT NULL,
                                     FOREIGN KEY (room_id) REFERENCES rooms(id),
    UNIQUE(room_id, seat_code)
    );

CREATE TABLE IF NOT EXISTS seating_assignments (
                                                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                   exam_id INTEGER NOT NULL,
                                                   student_id INTEGER NOT NULL,
                                                   seat_id INTEGER NOT NULL,
                                                   assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                                   UNIQUE (exam_id, student_id),
    UNIQUE (exam_id, seat_id),
    FOREIGN KEY (exam_id) REFERENCES exams(id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (seat_id) REFERENCES seats(id)
    );

CREATE TABLE IF NOT EXISTS checkins (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        exam_id INTEGER NOT NULL,
                                        student_id INTEGER NOT NULL,
                                        proctor_id INTEGER NOT NULL,
                                        expected_seat_id INTEGER,
                                        actual_seat_id INTEGER,
                                        photo_path TEXT,
                                        ml_result TEXT CHECK (ml_result IN ('MATCH', 'NO_MATCH')),
    seat_result TEXT CHECK (seat_result IN ('CORRECT', 'WRONG', 'UNKNOWN')),
    status TEXT CHECK (status IN ('APPROVED', 'FLAGGED', 'REJECTED')),
    checked_in_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (exam_id, student_id),
    FOREIGN KEY (exam_id) REFERENCES exams(id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (proctor_id) REFERENCES users(id),
    FOREIGN KEY (expected_seat_id) REFERENCES seats(id),
    FOREIGN KEY (actual_seat_id) REFERENCES seats(id)
    );

CREATE TABLE IF NOT EXISTS violations (
                                          id INTEGER PRIMARY KEY AUTOINCREMENT,
                                          exam_id INTEGER NOT NULL,
                                          student_id INTEGER NOT NULL,
                                          proctor_id INTEGER NOT NULL,
                                          checkin_id INTEGER NOT NULL,
                                          reason TEXT NOT NULL,
                                          notes TEXT,
                                          evidence_path TEXT,
                                          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                          FOREIGN KEY (exam_id) REFERENCES exams(id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (proctor_id) REFERENCES users(id),
    FOREIGN KEY (checkin_id) REFERENCES checkins(id)
    );
