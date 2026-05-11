import { NextRequest, NextResponse } from "next/server";
import { db } from "@pahal/db/client";
import { attendance } from "@pahal/db/schema";
import { and, eq } from "drizzle-orm";
import { successResponse, errorResponse } from "@pahal/lib/utils";
import { withCache, invalidate, KEYS, TTL } from "@/lib/cache";

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

    await invalidate(KEYS.attendance(courseId));
    return NextResponse.json(successResponse(inserted, "Attendance saved"));
  } catch (err) {
    console.error(err);
    return NextResponse.json(errorResponse("Failed to save attendance"), { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    const data = await withCache(
      courseId ? KEYS.attendance(courseId) : "admin:attendance:all",
      TTL.attendance,
      () => db.query.attendance.findMany({
        with: { student: true },
        where: courseId ? eq(attendance.courseId, Number(courseId)) : undefined,
        orderBy: (a, { asc }) => [asc(a.date)],
      })
    );

    return NextResponse.json(successResponse(data));
  } catch {
    return NextResponse.json(errorResponse("Failed to fetch attendance"), { status: 500 });
  }
}
