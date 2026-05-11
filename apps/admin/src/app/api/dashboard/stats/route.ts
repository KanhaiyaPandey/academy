import { NextResponse } from "next/server";
import { db } from "@pahal/db/client";
import { students, fees, leads, courses } from "@pahal/db/schema";
import { eq, sum, count } from "drizzle-orm";
import { successResponse, errorResponse } from "@pahal/lib/utils";
import { withCache, KEYS, TTL } from "@/lib/cache";

export async function GET() {
  try {
    const data = await withCache(KEYS.stats, TTL.stats, async () => {
      const [totalStudents, activeStudents, totalCourses, newLeads, feeStats] =
        await Promise.all([
          db.select({ count: count() }).from(students),
          db.select({ count: count() }).from(students).where(eq(students.status, "active")),
          db.select({ count: count() }).from(courses).where(eq(courses.isActive, true)),
          db.select({ count: count() }).from(leads).where(eq(leads.status, "new")),
          db.select({ totalCollected: sum(fees.paidAmount), totalPending: sum(fees.totalAmount) }).from(fees),
        ]);

      const totalCollected = Number(feeStats[0]?.totalCollected || 0);
      const totalBilled    = Number(feeStats[0]?.totalPending  || 0);

      return {
        totalStudents:  totalStudents[0]?.count  || 0,
        activeStudents: activeStudents[0]?.count || 0,
        totalCourses:   totalCourses[0]?.count   || 0,
        newLeads:       newLeads[0]?.count       || 0,
        totalRevenue:   totalCollected,
        pendingFees:    totalBilled - totalCollected,
      };
    });

    return NextResponse.json(successResponse(data));
  } catch (err) {
    console.error(err);
    return NextResponse.json(errorResponse("Failed to fetch stats"), { status: 500 });
  }
}
