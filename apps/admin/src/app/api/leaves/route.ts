import { NextRequest, NextResponse } from "next/server";
import { db } from "@pahal/db/client";
import { leaves, employees } from "@pahal/db/schema";
import { desc, eq } from "drizzle-orm";
import { successResponse, errorResponse } from "@pahal/lib/utils";
import { sendWhatsAppMessage, whatsAppTemplates } from "@pahal/lib/notifications";
import { formatDate } from "@pahal/lib/utils";
import { getSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
    }

    const all = await db.query.leaves.findMany({
      orderBy: [desc(leaves.createdAt)],
      with: { employee: true, approvedBy: true },
      // Employees only see their own leaves
      where: session.role === "employee" && session.empId
        ? eq(leaves.employeeId, session.empId)
        : undefined,
    });

    return NextResponse.json(successResponse(all));
  } catch {
    return NextResponse.json(errorResponse("Failed to fetch leaves"), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
    }

    const body = await req.json();
    const { leaveType, fromDate, toDate, totalDays, reason } = body;

    // Employees can only submit for themselves
    const employeeId =
      session.role === "employee" ? session.empId! : Number(body.employeeId);

    const [leave] = await db
      .insert(leaves)
      .values({
        employeeId,
        leaveType,
        fromDate,
        toDate,
        totalDays: Number(totalDays),
        reason,
        status: "pending",
      })
      .returning();

    return NextResponse.json(successResponse(leave, "Leave application submitted"), { status: 201 });
  } catch {
    return NextResponse.json(errorResponse("Failed to apply leave"), { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = getSession(req);
    if (session?.role !== "admin") {
      return NextResponse.json(errorResponse("Forbidden"), { status: 403 });
    }

    const body = await req.json();
    const { id, action, approvedById, remarks } = body;

    const status = action === "approve" ? "approved" : "rejected";

    const [updated] = await db
      .update(leaves)
      .set({
        status: status as any,
        approvedById: approvedById ? Number(approvedById) : null,
        approvedAt: new Date(),
        remarks,
        updatedAt: new Date(),
      })
      .where(eq(leaves.id, Number(id)))
      .returning();

    const leaveWithEmployee = await db.query.leaves.findFirst({
      where: eq(leaves.id, Number(id)),
      with: { employee: true },
    });

    if (leaveWithEmployee?.employee?.phone) {
      const emp = leaveWithEmployee.employee;
      const msg =
        status === "approved"
          ? whatsAppTemplates.leaveApproved(
              `${emp.firstName} ${emp.lastName}`,
              formatDate(leaveWithEmployee.fromDate),
              formatDate(leaveWithEmployee.toDate)
            )
          : whatsAppTemplates.leaveRejected(
              `${emp.firstName} ${emp.lastName}`,
              remarks
            );
      await sendWhatsAppMessage(emp.phone, msg);
    }

    return NextResponse.json(successResponse(updated, `Leave ${status}`));
  } catch (err) {
    console.error(err);
    return NextResponse.json(errorResponse("Failed to process leave"), { status: 500 });
  }
}
