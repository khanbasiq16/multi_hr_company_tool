import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

/**
 * GET /api/admin/company-access?uid=<adminUid>
 * Returns the admin's current hiddenCompanies array + all companies.
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");
    if (!uid) return NextResponse.json({ success: false, error: "uid required" }, { status: 400 });

    const [userSnap, companiesSnap] = await Promise.all([
      adminDb.collection("users").doc(uid).get(),
      adminDb.collection("companies").get(),
    ]);

    const hiddenCompanies = userSnap.data()?.hiddenCompanies || [];
    const companies = companiesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return NextResponse.json({ success: true, hiddenCompanies, companies });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/company-access
 * Body: { uid: string, hiddenCompanies: string[] }
 * Updates which companies are hidden from a specific admin.
 */
export async function PATCH(req) {
  try {
    const { uid, hiddenCompanies } = await req.json();
    if (!uid) return NextResponse.json({ success: false, error: "uid required" }, { status: 400 });

    await adminDb.collection("users").doc(uid).update({
      hiddenCompanies: hiddenCompanies || [],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
