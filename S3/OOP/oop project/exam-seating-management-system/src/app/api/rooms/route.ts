import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { ensureSeed } from "@/db/seed";

export async function GET() {
  try {
    await ensureSeed();
    const result = await db.execute(sql`
      SELECT id, room_number as "roomNumber", building, floor_no as "floorNo",
             rows_count as "rowsCount", columns_count as "columnsCount",
             capacity, status
      FROM rooms
      ORDER BY room_number ASC
    `);
    return NextResponse.json({ rooms: result.rows });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching rooms";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { roomNumber, building, floorNo, rowsCount, columnsCount, status } = body;

    const rows = parseInt(rowsCount);
    const cols = parseInt(columnsCount);
    const floor = parseInt(floorNo || "1");

    if (!roomNumber || !building || isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
      return NextResponse.json({ error: "Valid room number, building, rows (>0) and columns (>0) required" }, { status: 400 });
    }

    const existing = await db.execute(sql`SELECT id FROM rooms WHERE room_number = ${roomNumber.trim()}`);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: `Room ${roomNumber.trim()} already exists` }, { status: 400 });
    }

    const capacity = rows * cols;

    const inserted = await db.execute(sql`
      INSERT INTO rooms(room_number, building, floor_no, rows_count, columns_count, capacity, status)
      VALUES (${roomNumber.trim()}, ${building.trim()}, ${floor}, ${rows}, ${cols}, ${capacity}, ${status || 'AVAILABLE'})
      RETURNING id, room_number as "roomNumber", building, floor_no as "floorNo", rows_count as "rowsCount", columns_count as "columnsCount", capacity, status
    `);

    return NextResponse.json({ room: inserted.rows[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating room";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, roomNumber, building, floorNo, rowsCount, columnsCount, status } = body;

    const rows = parseInt(rowsCount);
    const cols = parseInt(columnsCount);
    const floor = parseInt(floorNo || "1");

    if (!id || !roomNumber || !building || isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
      return NextResponse.json({ error: "All fields required with valid numbers" }, { status: 400 });
    }

    const existing = await db.execute(sql`SELECT id FROM rooms WHERE room_number = ${roomNumber.trim()} AND id != ${id}`);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: `Room number ${roomNumber.trim()} is used by another room` }, { status: 400 });
    }

    const capacity = rows * cols;

    await db.execute(sql`
      UPDATE rooms
      SET room_number = ${roomNumber.trim()},
          building = ${building.trim()},
          floor_no = ${floor},
          rows_count = ${rows},
          columns_count = ${cols},
          capacity = ${capacity},
          status = ${status || 'AVAILABLE'}
      WHERE id = ${id}
    `);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating room";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await db.execute(sql`DELETE FROM seating WHERE room_id = ${parseInt(id)}`);
    await db.execute(sql`DELETE FROM invigilator_assignments WHERE room_id = ${parseInt(id)}`);
    await db.execute(sql`DELETE FROM rooms WHERE id = ${parseInt(id)}`);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting room";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
