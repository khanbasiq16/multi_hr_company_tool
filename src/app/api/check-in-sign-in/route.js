import { NextResponse } from "next/server";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signToken } from "@/lib/signToken";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    let userCredential;
    try {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const loggedInUser = userCredential.user;

    const userRef = doc(db, "employees", loggedInUser.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return NextResponse.json(
        { success: false, error: "User not found in Firestore." },
        { status: 404 }
      );
    }

   
    const userData = userDoc.data();

   
    const token = signToken({
      id: loggedInUser.uid,
      email: loggedInUser.email,
      role: "employee",
    });

    
    const response = NextResponse.json({
      message: "Login successfully",
      user: {
        role: "employee",
        ...userData,
      },
      token,
      success: true,
    });

    // ✅ Cookie set karo
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("login error:", err);
    return NextResponse.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
}
