import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      employeeId,
      ip,
      time, 
      note,
      stopwatchTime,
      attendenceid,
    } = body;

    console.log("📥 Request Body:", body);

    // 1️⃣ Validate Employee ID
    if (!employeeId) {
      return NextResponse.json(
        { success: false, message: "Employee ID is required" },
        { status: 400 }
      );
    }

    // 2️⃣ Get IP Whitelist
    const docRef = doc(db, "ipWhitelist", "global");
    const whitelistSnap = await getDoc(docRef);

    if (!whitelistSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "Whitelist not found." },
        { status: 500 }
      );
    }

    const whitelist = whitelistSnap.data()?.whitelist || [];

   
    const partialIp = ip.split(".").slice(0, 3).join(".");
    const isAllowed = whitelist.some((item) => {
      const partialWhitelistIp = item.ip.split(".").slice(0, 3).join(".");
      return partialIp === partialWhitelistIp;
    });

    if (!isAllowed) {
      console.log("❌ Blocked IP:", ip);
      return NextResponse.json(
        {
          success: false,
          error:
            "Check Out Failed. Please connect with the office network.",
        },
        { status: 403 }
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

    
    const index = attendanceArray.findIndex(
      (item) => item.id === attendenceid
    );

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Attendance record not found" },
        { status: 404 }
      );
    }


    let departmentData = null;
    if (userData.department) {
      const deptRef = collection(db, "departments");
      const deptQuery = query(
        deptRef,
        where("departmentName", "==", userData.department)
      );
      const deptSnapshot = await getDocs(deptQuery);

      if (!deptSnapshot.empty) {
        departmentData = {
          id: deptSnapshot.docs[0].id,
          ...deptSnapshot.docs[0].data(),
        };
      }
    }

    if (!departmentData) {
      return NextResponse.json(
        { success: false, message: "Department not found" },
        { status: 404 }
      );
    }

    // 6️⃣ Parse and Compare Times (Handles Night Shift Correctly)
    function parseTime12Hour(timeStr) {
      const [timePart, modifier] = timeStr.trim().split(" ");
      let [hours, minutes] = timePart.split(":").map(Number);

      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    }

    const deptCheckIn = parseTime12Hour(departmentData.checkInTime || "9:00 PM");
    const deptCheckOut = parseTime12Hour(departmentData.checkOutTime || "6:00 AM");
    const empCheckout = parseTime12Hour(time);

    // 🕐 Handle night shift (checkout next day after midnight)
    if (deptCheckOut < deptCheckIn) {
      // Department checkout occurs next day
      deptCheckOut.setDate(deptCheckOut.getDate() + 1);
      if (empCheckout < deptCheckIn) {
        empCheckout.setDate(empCheckout.getDate() + 1);
      }
    }

    // ⏰ Grace Time
    const graceTime = departmentData.graceTime || 0; // in minutes
    const graceMillis = graceTime * 60 * 1000;
    const lateThreshold = new Date(deptCheckOut.getTime() + graceMillis);

    // 🟩 Determine Status
    let status = "";
    if (empCheckout < deptCheckOut) {
      status = "Early Check Out";
    } else if (empCheckout > lateThreshold) {
      status = "Late Check Out";
    } else {
      status = "On Time Check Out";
    }

    // 7️⃣ Update Firestore
    attendanceArray[index].checkout = {
      ip,
      note,
      time,
      stopwatchTime,
      status,
    };

    await updateDoc(userRef, {
      Attendance: attendanceArray,
      isCheckedin: false,
      isCheckedout: true,
      startTime: null,
      attendanceid: "",
    });

    // ✅ Success Response
    return NextResponse.json({
      success: true,
      message: "Checkout data updated successfully",
        isCheckedin: false,
      isCheckedout: true,
      data: attendanceArray[index],
    });
  } catch (error) {
    console.error("❌ Error in checkout:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
