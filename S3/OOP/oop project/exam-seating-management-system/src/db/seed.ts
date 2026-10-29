import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function ensureSeed() {
  // Check if users exist
  const existingUsers = await db.execute(sql`SELECT count(*)::int as count FROM users`);
  const count = (existingUsers.rows[0] as { count: number })?.count || 0;
  if (count > 0) return;

  console.log("Seeding initial database...");

  // Insert Users
  await db.execute(sql`
    INSERT INTO users(username, password, role, full_name, status) VALUES
    ('admin', 'admin123', 'ADMIN', 'System Administrator', 'ACTIVE'),
    ('teacher', 'teacher123', 'TEACHER', 'Examination Coordinator', 'ACTIVE')
    ON CONFLICT DO NOTHING;
  `);

  // Insert Departments
  await db.execute(sql`
    INSERT INTO departments(code, name, status) VALUES
    ('CSE', 'Computer Science and Engineering', 'ACTIVE'),
    ('ECE', 'Electronics and Communication Engineering', 'ACTIVE'),
    ('EEE', 'Electrical and Electronics Engineering', 'ACTIVE'),
    ('ME', 'Mechanical Engineering', 'ACTIVE'),
    ('CE', 'Civil Engineering', 'ACTIVE'),
    ('IT', 'Information Technology', 'ACTIVE')
    ON CONFLICT DO NOTHING;
  `);

  // Insert Semesters
  await db.execute(sql`
    INSERT INTO semesters(semester_number, academic_year, status) VALUES
    ('S1', '2025-26', 'ACTIVE'),
    ('S2', '2025-26', 'ACTIVE'),
    ('S3', '2025-26', 'ACTIVE'),
    ('S4', '2025-26', 'ACTIVE'),
    ('S5', '2025-26', 'ACTIVE'),
    ('S6', '2025-26', 'ACTIVE'),
    ('S7', '2025-26', 'ACTIVE'),
    ('S8', '2025-26', 'ACTIVE')
    ON CONFLICT DO NOTHING;
  `);

  // Insert Rooms (101 to 110)
  await db.execute(sql`
    INSERT INTO rooms(room_number, building, floor_no, rows_count, columns_count, capacity, status) VALUES
    ('101', 'Main Block', 1, 5, 6, 30, 'AVAILABLE'),
    ('102', 'Main Block', 1, 5, 6, 30, 'AVAILABLE'),
    ('103', 'Main Block', 1, 5, 6, 30, 'AVAILABLE'),
    ('104', 'Main Block', 1, 5, 6, 30, 'AVAILABLE'),
    ('105', 'Main Block', 1, 5, 6, 30, 'AVAILABLE'),
    ('106', 'Main Block', 1, 5, 6, 30, 'AVAILABLE'),
    ('107', 'Main Block', 1, 5, 6, 30, 'AVAILABLE'),
    ('108', 'Main Block', 1, 5, 6, 30, 'AVAILABLE'),
    ('109', 'Main Block', 1, 6, 6, 36, 'AVAILABLE'),
    ('110', 'Main Block', 1, 6, 6, 36, 'AVAILABLE')
    ON CONFLICT DO NOTHING;
  `);

  // Room Template
  await db.execute(sql`
    INSERT INTO room_templates(template_name, starting_room, number_of_rooms, rows_count, columns_count, building, floor_no) VALUES
    ('Main Block - 30 Seats', '101', 10, 5, 6, 'Main Block', 1)
    ON CONFLICT DO NOTHING;
  `);

  // Teachers
  await db.execute(sql`
    INSERT INTO teachers(name, department_code, designation, phone, status) VALUES
    ('Anil Kumar', 'CSE', 'Assistant Professor', '9876500001', 'AVAILABLE'),
    ('Suresh Kumar', 'ECE', 'Assistant Professor', '9876500002', 'AVAILABLE'),
    ('Priya Joseph', 'EEE', 'Associate Professor', '9876500003', 'AVAILABLE'),
    ('Rahul Mathew', 'ME', 'Assistant Professor', '9876500004', 'AVAILABLE'),
    ('Meera Nair', 'CE', 'Lecturer', '9876500005', 'AVAILABLE'),
    ('Vivek Menon', 'IT', 'Assistant Professor', '9876500006', 'AVAILABLE'),
    ('Divya Raj', 'CSE', 'Lecturer', '9876500007', 'AVAILABLE'),
    ('Thomas George', 'ECE', 'Assistant Professor', '9876500008', 'AVAILABLE'),
    ('Lakshmi Devi', 'EEE', 'Lecturer', '9876500009', 'AVAILABLE'),
    ('Arjun Das', 'ME', 'Assistant Professor', '9876500010', 'AVAILABLE'),
    ('Nithya S', 'CE', 'Lecturer', '9876500011', 'AVAILABLE'),
    ('Faisal Khan', 'IT', 'Assistant Professor', '9876500012', 'AVAILABLE'),
    ('Kiran Babu', 'CSE', 'Associate Professor', '9876500013', 'AVAILABLE'),
    ('Asha Paul', 'ECE', 'Lecturer', '9876500014', 'AVAILABLE'),
    ('Mohan Lal', 'EEE', 'Assistant Professor', '9876500015', 'AVAILABLE')
    ON CONFLICT DO NOTHING;
  `);

  // Insert 143 CSE Students (24CS001 to 24CS143) for the 5-room demo test scenario
  // plus other departments
  await db.execute(sql`
    DO $$
    DECLARE
      i INT := 1;
    BEGIN
      -- 143 CSE S3 students
      WHILE i <= 143 LOOP
        INSERT INTO students(register_number, name, department_code, semester_number, division, status)
        VALUES (
          '24CS' || LPAD(i::text, 3, '0'),
          CASE 
            WHEN i = 23 THEN 'Amal'
            WHEN i = 1 THEN 'Arun Kumar'
            WHEN i = 2 THEN 'Rahul Sen'
            WHEN i = 3 THEN 'Rohan Verma'
            ELSE 'CSE Student ' || i
          END,
          'CSE',
          'S3',
          CASE WHEN i <= 72 THEN 'A' ELSE 'B' END,
          'ACTIVE'
        ) ON CONFLICT (register_number) DO NOTHING;
        i := i + 1;
      END LOOP;

      -- 12 ECE S3 students
      i := 1;
      WHILE i <= 12 LOOP
        INSERT INTO students(register_number, name, department_code, semester_number, division, status)
        VALUES (
          '24EC' || LPAD(i::text, 3, '0'),
          CASE WHEN i = 1 THEN 'Rahul' ELSE 'ECE Student ' || i END,
          'ECE',
          'S3',
          'A',
          'ACTIVE'
        ) ON CONFLICT (register_number) DO NOTHING;
        i := i + 1;
      END LOOP;

      -- 12 EEE S5 students
      i := 1;
      WHILE i <= 12 LOOP
        INSERT INTO students(register_number, name, department_code, semester_number, division, status)
        VALUES (
          '24EE' || LPAD(i::text, 3, '0'),
          CASE WHEN i = 1 THEN 'Amal' ELSE 'EEE Student ' || i END,
          'EEE',
          'S5',
          'A',
          'ACTIVE'
        ) ON CONFLICT (register_number) DO NOTHING;
        i := i + 1;
      END LOOP;

      -- 12 ME S5 students
      i := 1;
      WHILE i <= 12 LOOP
        INSERT INTO students(register_number, name, department_code, semester_number, division, status)
        VALUES (
          '24ME' || LPAD(i::text, 3, '0'),
          'ME Student ' || i,
          'ME',
          'S5',
          'A',
          'ACTIVE'
        ) ON CONFLICT (register_number) DO NOTHING;
        i := i + 1;
      END LOOP;
    END $$;
  `);

  // Insert Exams
  await db.execute(sql`
    INSERT INTO exams(exam_name, exam_type, exam_date, start_time, duration_minutes, subject, academic_year, status) VALUES
    ('Internal Examination - S3', 'INTERNAL', '2026-09-20', '10:00:00', 120, 'Data Structures', '2025-26', 'SCHEDULED'),
    ('External Examination - Mixed', 'EXTERNAL', '2026-10-05', '10:00:00', 180, 'Computer Networks', '2025-26', 'SCHEDULED'),
    ('Internal Examination - S5', 'INTERNAL', '2026-10-15', '14:00:00', 120, 'Operating Systems', '2025-26', 'SCHEDULED')
    ON CONFLICT DO NOTHING;
  `);

  // Insert Exam Departments & Semesters
  await db.execute(sql`
    DO $$
    DECLARE
      exam1_id INT;
      exam2_id INT;
      exam3_id INT;
    BEGIN
      SELECT id INTO exam1_id FROM exams WHERE exam_name = 'Internal Examination - S3' LIMIT 1;
      SELECT id INTO exam2_id FROM exams WHERE exam_name = 'External Examination - Mixed' LIMIT 1;
      SELECT id INTO exam3_id FROM exams WHERE exam_name = 'Internal Examination - S5' LIMIT 1;

      IF exam1_id IS NOT NULL THEN
        INSERT INTO exam_departments(exam_id, department_code) VALUES (exam1_id, 'CSE');
        INSERT INTO exam_semesters(exam_id, semester_number) VALUES (exam1_id, 'S3');
      END IF;

      IF exam2_id IS NOT NULL THEN
        INSERT INTO exam_departments(exam_id, department_code) VALUES (exam2_id, 'CSE'), (exam2_id, 'ECE'), (exam2_id, 'EEE');
        INSERT INTO exam_semesters(exam_id, semester_number) VALUES (exam2_id, 'S3'), (exam2_id, 'S5');
      END IF;

      IF exam3_id IS NOT NULL THEN
        INSERT INTO exam_departments(exam_id, department_code) VALUES (exam3_id, 'CSE'), (exam3_id, 'EEE'), (exam3_id, 'ME');
        INSERT INTO exam_semesters(exam_id, semester_number) VALUES (exam3_id, 'S5');
      END IF;
    END $$;
  `);

  console.log("Seeding complete!");
}
