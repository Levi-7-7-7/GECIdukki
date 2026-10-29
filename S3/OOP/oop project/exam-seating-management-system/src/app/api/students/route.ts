import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { ensureSeed } from "@/db/seed";

export async function GET(req: Request) {
  try {
    await ensureSeed();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";

    let result;
    if (search) {
      const term = `%${search}%`;
      result = await db.execute(sql`
        SELECT id, register_number as "registerNumber", name, department_code as "departmentCode",
               semester_number as "semesterNumber", division, status
        FROM students
        WHERE register_number ILIKE ${term}
           OR name ILIKE ${term}
           OR department_code ILIKE ${term}
           OR semester_number ILIKE ${term}
        ORDER BY register_number ASC
      `);
    } else {
      result = await db.execute(sql`
        SELECT id, register_number as "registerNumber", name, department_code as "departmentCode",
               semester_number as "semesterNumber", division, status
        FROM students
        ORDER BY register_number ASC
      `);
    }

    return NextResponse.json({ students: result.rows });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching students";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { registerNumber, name, departmentCode, semesterNumber, division, status } = body;

    if (!registerNumber || !name || !departmentCode || !semesterNumber) {
      return NextResponse.json({ error: "Register Number, Name, Department, and Semester are required" }, { status: 400 });
    }

    // Check duplicate
    const existing = await db.execute(sql`
      SELECT id FROM students WHERE register_number = ${registerNumber.trim().toUpperCase()}
    `);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: `Student with Register Number ${registerNumber.trim().toUpperCase()} already exists!` }, { status: 400 });
    }

    const inserted = await db.execute(sql`
      INSERT INTO students(register_number, name, department_code, semester_number, division, status)
      VALUES(${registerNumber.trim().toUpperCase()}, ${name.trim()}, ${departmentCode.trim().toUpperCase()}, ${semesterNumber.trim().toUpperCase()}, ${division?.trim() || 'A'}, ${status || 'ACTIVE'})
      RETURNING id, register_number as "registerNumber", name, department_code as "departmentCode", semester_number as "semesterNumber", division, status
    `);

    return NextResponse.json({ student: inserted.rows[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating student";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, registerNumber, name, departmentCode, semesterNumber, division, status } = body;

    if (!id || !registerNumber || !name || !departmentCode || !semesterNumber) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check duplicate for different ID
    const existing = await db.execute(sql`
      SELECT id FROM students WHERE register_number = ${registerNumber.trim().toUpperCase()} AND id != ${id}
    `);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: `Another student already has Register Number ${registerNumber.trim().toUpperCase()}` }, { status: 400 });
    }

    await db.execute(sql`
      UPDATE students
      SET register_number = ${registerNumber.trim().toUpperCase()},
          name = ${name.trim()},
          department_code = ${departmentCode.trim().toUpperCase()},
          semester_number = ${semesterNumber.trim().toUpperCase()},
          division = ${division?.trim() || 'A'},
          status = ${status || 'ACTIVE'}
      WHERE id = ${id}
    `);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating student";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Student ID required" }, { status: 400 });

    // Check if seating exists
    await db.execute(sql`DELETE FROM seating WHERE student_id = ${parseInt(id)}`);
    await db.execute(sql`DELETE FROM students WHERE id = ${parseInt(id)}`);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting student";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
