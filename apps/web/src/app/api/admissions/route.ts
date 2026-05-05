import { NextRequest, NextResponse } from "next/server";
import { db } from "@pahal/db/client";
import { students, leads } from "@pahal/db/schema";
import { generateStudentId, successResponse, errorResponse } from "@pahal/lib/utils";
import { sendWhatsAppMessage, whatsAppTemplates, sendEmail, emailTemplates } from "@pahal/lib/notifications";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName, lastName, phone, whatsapp, email, gender,
      dateOfBirth, fatherName, motherName, parentPhone,
      address, city, state, pincode, qualification, courseId,
    } = body;

    if (!firstName || !lastName || !phone || !gender) {
      return NextResponse.json(errorResponse("Missing required fields"), { status: 400 });
    }

    // Generate student ID
    const studentCount = await db.select().from(students);
    const studentId = generateStudentId(studentCount.length + 1);
    const courseName = courseId || "Selected Course";

    const [student] = await db
      .insert(students)
      .values({
        studentId,
        firstName, lastName, phone,
        whatsapp: whatsapp || phone,
        email,
        gender: gender as any,
        dateOfBirth,
        fatherName, motherName, parentPhone,
        address, city, state, pincode,
        qualification,
        status: "active",
        admissionDate: new Date().toISOString().split("T")[0],
      })
      .returning();

    // Also capture as lead (converted)
    await db.insert(leads).values({
      name: `${firstName} ${lastName}`,
      phone,
      email,
      courseInterest: courseName,
      source: body.howDidYouHear || "website",
      status: "enrolled",
    }).onConflictDoNothing();

    // Send WhatsApp confirmation
    if (phone) {
      const msg = whatsAppTemplates.admissionConfirm(`${firstName} ${lastName}`, courseName, studentId);
      await sendWhatsAppMessage(phone, msg);
    }

    // Send email confirmation
    if (email) {
      const emailData = emailTemplates.admissionConfirm(`${firstName} ${lastName}`, courseName);
      await sendEmail({ to: email, ...emailData });
    }

    return NextResponse.json(
      successResponse({ studentId, studentDbId: student.id }, "Admission submitted successfully"),
      { status: 201 }
    );
  } catch (err) {
    console.error("Admission error:", err);
    return NextResponse.json(errorResponse("Failed to submit admission"), { status: 500 });
  }
}
