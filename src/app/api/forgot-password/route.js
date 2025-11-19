import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await sendPasswordResetEmail(auth, email);

    return NextResponse.json({
      success: true,
      message: "If this email is registered, a password reset link has been sent.",
    });

  } catch (error) {
    console.error("Reset email error:", error);

    return NextResponse.json(
      { error: "Failed to send reset email. Please try again." },
      { status: 500 }
    );
  }
}
