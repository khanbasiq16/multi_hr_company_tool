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
    font-family: Arial, sans-serif; 
    background-color: #f9f9f9; 
    padding: 20px; 
    border-radius: 10px; 
    max-width: 600px; cl
    margin: auto; 
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  ">
    <p style="
      font-size: 16px; 
      color: #333; 
      line-height: 1.5;
    ">
      ${message}
    </p>
    <p style="
      font-size: 16px; 
      color: #333; 
      line-height: 1.5;
    ">
      You can view your invoice here: 
      <a href="${invoiceLink}" style="
        color: #ffffff; 
        background-color: #0070f3; 
        text-decoration: none; 
        padding: 8px 15px; 
        border-radius: 5px; 
        display: inline-block;
      ">
        View Invoice
      </a>
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
