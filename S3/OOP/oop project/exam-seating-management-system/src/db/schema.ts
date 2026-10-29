import { pgTable, serial, varchar, text, integer, date, time, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 60 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).notNull(), // 'ADMIN' | 'TEACHER'
  fullName: varchar("full_name", { length: 120 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("ACTIVE"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 15 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("ACTIVE"),
});

export const semesters = pgTable("semesters", {
  id: serial("id").primaryKey(),
  semesterNumber: varchar("semester_number", { length: 10 }).notNull().unique(),
  academicYear: varchar("academic_year", { length: 20 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("ACTIVE"),
});

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  registerNumber: varchar("register_number", { length: 30 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  departmentCode: varchar("department_code", { length: 15 }).notNull(),
  semesterNumber: varchar("semester_number", { length: 10 }).notNull(),
  division: varchar("division", { length: 10 }).notNull().default("A"),
  status: varchar("status", { length: 20 }).notNull().default("ACTIVE"),
});

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  roomNumber: varchar("room_number", { length: 20 }).notNull().unique(),
  building: varchar("building", { length: 100 }).notNull(),
  floorNo: integer("floor_no").notNull().default(1),
  rowsCount: integer("rows_count").notNull(),
  columnsCount: integer("columns_count").notNull(),
  capacity: integer("capacity").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("AVAILABLE"),
});

export const roomTemplates = pgTable("room_templates", {
  id: serial("id").primaryKey(),
  templateName: varchar("template_name", { length: 100 }).notNull().unique(),
  startingRoom: varchar("starting_room", { length: 20 }).notNull(),
  numberOfRooms: integer("number_of_rooms").notNull(),
  rowsCount: integer("rows_count").notNull(),
  columnsCount: integer("columns_count").notNull(),
  building: varchar("building", { length: 100 }).notNull(),
  floorNo: integer("floor_no").notNull().default(1),
});

export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  departmentCode: varchar("department_code", { length: 15 }).notNull(),
  designation: varchar("designation", { length: 80 }).notNull(),
  phone: varchar("phone", { length: 25 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("AVAILABLE"),
});

export const exams = pgTable("exams", {
  id: serial("id").primaryKey(),
  examName: varchar("exam_name", { length: 160 }).notNull(),
  examType: varchar("exam_type", { length: 20 }).notNull(), // 'INTERNAL' | 'EXTERNAL'
  examDate: date("exam_date").notNull(),
  startTime: time("start_time").notNull(),
  durationMinutes: integer("duration_minutes").notNull().default(120),
  subject: varchar("subject", { length: 160 }).notNull(),
  academicYear: varchar("academic_year", { length: 20 }).notNull().default("2025-26"),
  status: varchar("status", { length: 20 }).notNull().default("SCHEDULED"),
});

export const examDepartments = pgTable("exam_departments", {
  id: serial("id").primaryKey(),
  examId: integer("exam_id").notNull(),
  departmentCode: varchar("department_code", { length: 15 }).notNull(),
});

export const examSemesters = pgTable("exam_semesters", {
  id: serial("id").primaryKey(),
  examId: integer("exam_id").notNull(),
  semesterNumber: varchar("semester_number", { length: 10 }).notNull(),
});

export const seating = pgTable("seating", {
  id: serial("id").primaryKey(),
  examId: integer("exam_id").notNull(),
  studentId: integer("student_id").notNull(),
  roomId: integer("room_id").notNull(),
  rowLabel: varchar("row_label", { length: 5 }).notNull(),
  columnNumber: integer("column_number").notNull(),
  seatNumber: varchar("seat_number", { length: 10 }).notNull(),
  invigilatorId: integer("invigilator_id"),
});

export const invigilatorAssignments = pgTable("invigilator_assignments", {
  id: serial("id").primaryKey(),
  examId: integer("exam_id").notNull(),
  roomId: integer("room_id").notNull(),
  teacherId: integer("teacher_id").notNull(),
});
