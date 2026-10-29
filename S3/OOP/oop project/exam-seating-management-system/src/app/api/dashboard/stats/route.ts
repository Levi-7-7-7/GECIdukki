import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { ensureSeed } from "@/db/seed";

export async function GET() {
  try {
    await ensureSeed();

    const [students, depts, teachers, rooms, capacity, exams, seatingCount] = await Promise.all([
      db.execute(sql`SELECT count(*)::int as count FROM students WHERE status = 'ACTIVE'`),
      db.execute(sql`SELECT count(*)::int as count FROM departments WHERE status = 'ACTIVE'`),
      db.execute(sql`SELECT count(*)::int as count FROM teachers WHERE status = 'AVAILABLE'`),
      db.execute(sql`SELECT count(*)::int as count FROM rooms WHERE status = 'AVAILABLE'`),
      db.execute(sql`SELECT COALESCE(SUM(capacity), 0)::int as total FROM rooms WHERE status = 'AVAILABLE'`),
      db.execute(sql`SELECT count(*)::int as count FROM exams WHERE status = 'SCHEDULED'`),
      db.execute(sql`SELECT count(*)::int as count FROM seating`),
    ]);

    const upcomingExams = await db.execute(sql`
      SELECT id, exam_name as "name", exam_type as "type", to_char(exam_date, 'YYYY-MM-DD') as "date", 
             substring(start_time::text, 1, 5) as "time", duration_minutes as "duration", subject, status
      FROM exams
      ORDER BY exam_date ASC
      LIMIT 5
    `);

    return NextResponse.json({
      totalStudents: (students.rows[0] as { count: number })?.count || 0,
      totalDepartments: (depts.rows[0] as { count: number })?.count || 0,
      totalTeachers: (teachers.rows[0] as { count: number })?.count || 0,
      totalRooms: (rooms.rows[0] as { count: number })?.count || 0,
      totalCapacity: (capacity.rows[0] as { total: number })?.total || 0,
      upcomingExamsCount: (exams.rows[0] as { count: number })?.count || 0,
      totalSeatedStudents: (seatingCount.rows[0] as { count: number })?.count || 0,
      upcomingExams: upcomingExams.rows,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching dashboard stats";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
