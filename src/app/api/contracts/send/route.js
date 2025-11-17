import { db } from "@/lib/firebase";
import { sendEmail } from "@/lib/SendEmail";
import {
  doc,
  updateDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { clientId, contractid, companyslug } = body;

    if (!clientId || !contractid || !companyslug) {
      return NextResponse.json(
        { success: false, message: "Required fields missing" },
        { status: 400 }
      );
    }

    const contractRef = doc(db, "contracts", contractid);
    const contractSnap = await getDoc(contractRef);

    if (!contractSnap.exists()) {
      return NextResponse.json(
        { success: false, message: "Contract not found" },
        { status: 404 }
      );
    }

    const contractData = contractSnap.data();

    const clientRef = doc(db, "clients", clientId);
    const clientSnap = await getDoc(clientRef);

    if (!clientSnap.exists()) {
      return NextResponse.json(
        { success: false, message: "Client not found" },
        { status: 404 }
      );
    }

    const clientData = clientSnap.data();

    const q = query(
      collection(db, "companies"),
      where("companyslug", "==", companyslug)
    );

    const companySnap = await getDocs(q);

    if (companySnap.empty) {
      return NextResponse.json(
        { success: false, message: "Company not found" },
        { status: 404 }
      );
    }

    const companyData = companySnap.docs[0].data();

    let htmlTemplate = `
    <div style="max-width:600px;margin:40px auto;background-color:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#333;">
  <div style="background:linear-gradient(90deg,#4f46e5,#3b82f6);padding:30px;text-align:center;color:#fff;">
    <h1 style="margin:0;font-size:24px;">Welcome to ${companyData?.name}!</h1>
  </div>
  <div style="padding:30px;font-size:16px;line-height:1.6;">
    <p>Hi ${clientData?.clientName || "there"},</p>
    <p>We are excited to have you onboard. Please review your contract using the link below:</p>
    <a href="${contractData?.contractURL}" target="_blank" style="display:inline-block;padding:12px 24px;margin-top:20px;background-color:#4f46e5;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;">View Your Contract</a>
    <p>If you have any questions, feel free to reply to this email.</p>
    <p>Best Regards,<br />${companyData?.name} Team</p>
  </div>
  <div style="background-color:#f4f6f8;text-align:center;padding:20px;font-size:12px;color:#888;">
    &copy; ${new Date().getFullYear()} ${
      companyData?.name
    }. All rights reserved.
  </div>
</div>
    `;

    let EMAIL_HOST = companyData?.companyemailhost;
    let EMAIL_PORT = companyData?.companysmtphost;
    let EMAIL_USER = companyData?.companyemail;
    let EMAIL_PASS = companyData?.companyemailpassword;

    await sendEmail({
      to: clientData?.clientEmail,
      subject: `Welcome to ${companyData.name}!`,
      html: htmlTemplate,
      EMAIL_HOST: EMAIL_HOST,
      EMAIL_PORT: EMAIL_PORT,
      EMAIL_USER: EMAIL_USER,
      EMAIL_PASS: EMAIL_PASS,
    });

    return NextResponse.json({
      success: true,
      contract: contractData,
      client: clientData,
      company: companyData,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
