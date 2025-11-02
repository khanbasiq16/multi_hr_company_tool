import { db } from "@/lib/firebase";
import { admin } from "@/lib/firebaseAdmin";
import { doc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { employeeIds } = await req.json();

    if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "No employees selected for deletion" },
        { status: 400 }
      );
    }

    for (const empId of employeeIds) {
      try {
        await admin.auth().deleteUser(empId);

        await deleteDoc(doc(db, "employees", empId));

        console.log(`✅ Deleted employee with ID: ${empId}`);
      } catch (err) {
        console.error(`❌ Failed to delete ${empId}:`, err.message);
      }
    }

    // 3️⃣ Fetch updated employees list
    const snapshot = await getDocs(collection(db, "employees"));
    const employees = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      {
        success: true,
        message: "Selected employees deleted successfully",
        employees,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 Delete employee error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
