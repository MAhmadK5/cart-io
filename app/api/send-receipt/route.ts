import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, name, orderId, items, total, shippingAddress } = await request.json();

    // 1. Configure the Gmail Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // 2. Create the HTML for the cart items
    const itemsHtml = items.map((item: any) => `
      <tr>
        <td style="padding: 15px 0; border-bottom: 1px solid #27272a; color: #e4e4e7;">
          ${item.name} <br/>
          <span style="font-size: 10px; color: #a1a1aa; text-transform: uppercase;">Qty: ${item.quantity}</span>
        </td>
        <td style="padding: 15px 0; border-bottom: 1px solid #27272a; color: #e4e4e7; text-align: right;">
          Rs. ${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>
    `).join('');

    // 3. The Luxury CARTIO HTML Template
    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; padding: 40px 20px; color: #ffffff;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #09090b; text-align: center;">
          
          <h1 style="font-size: 28px; font-weight: 900; letter-spacing: 6px; margin: 0; text-transform: uppercase; color: #ffffff;">CARTIO</h1>
          <p style="font-size: 10px; font-weight: bold; letter-spacing: 2px; color: #a1a1aa; text-transform: uppercase; margin-top: 5px;">Exclusive Asset Secured</p>
          
          <div style="height: 1px; background-color: #27272a; margin: 40px 0;"></div>

          <p style="font-size: 16px; font-weight: 300; text-align: left; color: #e4e4e7;">Dear ${name},</p>
          <p style="font-size: 14px; font-weight: 300; text-align: left; line-height: 1.6; color: #a1a1aa;">
            Your order has been successfully encrypted and logged into our ledger. Our logistics team is now preparing your premium assets for priority dispatch.
          </p>

          <div style="background-color: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 30px; margin: 40px 0; text-align: left;">
            <p style="font-size: 10px; font-weight: bold; letter-spacing: 2px; color: #a1a1aa; text-transform: uppercase; margin: 0 0 20px 0;">Order Reference: ${orderId}</p>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              ${itemsHtml}
            </table>

            <div style="display: flex; justify-content: space-between; margin-top: 20px; padding-top: 10px; font-size: 18px; font-weight: 900; color: #ffffff;">
              <span>TOTAL (COD)</span>
              <span style="color: #c084fc;">Rs. ${total.toLocaleString()}</span>
            </div>
          </div>

          <div style="text-align: left; margin-bottom: 40px;">
            <p style="font-size: 10px; font-weight: bold; letter-spacing: 2px; color: #a1a1aa; text-transform: uppercase; margin-bottom: 5px;">Dispatch Destination</p>
            <p style="font-size: 13px; color: #e4e4e7; line-height: 1.5; margin: 0;">
              ${shippingAddress}
            </p>
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

    // 4. Send the email
    const mailOptions = {
      from: `"CARTIO Orders" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Order Secured: ${orderId} - CARTIO`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Nodemailer Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}