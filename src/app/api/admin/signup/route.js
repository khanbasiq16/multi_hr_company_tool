
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password ) {
      return NextResponse.json(
        { error: "email, password aur role required hain" },
        { status: 400 }
      );
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email,
      name: name || "",
      role:"superAdmin",
      status: "active",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "User created",
      uid: user.uid,
    });

  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}