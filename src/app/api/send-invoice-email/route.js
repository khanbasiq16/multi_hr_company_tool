import { sendEmail } from "@/lib/SendEmail";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";


export async function POST(req) {
  try {
    const { to, subject, message, invoiceLink, invoiceid , slug } = await req.json();

    if (!to || !subject || !invoiceid) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: to, subject, invoiceid" },
        { status: 400 }
      );
    }


      const q = query(
          collection(db, "companies"),
          where("companyslug", "==", slug) 
        );
    
        const querySnapshot = await getDocs(q);
    
        if (querySnapshot.empty) {
          return NextResponse.json(
            { success: false, error: "Company not found" },
            { status: 404 }
          );
        }
    
       
        const docSnap = querySnapshot.docs[0];
        const companyData = { id: docSnap.id, ...docSnap.data() };

        console.log(companyData)



       


    const html = `
      <div style="
  font-family: 'Segoe UI', Roboto, Arial, sans-serif;
  background-color: #f5f6fa;
  padding: 40px 0;
  display: flex;
  justify-content: center;
">
  <div style="
    background: #ffffff;
    border-radius: 12px;
    max-width: 650px;
    width: 100%;
    padding: 36px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.05);
    border: 1px solid #e5e8ec;
  ">

    <div style="text-align: center; margin-bottom: 28px;">
    
      <h2 style="
        color: #1f2937;
        font-size: 22px;
        margin: 0;
        font-weight: 700;
      ">
        Invoice Details
      </h2>
      <p style="color: #6b7280; font-size: 14px; margin-top: 6px;">
        Thank you for your continued trust.
      </p>
    </div>

    <div style="
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      padding: 18px 22px;
      border-radius: 10px;
      color: #374151;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 28px;
    ">
      ${message}
    </div>

    <div style="
      text-align: center;
      padding: 10px 0 25px;
      color: #111827;
    ">
      <h3 style="margin: 0; font-size: 19px; font-weight: 600;">
        Invoice Summary
      </h3>
      <p style="margin: 6px 0 0; font-size: 14px; color: #6b7280;">
        Issued securely by ${companyData?.name || "Our Company"}
      </p>
    </div>

    <div style="text-align: center; margin-bottom: 25px;">
      <a href="${invoiceLink}" style="
        color: #ffffff;
        background-color: #5965AB;
        text-decoration: none;
        padding: 13px 36px;
        border-radius: 8px;
        font-size: 15px;
        font-weight: 600;
        display: inline-block;
        box-shadow: 0 3px 8px rgba(79,70,229,0.15);
        transition: background 0.3s ease;
      " 
   >
        View Invoice
      </a>
    </div>

    <p style="
      font-size: 13px; 
      color: #6b7280; 
      line-height: 1.6; 
      text-align: center;
      margin-top: 15px;
    ">
      If the button doesn't work, copy and paste this link into your browser:
      <br>
      <a href="${invoiceLink}" style="color: #4f46e5; text-decoration: none;">
       Your Invoice Link
      </a>
    </p>

    <p style="
      text-align: center;
      color: #9ca3af;
      font-size: 12px;
      line-height: 1.5;
    ">
      © ${new Date().getFullYear()} ${companyData?.name || "Your Company"}. All rights reserved.<br>
      This is an automated message — please do not reply.
    </p>

  </div>
</div>
    `;

   let  EMAIL_HOST=companyData?.companyemailhost
 let EMAIL_PORT=companyData?.companysmtphost
let EMAIL_USER=companyData?.companyemail
let EMAIL_PASS=companyData?.companyemailpassword 

    const result = await sendEmail({ to, subject, html , EMAIL_HOST , EMAIL_PORT , EMAIL_USER , EMAIL_PASS });

    if (result.success) {
      const invoiceRef = doc(db, "invoices", invoiceid);
      const invoiceSnap = await getDoc(invoiceRef);

      if (!invoiceSnap.exists()) {
        return NextResponse.json(
          { success: false, message: "Invoice not found" },
          { status: 404 }
        );
      }

      await updateDoc(invoiceRef, { status: "Sent" });

      const updatedInvoiceSnap = await getDoc(invoiceRef);
      const updatedInvoice = { id: updatedInvoiceSnap.id, ...updatedInvoiceSnap.data() };

      return NextResponse.json({
        success: true,
        message: "Email sent successfully and invoice status updated.",
        invoice:updatedInvoice,
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
