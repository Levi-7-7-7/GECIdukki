CREATE DATABASE IF NOT EXISTS smart_exam_seating CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smart_exam_seating;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS invigilator_assignments, seating, exam_departments, exam_semesters,
    exams, room_templates, teachers, rooms, students, semesters, departments, users;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(60) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN','TEACHER') NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    status ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(15) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL UNIQUE,
    status ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE'
);
CREATE TABLE semesters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    semester_number VARCHAR(5) NOT NULL UNIQUE,
    academic_year VARCHAR(20) NOT NULL,
    status ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE'
);
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    register_number VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    department_code VARCHAR(15) NOT NULL,
    semester_number VARCHAR(5) NOT NULL,
    division VARCHAR(10) NOT NULL,
    status ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT fk_student_department FOREIGN KEY (department_code) REFERENCES departments(code),
    CONSTRAINT fk_student_semester FOREIGN KEY (semester_number) REFERENCES semesters(semester_number)
);
CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(20) NOT NULL UNIQUE,
    building VARCHAR(100) NOT NULL,
    floor_no INT NOT NULL,
    rows_count INT NOT NULL,
    columns_count INT NOT NULL,
    capacity INT NOT NULL,
    status ENUM('AVAILABLE','UNAVAILABLE') NOT NULL DEFAULT 'AVAILABLE',
    CHECK (rows_count > 0 AND columns_count > 0 AND capacity = rows_count * columns_count)
);
CREATE TABLE room_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_name VARCHAR(100) NOT NULL UNIQUE,
    starting_room VARCHAR(20) NOT NULL,
    number_of_rooms INT NOT NULL,
    rows_count INT NOT NULL,
    columns_count INT NOT NULL,
    building VARCHAR(100) NOT NULL,
    floor_no INT NOT NULL,
    CHECK (number_of_rooms > 0 AND rows_count > 0 AND columns_count > 0)
);
CREATE TABLE teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    department_code VARCHAR(15) NOT NULL,
    designation VARCHAR(80) NOT NULL,
    phone VARCHAR(25) NOT NULL,
    status ENUM('AVAILABLE','UNAVAILABLE') NOT NULL DEFAULT 'AVAILABLE',
    CONSTRAINT fk_teacher_department FOREIGN KEY (department_code) REFERENCES departments(code)
);
CREATE TABLE exams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_name VARCHAR(160) NOT NULL,
    exam_type ENUM('INTERNAL','EXTERNAL') NOT NULL,
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration_minutes INT NOT NULL,
    subject VARCHAR(160) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    status ENUM('SCHEDULED','COMPLETED','CANCELLED') NOT NULL DEFAULT 'SCHEDULED'
);
CREATE TABLE exam_departments (
    exam_id INT NOT NULL,
    department_code VARCHAR(15) NOT NULL,
    PRIMARY KEY (exam_id, department_code),
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY (department_code) REFERENCES departments(code)
);
CREATE TABLE exam_semesters (
    exam_id INT NOT NULL,
    semester_number VARCHAR(5) NOT NULL,
    PRIMARY KEY (exam_id, semester_number),
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY (semester_number) REFERENCES semesters(semester_number)
);
CREATE TABLE seating (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT NOT NULL,
    student_id INT NOT NULL,
    room_id INT NOT NULL,
    row_label VARCHAR(5) NOT NULL,
    column_number INT NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    invigilator_id INT NULL,
    UNIQUE KEY uq_exam_student (exam_id, student_id),
    UNIQUE KEY uq_exam_seat (exam_id, room_id, row_label, column_number),
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (invigilator_id) REFERENCES teachers(id) ON DELETE SET NULL
);
CREATE TABLE invigilator_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT NOT NULL,
    room_id INT NOT NULL,
    teacher_id INT NOT NULL,
    UNIQUE KEY uq_exam_room (exam_id, room_id),
    UNIQUE KEY uq_exam_teacher (exam_id, teacher_id),
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);

INSERT INTO users(username,password,role,full_name) VALUES
('admin','admin123','ADMIN','System Administrator'),
('teacher','teacher123','TEACHER','Examination Coordinator');
INSERT INTO departments(code,name) VALUES
('CSE','Computer Science and Engineering'),('ECE','Electronics and Communication Engineering'),
('EEE','Electrical and Electronics Engineering'),('ME','Mechanical Engineering'),
('CE','Civil Engineering'),('IT','Information Technology');
INSERT INTO semesters(semester_number,academic_year) VALUES
('S1','2025-26'),('S2','2025-26'),('S3','2025-26'),('S4','2025-26'),
('S5','2025-26'),('S6','2025-26'),('S7','2025-26'),('S8','2025-26');
INSERT INTO rooms(room_number,building,floor_no,rows_count,columns_count,capacity) VALUES
('101','Main Block',1,5,6,30),('102','Main Block',1,5,6,30),('103','Main Block',1,5,6,30),
('104','Main Block',1,5,6,30),('105','Main Block',1,5,6,30),('106','Main Block',1,5,6,30),
('107','Main Block',1,5,6,30),('108','Main Block',1,5,6,30),('109','Main Block',1,6,6,36),
('110','Main Block',1,6,6,36);
INSERT INTO room_templates(template_name,starting_room,number_of_rooms,rows_count,columns_count,building,floor_no)
VALUES ('Main Block - 30 Seats','101',10,5,6,'Main Block',1);
INSERT INTO teachers(name,department_code,designation,phone) VALUES
('Anil Kumar','CSE','Assistant Professor','9876500001'),('Suresh Kumar','ECE','Assistant Professor','9876500002'),
('Priya Joseph','EEE','Associate Professor','9876500003'),('Rahul Mathew','ME','Assistant Professor','9876500004'),
('Meera Nair','CE','Lecturer','9876500005'),('Vivek Menon','IT','Assistant Professor','9876500006'),
('Divya Raj','CSE','Lecturer','9876500007'),('Thomas George','ECE','Assistant Professor','9876500008'),
('Lakshmi Devi','EEE','Lecturer','9876500009'),('Arjun Das','ME','Assistant Professor','9876500010'),
('Nithya S','CE','Lecturer','9876500011'),('Faisal Khan','IT','Assistant Professor','9876500012'),
('Kiran Babu','CSE','Associate Professor','9876500013'),('Asha Paul','ECE','Lecturer','9876500014'),
('Mohan Lal','EEE','Assistant Professor','9876500015');

-- 143 CSE/S3 records make the automatic 5-room, 150-seat demonstration reproducible.
DROP PROCEDURE IF EXISTS seed_demo_students;
DELIMITER //
CREATE PROCEDURE seed_demo_students()
BEGIN
    DECLARE i INT DEFAULT 1;
    WHILE i <= 143 DO
        INSERT INTO students(register_number,name,department_code,semester_number,division,status)
        VALUES (CONCAT('24CS',LPAD(i,3,'0')), CONCAT('CSE Student ',i), 'CSE', 'S3', IF(i <= 72,'A','B'),'ACTIVE');
        SET i = i + 1;
    END WHILE;
    SET i = 1;
    WHILE i <= 12 DO
        INSERT INTO students(register_number,name,department_code,semester_number,division,status)
        VALUES (CONCAT('24EC',LPAD(i,3,'0')), CONCAT('ECE Student ',i), 'ECE', 'S3', 'A','ACTIVE');
        SET i = i + 1;
    END WHILE;
    SET i = 1;
    WHILE i <= 12 DO
        INSERT INTO students(register_number,name,department_code,semester_number,division,status)
        VALUES (CONCAT('24EE',LPAD(i,3,'0')), CONCAT('EEE Student ',i), 'EEE', 'S5', 'A','ACTIVE');
        SET i = i + 1;
    END WHILE;
    SET i = 1;
    WHILE i <= 12 DO
        INSERT INTO students(register_number,name,department_code,semester_number,division,status)
        VALUES (CONCAT('24ME',LPAD(i,3,'0')), CONCAT('ME Student ',i), 'ME', 'S5', 'A','ACTIVE');
        SET i = i + 1;
    END WHILE;
END//
DELIMITER ;
CALL seed_demo_students();
DROP PROCEDURE seed_demo_students;

INSERT INTO exams(exam_name,exam_type,exam_date,start_time,duration_minutes,subject,academic_year)
VALUES
('Internal Examination - S3','INTERNAL','2026-09-20','10:00:00',120,'Data Structures','2025-26'),
('External Examination - Mixed','EXTERNAL','2026-10-05','10:00:00',180,'Computer Networks','2025-26'),
('Internal Examination - S5','INTERNAL','2026-10-15','14:00:00',120,'Operating Systems','2025-26');
INSERT INTO exam_departments(exam_id,department_code) SELECT id,'CSE' FROM exams WHERE exam_name='Internal Examination - S3';
INSERT INTO exam_semesters(exam_id,semester_number) SELECT id,'S3' FROM exams WHERE exam_name='Internal Examination - S3';
INSERT INTO exam_departments(exam_id,department_code)
SELECT e.id,d.code FROM exams e JOIN departments d ON d.code IN ('CSE','ECE','EEE')
WHERE e.exam_name='External Examination - Mixed';
INSERT INTO exam_semesters(exam_id,semester_number)
SELECT e.id,s.semester_number FROM exams e JOIN semesters s ON s.semester_number IN ('S3','S5')
WHERE e.exam_name='External Examination - Mixed';
