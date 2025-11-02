import { NextResponse } from "next/server";
import { admin } from "@/lib/firebaseAdmin"; // your firebase-admin config
import { db } from "@/lib/firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const { employeeId, status } = await req.json();

    if (!employeeId || !status) {
      return NextResponse.json(
        { success: false, message: "Employee ID and status are required" },
        { status: 400 }
      );
    }

    const disableAccount = status.toLowerCase() !== "active";

    await admin.auth().updateUser(employeeId, { disabled: disableAccount });

    const employeeRef = doc(db, "employees", employeeId);
    await updateDoc(employeeRef, { status });



       const snapshot = await getDocs(collection(db, "employees"));
            const employees = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
    

    return NextResponse.json({
      success: true,
      message: `Employee ${disableAccount ? "deactivated" : "activated"} successfully`,
      employees
    });
  } catch (error) {
    console.error("❌ Error updating employee status:", error);

    let errorMessage = "Server error occurred";
    if (error.code === "auth/user-not-found") {
      errorMessage = "Employee not found in Firebase Auth";
    }

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
