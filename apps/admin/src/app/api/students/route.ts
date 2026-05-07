import { NextRequest, NextResponse } from "next/server";
import { db } from "@pahal/db/client";
import { students, enrollments } from "@pahal/db/schema";
import { desc } from "drizzle-orm";
import { generateStudentId, successResponse, errorResponse } from "@pahal/lib/utils";

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
    const { courseId, ...body } = await req.json();
    const count = await db.select().from(students);
    const studentId = generateStudentId(count.length + 1);

    const [student] = await db
      .insert(students)
      .values({ ...body, studentId })
      .returning();

    if (courseId) {
      await db.insert(enrollments).values({
        studentId: student.id,
        courseId: Number(courseId),
        enrollmentDate: body.admissionDate,
      });
    }

    return NextResponse.json(successResponse(student, "Student created"), { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(errorResponse("Failed to create student"), { status: 500 });
  }
}
