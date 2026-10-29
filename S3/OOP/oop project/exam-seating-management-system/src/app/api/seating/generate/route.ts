import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

interface StudentRecord {
  id: number;
  registerNumber: string;
  name: string;
  departmentCode: string;
  semesterNumber: string;
  division: string;
}

interface RoomRecord {
  id: number;
  roomNumber: string;
  building: string;
  floorNo: number;
  rowsCount: number;
  columnsCount: number;
  capacity: number;
}

interface TeacherRecord {
  id: number;
  name: string;
  departmentCode: string;
  designation: string;
  phone: string;
}

function applyShuffle(source: StudentRecord[], mode: string): StudentRecord[] {
  const students = [...source];
  switch (mode) {
    case "Random Shuffle":
    case "Custom Shuffle": {
      for (let i = students.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [students[i], students[j]] = [students[j], students[i]];
      }
      return students;
    }
    case "Register Number Ascending": {
      return students.sort((a, b) => a.registerNumber.localeCompare(b.registerNumber));
    }
    case "Register Number Descending": {
      return students.sort((a, b) => b.registerNumber.localeCompare(a.registerNumber));
    }
    case "Department-wise":
    case "Department + Register Number": {
      return students.sort((a, b) => {
        const cmp = a.departmentCode.localeCompare(b.departmentCode);
        return cmp !== 0 ? cmp : a.registerNumber.localeCompare(b.registerNumber);
      });
    }
    case "Semester-wise": {
      return students.sort((a, b) => {
        const cmp = a.semesterNumber.localeCompare(b.semesterNumber);
        return cmp !== 0 ? cmp : a.registerNumber.localeCompare(b.registerNumber);
      });
    }
    case "Department Mixing": {
      // Group by department
      const map = new Map<string, StudentRecord[]>();
      for (const s of students) {
        if (!map.has(s.departmentCode)) map.set(s.departmentCode, []);
        map.get(s.departmentCode)!.push(s);
      }
      // Round robin take 1 from each department
      const mixed: StudentRecord[] = [];
      let remaining = true;
      const queues = Array.from(map.values());
      const indices = queues.map(() => 0);

      while (remaining) {
        remaining = false;
        for (let q = 0; q < queues.length; q++) {
          const list = queues[q];
          const idx = indices[q];
          if (idx < list.length) {
            mixed.push(list[idx]);
            indices[q] = idx + 1;
            remaining = true;
          }
        }
      }
      return mixed;
    }
    case "No Shuffle":
    default:
      return students;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { examId, shuffleOrder = "No Shuffle", roomSelectionMode = "AUTOMATIC", selectedRoomIds = [] } = body;

    if (!examId) {
      return NextResponse.json({ error: "No examination is selected." }, { status: 400 });
    }

    const id = parseInt(examId);

    // Fetch exam
    const examRes = await db.execute(sql`
      SELECT id, exam_name as "name", exam_type as "type", to_char(exam_date, 'YYYY-MM-DD') as "date",
             substring(start_time::text, 1, 5) as "time", duration_minutes as "duration", subject,
             academic_year as "academicYear"
      FROM exams WHERE id = ${id}
    `);
    if (examRes.rows.length === 0) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }
    const exam = examRes.rows[0];

    // Get departments & semesters
    const deptsRes = await db.execute(sql`SELECT department_code as code FROM exam_departments WHERE exam_id = ${id}`);
    const semsRes = await db.execute(sql`SELECT semester_number as num FROM exam_semesters WHERE exam_id = ${id}`);
    const depts = deptsRes.rows.map(r => (r as { code: string }).code);
    const sems = semsRes.rows.map(r => (r as { num: string }).num);

    if (depts.length === 0 || sems.length === 0) {
      return NextResponse.json({ error: "This exam does not have departments or semesters assigned." }, { status: 400 });
    }

    // Fetch students
    const deptsSql = sql.join(depts.map(d => sql`${d}`), sql`, `);
    const semsSql = sql.join(sems.map(s => sql`${s}`), sql`, `);

    const studentsRes = await db.execute(sql`
      SELECT id, register_number as "registerNumber", name, department_code as "departmentCode",
             semester_number as "semesterNumber", division
      FROM students
      WHERE status = 'ACTIVE'
        AND department_code IN (${deptsSql})
        AND semester_number IN (${semsSql})
      ORDER BY register_number ASC
    `);

    const rawStudents = studentsRes.rows as unknown as StudentRecord[];
    if (rawStudents.length === 0) {
      return NextResponse.json({ error: "No students are selected." }, { status: 400 });
    }

    // Fetch rooms
    const allRoomsRes = await db.execute(sql`
      SELECT id, room_number as "roomNumber", building, floor_no as "floorNo",
             rows_count as "rowsCount", columns_count as "columnsCount",
             capacity
      FROM rooms
      WHERE status = 'AVAILABLE'
      ORDER BY room_number ASC
    `);
    const availableRooms = allRoomsRes.rows as unknown as RoomRecord[];

    let allocatedRooms: RoomRecord[] = [];

    if (roomSelectionMode === "AUTOMATIC") {
      let cap = 0;
      for (const r of availableRooms) {
        allocatedRooms.push(r);
        cap += r.capacity;
        if (cap >= rawStudents.length) break;
      }
      if (cap < rawStudents.length) {
        return NextResponse.json({
          error: `Room capacity is insufficient. Required: ${rawStudents.length}, Available: ${cap}`,
        }, { status: 400 });
      }
    } else {
      // MANUAL
      if (!Array.isArray(selectedRoomIds) || selectedRoomIds.length === 0) {
        return NextResponse.json({ error: "No rooms are selected." }, { status: 400 });
      }
      allocatedRooms = availableRooms.filter(r => selectedRoomIds.includes(r.id));
      if (allocatedRooms.length === 0) {
        return NextResponse.json({ error: "None of the selected rooms are currently available." }, { status: 400 });
      }
      const totalManualCapacity = allocatedRooms.reduce((sum, r) => sum + r.capacity, 0);
      if (totalManualCapacity < rawStudents.length) {
        return NextResponse.json({
          error: `Selected room capacity is insufficient for the selected students. Selected: ${totalManualCapacity}, Students: ${rawStudents.length}`,
        }, { status: 400 });
      }
    }

    // Apply shuffle
    const shuffledStudents = applyShuffle(rawStudents, shuffleOrder);

    // Fetch available teachers for invigilation
    const teachersRes = await db.execute(sql`
      SELECT id, name, department_code as "departmentCode", designation, phone
      FROM teachers
      WHERE status = 'AVAILABLE'
      ORDER BY name ASC
    `);
    const availableTeachers = teachersRes.rows as unknown as TeacherRecord[];

    // Assign invigilator per room
    const invigilatorMap = new Map<number, TeacherRecord>();
    for (let i = 0; i < allocatedRooms.length; i++) {
      if (i < availableTeachers.length) {
        invigilatorMap.set(allocatedRooms[i].id, availableTeachers[i]);
      }
    }

    // Generate seats
    interface SeatAssignment {
      examId: number;
      studentId: number;
      roomId: number;
      rowLabel: string;
      columnNumber: number;
      seatNumber: string;
      invigilatorId: number | null;
      registerNumber: string;
      studentName: string;
      departmentCode: string;
      roomNumber: string;
      invigilatorName: string;
    }

    const assignments: SeatAssignment[] = [];
    let studentCursor = 0;

    for (const room of allocatedRooms) {
      const invigilator = invigilatorMap.get(room.id);
      for (let r = 0; r < room.rowsCount && studentCursor < shuffledStudents.length; r++) {
        const rowLabel = String.fromCharCode(65 + r); // 'A', 'B', 'C'...
        for (let c = 1; c <= room.columnsCount && studentCursor < shuffledStudents.length; c++) {
          const student = shuffledStudents[studentCursor++];
          const seatNumber = `${rowLabel}${c}`;
          assignments.push({
            examId: id,
            studentId: student.id,
            roomId: room.id,
            rowLabel,
            columnNumber: c,
            seatNumber,
            invigilatorId: invigilator ? invigilator.id : null,
            registerNumber: student.registerNumber,
            studentName: student.name,
            departmentCode: student.departmentCode,
            roomNumber: room.roomNumber,
            invigilatorName: invigilator ? invigilator.name : "Unassigned",
          });
        }
      }
    }

    // Delete existing arrangement for this exam
    await db.execute(sql`DELETE FROM seating WHERE exam_id = ${id}`);
    await db.execute(sql`DELETE FROM invigilator_assignments WHERE exam_id = ${id}`);

    // Insert invigilator assignments
    for (const [roomId, teacher] of invigilatorMap.entries()) {
      await db.execute(sql`
        INSERT INTO invigilator_assignments(exam_id, room_id, teacher_id)
        VALUES (${id}, ${roomId}, ${teacher.id})
      `);
    }

    // Batch insert seating records
    for (const a of assignments) {
      await db.execute(sql`
        INSERT INTO seating(exam_id, student_id, room_id, row_label, column_number, seat_number, invigilator_id)
        VALUES (${a.examId}, ${a.studentId}, ${a.roomId}, ${a.rowLabel}, ${a.columnNumber}, ${a.seatNumber}, ${a.invigilatorId})
      `);
    }

    const totalCapacity = allocatedRooms.reduce((sum, r) => sum + r.capacity, 0);
    const emptySeats = totalCapacity - assignments.length;

    return NextResponse.json({
      success: true,
      exam,
      shuffleOrder,
      roomSelectionMode,
      studentsCount: shuffledStudents.length,
      roomsUsedCount: allocatedRooms.length,
      totalCapacity,
      emptySeats,
      rooms: allocatedRooms.map(r => ({
        ...r,
        invigilator: invigilatorMap.get(r.id) || null,
        seats: assignments.filter(a => a.roomId === r.id),
      })),
      assignments,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error generating seating";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
