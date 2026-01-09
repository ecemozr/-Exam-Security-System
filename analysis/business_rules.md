# Exam Security System – Business Rules & Validation Constraints

## BR-01 Duplicate Check-in Prevention
A student shall not be checked-in more than once for the same exam.  
**Constraint:** UNIQUE(exam_id, student_id) in CHECKINS.

## BR-02 Role-Based Page Access
- Only **Admin** can manage exams, rooms, seating plans, and student roster.
- Only **Proctor** can perform check-in and log violations.
- Admin and Proctor can view reports (read-only).
If a user attempts an unauthorized action, the system must block it and show “Access Denied”.

## BR-03 Required Inputs for Check-in
A check-in cannot proceed unless:
- exam is selected
- student is selected
- a live photo is provided and passes basic validation (file type/size)

If any required input is missing or invalid, the system must stop the flow and display a clear validation error.

## BR-04 Identity Verification Decision Handling
The ML wrapper returns either:
- MATCH
- NO_MATCH

If the result is **NO_MATCH**, the check-in shall be marked **FLAGGED**.

## BR-05 Seat Compliance Rules
- Each student has an **expected seat** defined by the seating plan.
- Proctor provides the **actual seat** during check-in.
- If expected seat equals actual seat: seat_result = CORRECT.
- If they differ: seat_result = WRONG.
- If actual seat is not provided: seat_result = UNKNOWN.

If seat_result is WRONG (or UNKNOWN), the check-in shall be marked **FLAGGED**.

## BR-06 Final Status Calculation
A check-in is **APPROVED** only if:
- ml_result = MATCH
- seat_result = CORRECT

Otherwise, status = **FLAGGED**.

## BR-07 Violation Logging Requirements
A violation record:
- must include a **reason** (required)
- may include **notes** (optional)
- may include **evidence image** (optional)

Violations must be linked to:
- the related check-in
- the exam and student (directly or via check-in)

## BR-08 Data Consistency for Seating Plan
Within a single exam seating plan:
- a student can have only one assigned seat  
  **Constraint:** UNIQUE(exam_id, student_id) in SEATING_ASSIGN
- a seat can be assigned to only one student  
  **Constraint:** UNIQUE(exam_id, seat_id) in SEATING_ASSIGN

## BR-09 Auditability (Timestamps)
The system shall store timestamps for:
- check-in creation time (checked_in_at)
- violation creation time (created_at)
