import { NextRequest, NextResponse } from "next/server";
import { db } from "@pahal/db/client";
import { fees, installments } from "@pahal/db/schema";
import { desc, eq } from "drizzle-orm";
import { generateReceiptNumber, successResponse, errorResponse } from "@pahal/lib/utils";
import { sendWhatsAppMessage, whatsAppTemplates } from "@pahal/lib/notifications";

export async function GET() {
  try {
    const all = await db.query.fees.findMany({
      orderBy: [desc(fees.createdAt)],
      with: {
        student: true,
        installments: { orderBy: [desc(installments.createdAt)] },
      },
    });
    return NextResponse.json(successResponse(all));
  } catch {
    return NextResponse.json(errorResponse("Failed to fetch fees"), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { feeId, amount, paymentMode, transactionId, notes, studentPhone, studentName } = body;

    const receiptNumber = generateReceiptNumber();

    const [installment] = await db
      .insert(installments)
      .values({
        feeId: Number(feeId),
        amount: String(amount),
        paidAt: new Date(),
        receiptNumber,
        paymentMode,
        transactionId,
        notes,
      })
      .returning();

    // Update fee paid amount
    const feeRecord = await db.query.fees.findFirst({ where: eq(fees.id, Number(feeId)) });
    if (feeRecord) {
      const newPaid = Number(feeRecord.paidAmount) + Number(amount);
      const newStatus = newPaid >= Number(feeRecord.totalAmount) ? "paid" : "partial";
      await db.update(fees).set({
        paidAmount: String(newPaid),
        status: newStatus as any,
        updatedAt: new Date(),
      }).where(eq(fees.id, Number(feeId)));
    }

    // WhatsApp receipt
    if (studentPhone && studentName) {
      await sendWhatsAppMessage(
        studentPhone,
        `Dear ${studentName},\n\nPayment of ₹${amount} received successfully.\nReceipt No: ${receiptNumber}\nMode: ${paymentMode}\n\nThank you!\nPahal Academy`
      );
    }

    return NextResponse.json(successResponse({ installment, receiptNumber }, "Payment recorded"), { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(errorResponse("Failed to record payment"), { status: 500 });
  }
}
