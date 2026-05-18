import { NextRequest, NextResponse } from "next/server";
import { db } from "@pahal/db/client";
import { employeeAttendance } from "@pahal/db/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import { successResponse, errorResponse } from "@pahal/lib/utils";
import { withCache, invalidate, KEYS, TTL } from "@/lib/cache";

export async function POST(req: NextRequest) {
  try {
    const { date, records } = await req.json();
    // records: [{ employeeId, status, notes? }]

    const inserted = await Promise.all(
      records.map(async (r: { employeeId: number; status: string; notes?: string }) => {
        const existing = await db.query.employeeAttendance.findFirst({
          where: and(
            eq(employeeAttendance.employeeId, r.employeeId),
            eq(employeeAttendance.date, date)
          ),
        });

        if (existing) {
          return db.update(employeeAttendance)
            .set({ status: r.status as any, notes: r.notes ?? null })
            .where(eq(employeeAttendance.id, existing.id))
            .returning();
        } else {
          return db.insert(employeeAttendance)
            .values({ employeeId: r.employeeId, date, status: r.status as any, notes: r.notes ?? null })
            .returning();
        }
      })
    );

    // Invalidate the month cache for this date
    const month = date.slice(0, 7); // "YYYY-MM"
    await invalidate(KEYS.empAttendance(month));

    return NextResponse.json(successResponse(inserted, "Employee attendance saved"));
  } catch (err) {
    console.error(err);
    return NextResponse.json(errorResponse("Failed to save employee attendance"), { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month"); // "YYYY-MM"
    const date  = searchParams.get("date");  // "YYYY-MM-DD"

    if (date) {
      const data = await db.query.employeeAttendance.findMany({
        with: { employee: true },
        where: eq(employeeAttendance.date, date),
      });
      return NextResponse.json(successResponse(data));
    }

    const key = month ? KEYS.empAttendance(month) : "admin:emp-attendance:all";

    const data = await withCache(key, TTL.empAttendance, () => {
      if (month) {
        const from = `${month}-01`;
        // last day: bump month, subtract one day
        const [y, m] = month.split("-").map(Number);
        const lastDay = new Date(y, m, 0).getDate();
        const to = `${month}-${String(lastDay).padStart(2, "0")}`;
        return db.query.employeeAttendance.findMany({
          with: { employee: true },
          where: and(
            gte(employeeAttendance.date, from),
            lte(employeeAttendance.date, to)
          ),
          orderBy: (a, { asc }) => [asc(a.date)],
        });
      }
      return db.query.employeeAttendance.findMany({
        with: { employee: true },
        orderBy: (a, { asc }) => [asc(a.date)],
      });
    });

    return NextResponse.json(successResponse(data));
  } catch {
    return NextResponse.json(errorResponse("Failed to fetch employee attendance"), { status: 500 });
  }
}
