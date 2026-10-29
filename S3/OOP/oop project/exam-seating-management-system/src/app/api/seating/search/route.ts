import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const registerNumber = searchParams.get("registerNumber")?.trim();
    if (!registerNumber) return NextResponse.json({ error: "Register number is required" }, { status: 400 });

    const result = await db.execute(sql`
      SELECT s.id, s.seat_number as "seatNumber", s.row_label as "rowLabel", s.column_number as "columnNumber",
             st.register_number as "registerNumber", st.name as "studentName",
             st.department_code as "departmentCode", st.semester_number as "semesterNumber",
             r.room_number as "roomNumber", r.building, r.floor_no as "floorNo",
             e.id as "examId", e.exam_name as "examName", e.exam_type as "examType",
             to_char(e.exam_date, 'DD-MM-YYYY') as "examDate",
             substring(e.start_time::text, 1, 5) as "examTime",
             e.subject,
             COALESCE(t.name, 'Unassigned') as "invigilatorName",
             COALESCE(t.designation, '') as "invigilatorDesignation"
      FROM seating s
      JOIN students st ON st.id = s.student_id
      JOIN rooms r ON r.id = s.room_id
      JOIN exams e ON e.id = s.exam_id
      LEFT JOIN teachers t ON t.id = s.invigilator_id
      WHERE st.register_number ILIKE ${registerNumber}
      ORDER BY e.exam_date DESC, s.id DESC
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      // Check if student exists at all
      const studentCheck = await db.execute(sql`
        SELECT register_number as "registerNumber", name, department_code as "departmentCode", semester_number as "semesterNumber"
        FROM students
        WHERE register_number ILIKE ${registerNumber}
        LIMIT 1
      `);

      if (studentCheck.rows.length > 0) {
        return NextResponse.json({
          student: studentCheck.rows[0],
          seating: null,
          message: "Student found, but no examination seating arrangement has been generated yet for this student.",
        });
      }

      return NextResponse.json({ error: `No student found with register number ${registerNumber}` }, { status: 404 });
    }

    return NextResponse.json({ seating: result.rows[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error searching student seat";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
