import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { ensureSeed } from "@/db/seed";

export async function GET() {
  try {
    await ensureSeed();
    const result = await db.execute(sql`
      SELECT id, template_name as "templateName", starting_room as "startingRoom",
             number_of_rooms as "numberOfRooms", rows_count as "rowsCount",
             columns_count as "columnsCount", building, floor_no as "floorNo"
      FROM room_templates
      ORDER BY template_name ASC
    `);
    return NextResponse.json({ templates: result.rows });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching room templates";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { templateName, startingRoom, numberOfRooms, rowsCount, columnsCount, building, floorNo } = body;

    if (!templateName || !startingRoom) {
      return NextResponse.json({ error: "Template name and starting room required" }, { status: 400 });
    }

    const inserted = await db.execute(sql`
      INSERT INTO room_templates(template_name, starting_room, number_of_rooms, rows_count, columns_count, building, floor_no)
      VALUES (${templateName.trim()}, ${startingRoom.trim()}, ${parseInt(numberOfRooms) || 10}, ${parseInt(rowsCount) || 5}, ${parseInt(columnsCount) || 6}, ${building || 'Main Block'}, ${parseInt(floorNo) || 1})
      RETURNING id, template_name as "templateName", starting_room as "startingRoom", number_of_rooms as "numberOfRooms", rows_count as "rowsCount", columns_count as "columnsCount", building, floor_no as "floorNo"
    `);

    return NextResponse.json({ template: inserted.rows[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error saving template";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await db.execute(sql`DELETE FROM room_templates WHERE id = ${parseInt(id)}`);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting template";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
