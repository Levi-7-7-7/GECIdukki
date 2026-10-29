import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { ensureSeed } from "@/db/seed";

export async function GET() {
  try {
    await ensureSeed();
    const result = await db.execute(sql`
      SELECT id, code, name, status FROM departments ORDER BY code ASC
    `);
    return NextResponse.json({ departments: result.rows });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching departments";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, name, status } = body;
    if (!code || !name) return NextResponse.json({ error: "Code and Name required" }, { status: 400 });

    const existing = await db.execute(sql`SELECT id FROM departments WHERE code = ${code.trim().toUpperCase()}`);
    if (existing.rows.length > 0) return NextResponse.json({ error: "Department code already exists" }, { status: 400 });

    const inserted = await db.execute(sql`
      INSERT INTO departments(code, name, status) VALUES (${code.trim().toUpperCase()}, ${name.trim()}, ${status || 'ACTIVE'})
      RETURNING id, code, name, status
    `);
    return NextResponse.json({ department: inserted.rows[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating department";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, code, name, status } = body;
    if (!id || !code || !name) return NextResponse.json({ error: "ID, Code, and Name required" }, { status: 400 });

    const existing = await db.execute(sql`SELECT id FROM departments WHERE code = ${code.trim().toUpperCase()} AND id != ${id}`);
    if (existing.rows.length > 0) return NextResponse.json({ error: "Department code already in use" }, { status: 400 });

    await db.execute(sql`
      UPDATE departments SET code = ${code.trim().toUpperCase()}, name = ${name.trim()}, status = ${status || 'ACTIVE'}
      WHERE id = ${id}
    `);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating department";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await db.execute(sql`DELETE FROM departments WHERE id = ${parseInt(id)}`);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting department";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
