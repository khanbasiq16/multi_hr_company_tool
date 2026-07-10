import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const companiesSnap = await adminDb.collection("companies").get();
    const companies = companiesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Identify the calling user from the JWT cookie
    let hiddenCompanies = [];
    try {
      const cookieStore = cookies();
      const token = cookieStore.get("token")?.value;
      if (token) {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // Only admin (non-superAdmin) users can have hidden companies
        if (payload.role === "admin" && payload.id) {
          const userSnap = await adminDb.collection("users").doc(payload.id).get();
          hiddenCompanies = userSnap.data()?.hiddenCompanies || [];
        }
      }
    } catch {
      // Invalid/missing token — return all companies (middleware already guards routes)
    }

    const visible = hiddenCompanies.length > 0
      ? companies.filter((c) => !hiddenCompanies.includes(c.id))
      : companies;

    return NextResponse.json({ success: true, companies: visible }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch companies", error: error.message },
      { status: 500 }
    );
  }
}
