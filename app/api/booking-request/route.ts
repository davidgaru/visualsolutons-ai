import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, preferredDate, preferredTime } = body;

    if (!name || !email || !preferredDate || !preferredTime) {
      return NextResponse.json(
        { ok: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    const bookingPayload = {
      ...body,
      createdAt: new Date().toISOString()
    };

    // Placeholder for integration:
    // - Send email notification (Resend/SMTP)
    // - Create calendar event (Google Calendar/Cal.com)
    // - Save request to DB/CRM
    console.log("Booking request:", bookingPayload);

    return NextResponse.json({ ok: true, message: "Booking request received." });
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request payload." }, { status: 400 });
  }
}
