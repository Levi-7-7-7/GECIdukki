import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { ensureSeed } from "@/db/seed";

export async function GET() {
  try {
    await ensureSeed();
    const result = await db.execute(sql`
      SELECT id, name, department_code as "departmentCode", designation, phone, status
      FROM teachers
      ORDER BY name ASC
    `);
    return NextResponse.json({ teachers: result.rows });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching teachers";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, departmentCode, designation, phone, status } = body;

    if (!name || !departmentCode || !designation || !phone) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const inserted = await db.execute(sql`
      INSERT INTO teachers(name, department_code, designation, phone, status)
      VALUES (${name.trim()}, ${departmentCode.trim().toUpperCase()}, ${designation.trim()}, ${phone.trim()}, ${status || 'AVAILABLE'})
      RETURNING id, name, department_code as "departmentCode", designation, phone, status
    `);

    return NextResponse.json({ teacher: inserted.rows[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating teacher";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, departmentCode, designation, phone, status } = body;

    if (!id || !name || !departmentCode || !designation || !phone) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await db.execute(sql`
      UPDATE teachers
      SET name = ${name.trim()},
          department_code = ${departmentCode.trim().toUpperCase()},
          designation = ${designation.trim()},
          phone = ${phone.trim()},
          status = ${status || 'AVAILABLE'}
      WHERE id = ${id}
    `);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating teacher";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await db.execute(sql`UPDATE seating SET invigilator_id = NULL WHERE invigilator_id = ${parseInt(id)}`);
    await db.execute(sql`DELETE FROM invigilator_assignments WHERE teacher_id = ${parseInt(id)}`);
    await db.execute(sql`DELETE FROM teachers WHERE id = ${parseInt(id)}`);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting teacher";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
