import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { customerName, customerEmail, orderId, totalAmount } = await request.json();

    const data = await resend.emails.send({
      from: 'GOBAAZAAR <onboarding@resend.dev>', // Resend gives you this free testing email!
      to: [customerEmail],
      subject: `Order Confirmed: ${orderId} - GOBAAZAAR`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; background-color: #09090b; color: #f4f4f5; padding: 40px; border-radius: 16px;">
          <h1 style="color: #3b82f6; text-transform: uppercase; letter-spacing: 2px;">Asset Acquisition Confirmed</h1>
          <p style="font-size: 16px;">Hello ${customerName},</p>
          <p style="font-size: 16px;">Your order <strong>${orderId}</strong> has been securely logged into our network.</p>
          
          <div style="background-color: #18181b; padding: 20px; border-radius: 8px; margin: 24px 0;">
            <p style="margin: 0; font-size: 12px; text-transform: uppercase; color: #a1a1aa;">Total Value</p>
            <p style="margin: 0; font-size: 24px; font-weight: bold;">Rs. ${totalAmount.toLocaleString()}</p>
          </div>

          <p style="color: #a1a1aa; font-size: 14px;">Our dispatch node will notify you once your premium assets are in transit.</p>
          <p style="font-size: 12px; color: #71717a; margin-top: 40px;">GOBAAZAAR | Smart Shopping</p>
        </div>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}