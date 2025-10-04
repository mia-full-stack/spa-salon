import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { emails } = await request.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailPromises = emails.map((email: any) =>
      transporter.sendMail({
        from: `"Luxury Spa Salon" <${process.env.EMAIL_USER}>`,
        to: email.to,
        subject: email.subject,
        html: email.html,
      })
    );

    await Promise.all(emailPromises);

    return NextResponse.json({
      success: true,
      message: "Email notifications sent successfully",
    });
  } catch (error) {
    console.error(" Error sending emails:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send emails",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
