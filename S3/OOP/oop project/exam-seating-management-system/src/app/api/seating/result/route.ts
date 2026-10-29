import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const examId = searchParams.get("examId");
    if (!examId) return NextResponse.json({ error: "Exam ID required" }, { status: 400 });

    const id = parseInt(examId);

    // Fetch exam info
    const examRes = await db.execute(sql`
      SELECT id, exam_name as "name", exam_type as "type", to_char(exam_date, 'YYYY-MM-DD') as "date",
             substring(start_time::text, 1, 5) as "time", duration_minutes as "duration", subject,
             academic_year as "academicYear"
      FROM exams WHERE id = ${id}
    `);
    if (examRes.rows.length === 0) return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    const exam = examRes.rows[0];

    // Fetch seating joined with students, rooms, and teachers
    const seatingRes = await db.execute(sql`
      SELECT s.id, s.exam_id as "examId", s.student_id as "studentId", s.room_id as "roomId",
             s.row_label as "rowLabel", s.column_number as "columnNumber", s.seat_number as "seatNumber",
             st.register_number as "registerNumber", st.name as "studentName", st.department_code as "departmentCode",
             st.semester_number as "semesterNumber", r.room_number as "roomNumber", r.rows_count as "rowsCount",
             r.columns_count as "columnsCount", r.capacity, COALESCE(t.name, 'Unassigned') as "invigilatorName",
             COALESCE(t.designation, '') as "invigilatorDesignation"
      FROM seating s
      JOIN students st ON st.id = s.student_id
      JOIN rooms r ON r.id = s.room_id
      LEFT JOIN teachers t ON t.id = s.invigilator_id
      WHERE s.exam_id = ${id}
      ORDER BY r.room_number ASC, s.row_label ASC, s.column_number ASC
    `);

    const seats = seatingRes.rows;

    // Fetch invigilator assignments
    const invigilatorsRes = await db.execute(sql`
      SELECT r.room_number as "roomNumber", t.name as "teacherName", t.designation as "designation", t.department_code as "departmentCode"
      FROM invigilator_assignments ia
      JOIN rooms r ON r.id = ia.room_id
      JOIN teachers t ON t.id = ia.teacher_id
      WHERE ia.exam_id = ${id}
      ORDER BY r.room_number ASC
    `);

    // Group seats by room
    const roomsMap = new Map();
    for (const seat of seats) {
      const roomNum = (seat as { roomNumber: string }).roomNumber;
      if (!roomsMap.has(roomNum)) {
        roomsMap.set(roomNum, {
          roomNumber: roomNum,
          capacity: (seat as { capacity: number }).capacity,
          rowsCount: (seat as { rowsCount: number }).rowsCount,
          columnsCount: (seat as { columnsCount: number }).columnsCount,
          invigilatorName: (seat as { invigilatorName: string }).invigilatorName,
          invigilatorDesignation: (seat as { invigilatorDesignation: string }).invigilatorDesignation,
          seats: [],
        });
      }
      roomsMap.get(roomNum).seats.push(seat);
    }

    return NextResponse.json({
      exam,
      totalStudentsSeated: seats.length,
      rooms: Array.from(roomsMap.values()),
      invigilators: invigilatorsRes.rows,
      allSeats: seats,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching seating result";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
