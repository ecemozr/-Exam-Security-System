-- USERS
INSERT INTO users (username, password_hash, role) VALUES
('admin', 'hashed_admin_pw', 'ADMIN'),
('proctor1', 'hashed_proctor_pw', 'PROCTOR');

-- STUDENTS
INSERT INTO students (student_no, full_name) VALUES
('220706038', 'Ecem Nur Özer'),
('220706034', 'Burçak Çelt');

-- ROOMS
INSERT INTO rooms (name, rows, cols) VALUES
('Room A', 5, 5);

-- EXAMS
INSERT INTO exams (title, exam_datetime, room_id) VALUES
('Software Validation and Testing Final', '2026-01-15 10:00', 1);

-- SEATS
INSERT INTO seats (room_id, seat_code, row_no, col_no) VALUES
(1, 'A1', 1, 1),
(1, 'A2', 1, 2);

-- SEATING ASSIGNMENTS
INSERT INTO seat_assignments (exam_id, student_id, seat_id, assigned_at) VALUES
(1, 1, 1, '2026-01-15 09:30'),
(1, 2, 2, '2026-01-15 09:30');
