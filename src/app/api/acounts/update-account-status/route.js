import { NextResponse } from "next/server";
import { admin } from "@/lib/firebaseAdmin"; // your firebase-admin config
import { db } from "@/lib/firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const { accountId, status } = await req.json();

    if (!accountId || !status) {
      return NextResponse.json(
        { success: false, message: "Accountant User ID and status are required" },
        { status: 400 }
      );
    }

    const disableAccount = status.toLowerCase() !== "active";

    await admin.auth().updateUser(accountId, { disabled: disableAccount });


    const accountsRef = doc(db, "Accounts", accountId);
    await updateDoc(accountsRef, { status });



    const snapshot = await getDocs(collection(db, "Accounts"));
    const accounts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));


    return NextResponse.json({
      success: true,
      message: `Accountant User ${disableAccount ? "deactivated" : "activated"} successfully`,
      accounts
    });
  } catch (error) {
    console.error("❌ Error updating Accountant User status:", error);

    let errorMessage = "Server error occurred";
    if (error.code === "auth/user-not-found") {
      errorMessage = "Accountant User not found in Firebase Auth";
    }

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
