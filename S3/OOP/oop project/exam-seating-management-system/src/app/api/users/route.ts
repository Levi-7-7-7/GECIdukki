import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { ensureSeed } from "@/db/seed";

export async function GET() {
  try {
    await ensureSeed();
    const result = await db.execute(sql`
      SELECT id, username, role, full_name as "fullName", status
      FROM users
      ORDER BY username ASC
    `);
    return NextResponse.json({ users: result.rows });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching users";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password, role, fullName, status } = body;

    if (!username || !password || !role || !fullName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existing = await db.execute(sql`SELECT id FROM users WHERE username = ${username.trim()}`);
    if (existing.rows.length > 0) return NextResponse.json({ error: "Username already exists" }, { status: 400 });

    const inserted = await db.execute(sql`
      INSERT INTO users(username, password, role, full_name, status)
      VALUES (${username.trim()}, ${password.trim()}, ${role}, ${fullName.trim()}, ${status || 'ACTIVE'})
      RETURNING id, username, role, full_name as "fullName", status
    `);
    return NextResponse.json({ user: inserted.rows[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, username, password, role, fullName, status } = body;

    if (!id || !username || !role || !fullName) {
      return NextResponse.json({ error: "ID, username, role, and fullName are required" }, { status: 400 });
    }

    if (password && password.trim().length > 0) {
      await db.execute(sql`
        UPDATE users
        SET username = ${username.trim()},
            password = ${password.trim()},
            role = ${role},
            full_name = ${fullName.trim()},
            status = ${status || 'ACTIVE'}
        WHERE id = ${id}
      `);
    } else {
      await db.execute(sql`
        UPDATE users
        SET username = ${username.trim()},
            role = ${role},
            full_name = ${fullName.trim()},
            status = ${status || 'ACTIVE'}
        WHERE id = ${id}
      `);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await db.execute(sql`DELETE FROM users WHERE id = ${parseInt(id)}`);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
