import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { ensureSeed } from "@/db/seed";

export async function POST(req: Request) {
  try {
    await ensureSeed();
    const { username, password } = await req.json();
    const result = await db.execute(sql`
      SELECT id, username, role, full_name as "fullName", status
      FROM users
      WHERE username = ${username} AND password = ${password} AND status = 'ACTIVE'
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const user = result.rows[0];
    return NextResponse.json({ user });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
