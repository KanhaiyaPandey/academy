import { NextRequest, NextResponse } from "next/server";
import { db } from "@pahal/db/client";
import { attendance } from "@pahal/db/schema";
import { and, eq } from "drizzle-orm";
import { successResponse, errorResponse } from "@pahal/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { date, courseId, records } = await req.json();
    // records: [{ studentId, status }]

    // Upsert attendance for the day
    const inserted = await Promise.all(
      records.map(async (r: { studentId: number; status: string }) => {
        const existing = await db.query.attendance.findFirst({
          where: and(
            eq(attendance.studentId, r.studentId),
            eq(attendance.date, date),
            eq(attendance.courseId, courseId)
          ),
        });

        if (existing) {
          return db.update(attendance)
            .set({ status: r.status as any })
            .where(eq(attendance.id, existing.id))
            .returning();
        } else {
          return db.insert(attendance)
            .values({ studentId: r.studentId, courseId, date, status: r.status as any })
            .returning();
        }
      })
    );

    return NextResponse.json(successResponse(inserted, "Attendance saved"));
  } catch (err) {
    console.error(err);
    return NextResponse.json(errorResponse("Failed to save attendance"), { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const courseId = searchParams.get("courseId");

    const where: Parameters<typeof db.query.attendance.findMany>[0] = {};

    const all = await db.query.attendance.findMany({
      with: { student: true, course: true },
      orderBy: (a, { desc }) => [desc(a.createdAt)],
    });

    return NextResponse.json(successResponse(all));
  } catch {
    return NextResponse.json(errorResponse("Failed to fetch attendance"), { status: 500 });
  }
}
