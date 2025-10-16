import { NextResponse } from "next/server";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { signToken } from "@/lib/signToken";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    let userCredential;
    try {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = userCredential.user;

    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    let userData = null;
    let userType = "user";

    if (userDoc.exists()) {
      userData = userDoc.data();
    } else {
      const empRef = doc(db, "employees", user.uid);
      const empDoc = await getDoc(empRef);

      if (empDoc.exists()) {
        userData = empDoc.data();
        userType = "employee";

        const checkInTime = userData.checkInTime || "9:00 PM"; 
        const graceTime = userData.graceTime || "9:30 PM"; 

        const now = new Date();

        function convertToDate(timeString) {
          return new Date(`1970-01-01 ${timeString}`);
        }

        const graceDate = convertToDate(graceTime);
        const currentDate = convertToDate(
          now.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })
        );

        let attendanceStatus =
          currentDate <= graceDate ? "Present" : "Late";

        const attendanceData = {
          userId: user.uid,
          checkInAt: now.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
          status: attendanceStatus,
          date: new Date().toISOString().split("T")[0],
          
        };

        await updateDoc(empRef, {
          Attendence: [...(userData.Attendence || []), attendanceData],
        });
      }
    }

    if (!userData) {
      return NextResponse.json(
        { error: "User not found in users or employees" },
        { status: 404 }
      );
    }

    const token = signToken({
      id: user.uid,
      email: user.email,
      role: userData.role || userType || "user",
    });

    const response = NextResponse.json({
      message: `Login successful (${userType == "employee" ? "Employee" : "Admin"})`,
      user: userData,
      token,
      success: true,
      userType,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
