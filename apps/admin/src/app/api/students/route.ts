import { NextRequest, NextResponse } from "next/server";
import { db } from "@pahal/db/client";
import { students, enrollments, fees, installments, courses } from "@pahal/db/schema";
import { desc, eq } from "drizzle-orm";
import { generateStudentId, generateReceiptNumber, successResponse, errorResponse } from "@pahal/lib/utils";

export async function GET() {
  try {
    const all = await db
      .select()
      .from(students)
      .orderBy(desc(students.createdAt));
    return NextResponse.json(successResponse(all));
  } catch (err) {
    console.error(err);
    return NextResponse.json(errorResponse("Failed to fetch students"), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { courseId, initialPayment, paymentMode, ...body } = await req.json();
    const count = await db.select().from(students);
    const studentId = generateStudentId(count.length + 1);

    const [student] = await db
      .insert(students)
      .values({ ...body, studentId })
      .returning();

    if (courseId) {
      const [enrollment] = await db
        .insert(enrollments)
        .values({
          studentId: student.id,
          courseId: Number(courseId),
          enrollmentDate: body.admissionDate,
        })
        .returning();

      const course = await db.query.courses.findFirst({ where: eq(courses.id, Number(courseId)) });
      const totalAmount = Number(course?.fees) || 0;
      const paidAmount = Number(initialPayment) || 0;
      const status = paidAmount >= totalAmount && totalAmount > 0 ? "paid" : paidAmount > 0 ? "partial" : "pending";

      const [feeRecord] = await db
        .insert(fees)
        .values({
          enrollmentId: enrollment.id,
          studentId: student.id,
          totalAmount: String(totalAmount),
          paidAmount: String(paidAmount),
          status: status as "paid" | "partial" | "pending",
        })
        .returning();

      if (paidAmount > 0) {
        await db.insert(installments).values({
          feeId: feeRecord.id,
          amount: String(paidAmount),
          paidAt: new Date(),
          receiptNumber: generateReceiptNumber(),
          paymentMode: paymentMode || "cash",
          notes: "Paid at admission",
        });
      }
    }

    return NextResponse.json(successResponse(student, "Student created"), { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(errorResponse("Failed to create student"), { status: 500 });
  }
}
