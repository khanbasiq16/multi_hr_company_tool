import { db } from "@/lib/firebase";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { employeeIds, status } = await req.json();

    if (!employeeIds?.length || !status)
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });

    const batch = adminDb.batch();

    for (const id of employeeIds) {
      const ref = adminDb.collection("employees").doc(id);
      batch.update(ref, { status });

      if (status === "deactivate") {
        await adminAuth.updateUser(id, { disabled: true });
      } else if (status === "active") {
        await adminAuth.updateUser(id, { disabled: false });
      }
    }

    await batch.commit();


    const snapshot = await getDocs(collection(db, "employees"));
        const employees = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

    return NextResponse.json({
      success: true,
      message: `Status updated to ${status} for ${employeeIds.length} employees.`,
      employees
    });
  } catch (error) {
    console.error("❌ Bulk update status error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
