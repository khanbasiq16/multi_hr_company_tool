import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();
    const { employeeId, ip, time, note, stopwatchTime, attendenceid } = body;

    console.log(body)

    if (!employeeId) {
      return NextResponse.json(
        { success: false, message: "Employee ID is required" },
        { status: 400 }
      );
    }

    const userRef = doc(db, "employees", employeeId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    const attendanceArray = userData.Attendance || [];

    const index = attendanceArray.findIndex((item) => item.id === attendenceid);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Attendance entry not found" },
        { status: 404 }
      );
    }

    
    const docRef = doc(db, "ipWhitelist", "global");
    const whitelistSnap = await getDoc(docRef);

    if (!whitelistSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "Whitelist not found." },
        { status: 500 }
      );
    }

    const whitelist = whitelistSnap.data()?.whitelist || [];

    const isAllowed = whitelist.some((item) => item.ip === ip);

    if (!isAllowed) {
      console.log("❌ Blocked IP:", ip);
      return NextResponse.json(
        { success: false, error: "Unauthorized IP address." },
        { status: 403 }
      );
    }

    attendanceArray[index] = {
      ...attendanceArray[index],
      checkout: {
        time,
        ip,
        note,
        stopwatchTime,
      },
    };

    await updateDoc(userRef, { Attendance: attendanceArray });

    return NextResponse.json(
      {
        success: true,
        message: "Checkout updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 Error in /api/checkin:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
