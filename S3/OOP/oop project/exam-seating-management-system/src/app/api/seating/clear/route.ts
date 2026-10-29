import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const examId = searchParams.get("examId");
    if (!examId) return NextResponse.json({ error: "Exam ID required" }, { status: 400 });

    const id = parseInt(examId);

    await db.execute(sql`DELETE FROM seating WHERE exam_id = ${id}`);
    await db.execute(sql`DELETE FROM invigilator_assignments WHERE exam_id = ${id}`);

    return NextResponse.json({ success: true, message: "Seating arrangement deleted successfully for selected examination." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error clearing seating";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
