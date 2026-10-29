import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { ensureSeed } from "@/db/seed";

export async function GET() {
  try {
    await ensureSeed();
    const result = await db.execute(sql`
      SELECT e.id, e.exam_name as "name", e.exam_type as "type",
             to_char(e.exam_date, 'YYYY-MM-DD') as "date",
             substring(e.start_time::text, 1, 5) as "time",
             e.duration_minutes as "duration", e.subject,
             e.academic_year as "academicYear", e.status,
             COALESCE(
               (SELECT array_agg(department_code ORDER BY department_code)
                FROM exam_departments WHERE exam_id = e.id),
               ARRAY[]::varchar[]
             ) as "departments",
             COALESCE(
               (SELECT array_agg(semester_number ORDER BY semester_number)
                FROM exam_semesters WHERE exam_id = e.id),
               ARRAY[]::varchar[]
             ) as "semesters",
             (SELECT count(*)::int FROM seating WHERE exam_id = e.id) as "seatingCount"
      FROM exams e
      ORDER BY e.exam_date DESC, e.start_time ASC
    `);

    return NextResponse.json({ exams: result.rows });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching exams";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, type, date, time, duration, subject, academicYear, status, departments, semesters } = body;

    if (!name || !type || !date || !time || !subject) {
      return NextResponse.json({ error: "Name, type, date, time, and subject are required" }, { status: 400 });
    }

    if (!Array.isArray(departments) || departments.length === 0) {
      return NextResponse.json({ error: "Select at least one department" }, { status: 400 });
    }
    if (!Array.isArray(semesters) || semesters.length === 0) {
      return NextResponse.json({ error: "Select at least one semester" }, { status: 400 });
    }

    const inserted = await db.execute(sql`
      INSERT INTO exams(exam_name, exam_type, exam_date, start_time, duration_minutes, subject, academic_year, status)
      VALUES (
        ${name.trim()},
        ${type.trim().toUpperCase()},
        ${date}::date,
        ${time}::time,
        ${parseInt(duration) || 120},
        ${subject.trim()},
        ${academicYear || '2025-26'},
        ${status || 'SCHEDULED'}
      )
      RETURNING id, exam_name as "name", exam_type as "type", to_char(exam_date, 'YYYY-MM-DD') as "date",
                substring(start_time::text, 1, 5) as "time", duration_minutes as "duration",
                subject, academic_year as "academicYear", status
    `);

    const examId = (inserted.rows[0] as { id: number }).id;

    for (const d of departments) {
      await db.execute(sql`INSERT INTO exam_departments(exam_id, department_code) VALUES (${examId}, ${d})`);
    }
    for (const s of semesters) {
      await db.execute(sql`INSERT INTO exam_semesters(exam_id, semester_number) VALUES (${examId}, ${s})`);
    }

    return NextResponse.json({ exam: inserted.rows[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating exam";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, type, date, time, duration, subject, academicYear, status, departments, semesters } = body;

    if (!id || !name || !type || !date || !time || !subject) {
      return NextResponse.json({ error: "All required fields must be supplied" }, { status: 400 });
    }

    await db.execute(sql`
      UPDATE exams
      SET exam_name = ${name.trim()},
          exam_type = ${type.trim().toUpperCase()},
          exam_date = ${date}::date,
          start_time = ${time}::time,
          duration_minutes = ${parseInt(duration) || 120},
          subject = ${subject.trim()},
          academic_year = ${academicYear || '2025-26'},
          status = ${status || 'SCHEDULED'}
      WHERE id = ${id}
    `);

    if (Array.isArray(departments) && departments.length > 0) {
      await db.execute(sql`DELETE FROM exam_departments WHERE exam_id = ${id}`);
      for (const d of departments) {
        await db.execute(sql`INSERT INTO exam_departments(exam_id, department_code) VALUES (${id}, ${d})`);
      }
    }

    if (Array.isArray(semesters) && semesters.length > 0) {
      await db.execute(sql`DELETE FROM exam_semesters WHERE exam_id = ${id}`);
      for (const s of semesters) {
        await db.execute(sql`INSERT INTO exam_semesters(exam_id, semester_number) VALUES (${id}, ${s})`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating exam";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const examId = parseInt(id);
    await db.execute(sql`DELETE FROM seating WHERE exam_id = ${examId}`);
    await db.execute(sql`DELETE FROM invigilator_assignments WHERE exam_id = ${examId}`);
    await db.execute(sql`DELETE FROM exam_departments WHERE exam_id = ${examId}`);
    await db.execute(sql`DELETE FROM exam_semesters WHERE exam_id = ${examId}`);
    await db.execute(sql`DELETE FROM exams WHERE id = ${examId}`);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting exam";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
