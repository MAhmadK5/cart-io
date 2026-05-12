import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, name, orderId, status, trackingNumber } = await request.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Determine the exact message based on the status
    let statusMessage = "";
    let statusColor = "#c084fc"; // Purple default
    let subjectLine = `Order Update: ${orderId} - CARTIO`;

    switch (status) {
      case 'Processing':
        statusMessage = `Your order is currently being prepared and verified by our logistics team. We will notify you the moment it dispatches.`;
        break;
      case 'Dispatched':
        statusMessage = `Great news! Your assets have been successfully dispatched and handed over to <strong>M&P Courier</strong>.`;
        // ✨ NEW: INJECT M&P TRACKING DATA IF AVAILABLE ✨
        if (trackingNumber) {
          statusMessage += `
            <br/><br/>
            <span style="font-size: 11px; color: #71717a; text-transform: uppercase; letter-spacing: 2px;">M&P Tracking Number</span><br/>
            <span style="font-family: monospace; font-size: 18px; font-weight: bold; color: #fff; display: inline-block; margin-top: 4px;">${trackingNumber}</span>
            <br/><br/>
            <a href="https://mulphilog.com/tracking/" target="_blank" style="display: inline-block; background-color: #F4AA41; color: #000; padding: 12px 24px; font-size: 11px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; border-radius: 4px; margin-top: 10px;">
              Track on M&P Website &rarr;
            </a>
          `;
        }
        statusColor = "#3b82f6"; // Blue
        subjectLine = `Order Dispatched! 📦 ${orderId} - CARTIO`;
        break;
      case 'Delivered':
        statusMessage = `Your order has been marked as delivered. We hope you love your new premium assets! We would highly appreciate it if you left a review on our platform.`;
        statusColor = "#ffffff"; // White
        subjectLine = `Order Delivered! 🎉 ${orderId} - CARTIO`;
        break;
      case 'Cancelled':
        statusMessage = `Your order has been officially cancelled. If you have any questions or would like to place a new request, our concierge desk is open 24/7.`;
        statusColor = "#ef4444"; // Red
        subjectLine = `Order Cancelled: ${orderId} - CARTIO`;
        break;
      default:
        statusMessage = `There has been an update to your order status. It is now marked as: ${status}.`;
    }

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; padding: 40px 20px; color: #ffffff;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #09090b; text-align: center;">
          
          <h1 style="font-size: 28px; font-weight: 900; letter-spacing: 6px; margin: 0; text-transform: uppercase; color: #ffffff;">CARTIO</h1>
          <p style="font-size: 10px; font-weight: bold; letter-spacing: 2px; color: ${statusColor}; text-transform: uppercase; margin-top: 5px;">Order Status: ${status}</p>
          
          <div style="height: 1px; background-color: #27272a; margin: 40px 0;"></div>

          <p style="font-size: 16px; font-weight: 300; text-align: left; color: #e4e4e7;">Dear ${name},</p>
          <div style="font-size: 14px; font-weight: 300; text-align: left; line-height: 1.6; color: #a1a1aa;">
            ${statusMessage}
          </div>

          <div style="background-color: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 30px; margin: 40px 0; text-align: center;">
            <p style="font-size: 10px; font-weight: bold; letter-spacing: 2px; color: #a1a1aa; text-transform: uppercase; margin: 0 0 10px 0;">Order Reference</p>
            <p style="font-size: 24px; font-weight: 900; color: #ffffff; margin: 0;">${orderId}</p>
          </div>

          <div style="height: 1px; background-color: #27272a; margin: 40px 0;"></div>

          <p style="font-size: 12px; color: #71717a; line-height: 1.5;">
            Need assistance? Our concierge desk is available 24/7. Reply directly to this email or reach out to <a href="mailto:${process.env.GMAIL_USER}" style="color: #c084fc; text-decoration: none;">${process.env.GMAIL_USER}</a>.
          </p>
          <p style="font-size: 10px; color: #52525b; letter-spacing: 1px; text-transform: uppercase; margin-top: 30px;">
            © ${new Date().getFullYear()} CARTIO. All rights reserved.
          </p>

        </div>
      </div>
    `;

    const mailOptions = {
      from: `"CARTIO Dispatch" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: subjectLine,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Status Update Email Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}