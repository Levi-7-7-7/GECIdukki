import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const examId = searchParams.get("examId");
    if (!examId) return NextResponse.json({ error: "Exam ID required" }, { status: 400 });

    const id = parseInt(examId);

    // Get exam info
    const examRes = await db.execute(sql`
      SELECT id, exam_name as "name", exam_type as "type", to_char(exam_date, 'YYYY-MM-DD') as "date",
             substring(start_time::text, 1, 5) as "time", duration_minutes as "duration", subject,
             academic_year as "academicYear"
      FROM exams WHERE id = ${id}
    `);
    if (examRes.rows.length === 0) return NextResponse.json({ error: "Exam not found" }, { status: 404 });

    const exam = examRes.rows[0];

    // Get selected departments & semesters
    const deptsRes = await db.execute(sql`SELECT department_code as code FROM exam_departments WHERE exam_id = ${id}`);
    const semsRes = await db.execute(sql`SELECT semester_number as num FROM exam_semesters WHERE exam_id = ${id}`);

    const depts = deptsRes.rows.map(r => (r as { code: string }).code);
    const sems = semsRes.rows.map(r => (r as { num: string }).num);

    if (depts.length === 0 || sems.length === 0) {
      return NextResponse.json({ exam, departments: depts, semesters: sems, students: [], count: 0 });
    }

    const deptsSql = sql.join(depts.map(d => sql`${d}`), sql`, `);
    const semsSql = sql.join(sems.map(s => sql`${s}`), sql`, `);

    const studentsRes = await db.execute(sql`
      SELECT id, register_number as "registerNumber", name, department_code as "departmentCode",
             semester_number as "semesterNumber", division
      FROM students
      WHERE status = 'ACTIVE'
        AND department_code IN (${deptsSql})
        AND semester_number IN (${semsSql})
      ORDER BY department_code ASC, register_number ASC
    `);

    // Also get existing seating count
    const existingSeatingRes = await db.execute(sql`SELECT count(*)::int as count FROM seating WHERE exam_id = ${id}`);
    const existingSeatingCount = (existingSeatingRes.rows[0] as { count: number })?.count || 0;

    return NextResponse.json({
      exam,
      departments: depts,
      semesters: sems,
      students: studentsRes.rows,
      count: studentsRes.rows.length,
      existingSeatingCount,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching exam students";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
