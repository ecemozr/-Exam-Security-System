# Exam Security System – System Requirements

## 1. Overview
The Exam Security System is a web-based application that supports secure exam entry and monitoring. The system verifies student identity using an image verification component, checks seating plan compliance, records check-in results with timestamps, and allows proctors to log violations. The system is role-based and supports Admin and Proctor users.

## 2. Actors / Roles
- **Admin (Exam Coordinator):** Manages exams, rooms, seating plans, and student roster. Views reports.
- **Proctor (Invigilator):** Performs student check-in, verifies identity, checks seat compliance, logs violations, views reports.
- **Student:** Participates in check-in (identity and seating are verified for the student).

## 3. Functional Requirements (FR)

### Authentication & Authorization
- **FR-01:** The system shall allow users to log in with username and password.
- **FR-02:** The system shall enforce role-based access control (Admin vs Proctor).
- **FR-03:** The system shall prevent unauthorized access to restricted pages and show an “Access Denied” message.

### Exam & Room Management (Admin)
- **FR-04:** The system shall allow Admin to create, edit, and delete exams.
- **FR-05:** The system shall allow Admin to create, edit, and delete rooms including room capacity (rows/cols).
- **FR-06:** The system shall allow Admin to define a seating plan for an exam (seat codes / grid layout).

### Student Roster (Admin)
- **FR-07:** The system shall allow Admin to add students manually.
- **FR-08:** The system shall allow Admin to import students (e.g., CSV).
- **FR-09:** The system shall store a registered ID photo reference (or file path) for each student.

### Check-in Workflow (Proctor)
- **FR-10:** The system shall allow Proctor to select an exam and student for check-in.
- **FR-11:** The system shall allow Proctor to capture or upload a live photo for check-in.
- **FR-12:** The system shall verify identity using an ML wrapper and return a decision (MATCH / NO_MATCH).
- **FR-13:** The system shall validate seat compliance by comparing expected seat vs actual seat.
- **FR-14:** The system shall save the check-in result including timestamps and status (APPROVED / FLAGGED).

### Violations (Proctor)
- **FR-15:** The system shall allow Proctor to log a violation for a flagged check-in.
- **FR-16:** The system shall require a violation reason and allow optional notes and optional evidence image.
- **FR-17:** The system shall link violation records to the related check-in and student.

### Reports (Admin & Proctor)
- **FR-18:** The system shall provide check-in reports (all check-ins, flagged check-ins).
- **FR-19:** The system shall provide violation reports.
- **FR-20:** The system shall support filtering reports by exam.

## 4. Non-Functional Requirements (NFR)
- **NFR-01 (Security):** The system shall protect access using authentication and role checks.
- **NFR-02 (Data Integrity):** The system shall prevent duplicate check-ins and invalid references.
- **NFR-03 (Usability):** The UI shall provide clear feedback for MATCH/NO_MATCH and CORRECT/WRONG results.
- **NFR-04 (Performance):** The check-in process should complete in a reasonable time without unnecessary steps.
- **NFR-05 (Reliability):** The system shall persist check-in and violation records consistently.

## 5. Scope Notes
The ML component is integrated as a wrapper service. The project focuses on correct workflow integration, validation, and testability rather than training a complex ML model.
