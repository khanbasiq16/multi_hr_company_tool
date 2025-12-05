import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { accountid } = params;

    if (!accountid) {
      return NextResponse.json(
        { success: false, error: "Account is not found" },
        { status: 400 }
      );
    }

    const docRef = doc(db, "Accounts", accountid); 
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "Account not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      account: { id: docSnap.id, ...docSnap.data() },
    });
  } catch (error) {
    console.error("Error fetching account:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
