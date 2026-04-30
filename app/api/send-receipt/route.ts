import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Initialize with a fallback string to prevent the "Missing API key" build crash
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(req: Request) {
  // Extra safety check: stop if key is actually missing when someone tries to send an email
  if (!process.env.RESEND_API_KEY) {
    console.error("CRITICAL: RESEND_API_KEY is not defined in environment variables.");
    return NextResponse.json({ error: 'Mail server configuration missing' }, { status: 500 });
  }

  try {
    const { customerName, customerEmail, orderId, totalAmount } = await req.json();

    const data = await resend.emails.send({
      from: 'CART IO <onboarding@resend.dev>', // Update this once you verify your domain!
      to: customerEmail,
      subject: `Order Confirmed: ${orderId}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h1 style="text-transform: uppercase; letter-spacing: 2px;">Order Confirmed</h1>
          <p>Hello ${customerName},</p>
          <p>Your order <strong>${orderId}</strong> for <strong>Rs. ${totalAmount.toLocaleString()}</strong> has been received and is being processed.</p>
          <p>Thank you for choosing <strong>CART IO</strong> for ultimate luxury.</p>
          <hr />
          <p style="font-size: 10px; color: #666;">© ${new Date().getFullYear()} CART IO. All rights reserved.</p>
        </div>
      `
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}