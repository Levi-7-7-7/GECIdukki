import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { startingRoom, numberOfRooms, rowsCount, columnsCount, building, floorNo } = body;

    const start = parseInt(startingRoom);
    const count = parseInt(numberOfRooms);
    const rows = parseInt(rowsCount);
    const cols = parseInt(columnsCount);
    const floor = parseInt(floorNo || "1");

    if (isNaN(start) || isNaN(count) || count <= 0 || isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
      return NextResponse.json({ error: "Invalid numeric parameters" }, { status: 400 });
    }

    const capacity = rows * cols;

    // Check for existing room numbers
    const existing = await db.execute(sql`SELECT room_number as "roomNumber" FROM rooms`);
    const existingSet = new Set(existing.rows.map(r => (r as { roomNumber: string }).roomNumber));

    const generatedRooms = [];
    for (let i = 0; i < count; i++) {
      const roomNum = String(start + i);
      if (existingSet.has(roomNum)) {
        return NextResponse.json({ error: `Room ${roomNum} already exists in the database. Cannot create duplicates.` }, { status: 400 });
      }
      generatedRooms.push({
        roomNumber: roomNum,
        building: building || "Main Block",
        floorNo: floor,
        rowsCount: rows,
        columnsCount: cols,
        capacity,
        status: "AVAILABLE",
      });
    }

    // Insert all generated rooms
    for (const r of generatedRooms) {
      await db.execute(sql`
        INSERT INTO rooms(room_number, building, floor_no, rows_count, columns_count, capacity, status)
        VALUES (${r.roomNumber}, ${r.building}, ${r.floorNo}, ${r.rowsCount}, ${r.columnsCount}, ${r.capacity}, ${r.status})
      `);
    }

    return NextResponse.json({
      success: true,
      createdCount: generatedRooms.length,
      rooms: generatedRooms,
      totalCapacity: count * capacity,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating bulk rooms";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
