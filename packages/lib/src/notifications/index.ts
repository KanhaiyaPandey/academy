// ─── WhatsApp Notifications (Meta Cloud API) ──────────────────────────────────

export async function sendWhatsAppMessage(
  to: string,
  message: string
): Promise<boolean> {
  const apiKey = process.env.WHATSAPP_API_KEY;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!apiKey || !phoneNumberId) {
    console.warn("WhatsApp credentials not set. Skipping notification.");
    return false;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: `91${to}`,
          type: "text",
          text: { body: message },
        }),
      }
    );
    return response.ok;
  } catch (err) {
    console.error("WhatsApp notification error:", err);
    return false;
  }
}

export const whatsAppTemplates = {
  feeReminder: (studentName: string, amount: string, dueDate: string) =>
    `Dear ${studentName},\n\nThis is a friendly reminder that your fee of ₹${amount} is due on ${dueDate}.\n\nPlease contact Pahal Academy to clear your dues.\n\nRegards,\nPahal Academy Team`,

  leaveApproved: (employeeName: string, fromDate: string, toDate: string) =>
    `Dear ${employeeName},\n\nYour leave application from ${fromDate} to ${toDate} has been APPROVED.\n\nRegards,\nPahal Academy Management`,

  leaveRejected: (employeeName: string, reason?: string) =>
    `Dear ${employeeName},\n\nYour leave application has been REJECTED.${reason ? `\nReason: ${reason}` : ""}\n\nPlease contact HR for more details.\n\nRegards,\nPahal Academy Management`,

  admissionConfirm: (studentName: string, courseName: string, studentId: string) =>
    `Dear ${studentName},\n\n🎉 Welcome to Pahal Academy!\n\nYour admission to *${courseName}* has been confirmed.\nYour Student ID: *${studentId}*\n\nWe look forward to seeing you grow!\n\nRegards,\nPahal Academy Team`,
};

// ─── Email Notifications ──────────────────────────────────────────────────────

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  const apiKey = process.env.EMAIL_API_KEY;

  if (!apiKey) {
    console.warn("Email API key not set. Skipping email notification.");
    return false;
  }

  try {
    // Using Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "noreply@pahalacademy.com",
        to,
        subject,
        html,
      }),
    });
    return response.ok;
  } catch (err) {
    console.error("Email notification error:", err);
    return false;
  }
}

export const emailTemplates = {
  admissionConfirm: (studentName: string, courseName: string) => ({
    subject: `Admission Confirmed — ${courseName} | Pahal Academy`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1677ff; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0;">Pahal Academy</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Computer Learning & IT Courses</p>
        </div>
        <div style="padding: 32px; background: white;">
          <h2>Welcome, ${studentName}! 🎉</h2>
          <p>Your admission to <strong>${courseName}</strong> has been successfully confirmed.</p>
          <p>We're excited to have you as part of the Pahal Academy family. Our team will reach out to you shortly with batch details and schedule.</p>
          <div style="margin: 24px 0; padding: 16px; background: #f0f7ff; border-radius: 8px; border-left: 4px solid #1677ff;">
            <p style="margin: 0;"><strong>Course:</strong> ${courseName}</p>
            <p style="margin: 8px 0 0;"><strong>Academy:</strong> Pahal Academy</p>
          </div>
          <p>If you have any questions, feel free to contact us at <a href="tel:+91XXXXXXXXXX">+91-XXXXXXXXXX</a></p>
        </div>
        <div style="background: #f5f5f5; padding: 16px; text-align: center; color: #666; font-size: 12px;">
          <p>Pahal Academy — Shaping Tech Careers</p>
        </div>
      </div>
    `,
  }),
};
