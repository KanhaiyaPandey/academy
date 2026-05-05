import { NextRequest, NextResponse } from "next/server";
import { db } from "@pahal/db/client";
import { employees } from "@pahal/db/schema";
import { desc, eq } from "drizzle-orm";
import { generateEmployeeId, successResponse, errorResponse } from "@pahal/lib/utils";

export async function GET() {
  try {
    const all = await db.select().from(employees).orderBy(desc(employees.createdAt));
    return NextResponse.json(successResponse(all));
  } catch {
    return NextResponse.json(errorResponse("Failed to fetch employees"), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const count = await db.select().from(employees);
    const employeeId = generateEmployeeId(count.length + 1);

    const [employee] = await db.insert(employees)
      .values({ ...body, employeeId })
      .returning();

    return NextResponse.json(successResponse(employee, "Employee created"), { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(errorResponse("Failed to create employee"), { status: 500 });
  }
}
