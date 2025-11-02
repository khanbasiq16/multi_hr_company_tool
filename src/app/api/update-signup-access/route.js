import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { signupAccess } = await req.json();
    const docRef = doc(db, "settings", "adminConfig");

    await setDoc(docRef, { signupAccess }, { merge: true });

    return NextResponse.json({
      success: true,
      message: `Signup access updated to ${signupAccess}`,
      signupAccess,
    });
  } catch (error) {
    console.error("Error updating signup access:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update signup access" },
      { status: 500 }
    );
  }
}
