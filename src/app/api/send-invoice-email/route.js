import { sendEmail } from "@/lib/SendEmail";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { to , subject , message , invoiceLink } = await req.json();

    // ✅ Required Fields Check
    if (!to || !subject ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: to, subject, html" },
        { status: 400 }
      );
    }




   const html = `
    <div style="
  font-family: 'Segoe UI', Arial, sans-serif;
  background: #5965AB;
  padding: 30px;
  border-radius: 16px;
  max-width: 650px;
  margin: auto;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  border: 1px solid #e6e6e6;
">
  

  <p style="
    font-size: 16px; 
    color: #444; 
    line-height: 1.7; 
    margin: 0 0 20px 0;
  ">
    ${message}
  </p>

  <div style="text-align: center;">
    <a href="${invoiceLink}" style="
      color: #fff; 
      background: linear-gradient(90deg, #5965AB, #60B89E);
      text-decoration: none; 
      padding: 12px 28px; 
      border-radius: 50px; 
      font-size: 16px;
      font-weight: 500;
      display: inline-block;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    ">
      View Invoice
    </a>
  </div>

  <p style="
    font-size: 13px; 
    color: #777; 
    line-height: 1.4; 
    text-align: center; 
    margin-top: 25px;
  ">
    If the button doesn't work, copy & paste this link into your browser:<br>
    <span style="color: #0070f3;">${invoiceLink}</span>
  </p>
</div>
`;


    const result = await sendEmail({ to:to, subject, html });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Email sent successfully",
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
