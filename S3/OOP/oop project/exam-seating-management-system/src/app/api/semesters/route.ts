import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { ensureSeed } from "@/db/seed";

export async function GET() {
  try {
    await ensureSeed();
    const result = await db.execute(sql`
      SELECT id, semester_number as "semesterNumber", academic_year as "academicYear", status
      FROM semesters
      ORDER BY semester_number ASC
    `);
    return NextResponse.json({ semesters: result.rows });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching semesters";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { semesterNumber, academicYear, status } = body;
    if (!semesterNumber || !academicYear) return NextResponse.json({ error: "Semester number and Academic Year required" }, { status: 400 });

    const existing = await db.execute(sql`SELECT id FROM semesters WHERE semester_number = ${semesterNumber.trim().toUpperCase()}`);
    if (existing.rows.length > 0) return NextResponse.json({ error: "Semester already exists" }, { status: 400 });

    const inserted = await db.execute(sql`
      INSERT INTO semesters(semester_number, academic_year, status)
      VALUES (${semesterNumber.trim().toUpperCase()}, ${academicYear.trim()}, ${status || 'ACTIVE'})
      RETURNING id, semester_number as "semesterNumber", academic_year as "academicYear", status
    `);
    return NextResponse.json({ semester: inserted.rows[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating semester";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, semesterNumber, academicYear, status } = body;
    if (!id || !semesterNumber || !academicYear) return NextResponse.json({ error: "All fields required" }, { status: 400 });

    await db.execute(sql`
      UPDATE semesters SET semester_number = ${semesterNumber.trim().toUpperCase()}, academic_year = ${academicYear.trim()}, status = ${status || 'ACTIVE'}
      WHERE id = ${id}
    `);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating semester";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await db.execute(sql`DELETE FROM semesters WHERE id = ${parseInt(id)}`);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting semester";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
