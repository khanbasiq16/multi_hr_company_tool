import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
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
      earlycheckout,
    } = body;

    console.log("Request Body:", body);

   
    const docRef = doc(db, "ipWhitelist", "global");
    const whitelistSnap = await getDoc(docRef);

    if (!whitelistSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "Whitelist not found." },
        { status: 500 }
      );
    }

    const whitelist = whitelistSnap.data()?.whitelist || [];
    // const isAllowed = whitelist.some((item) => item.ip === ip);

    // if (!isAllowed) {
    //   console.log("❌ Blocked IP:", ip);
    //   return NextResponse.json(
    //     { success: false, error: "Unauthorized IP address." },
    //     { status: 403 }
    //   );
    // }

    const partialIp = ip.split(".").slice(0, 3).join(".");

        const isAllowed = whitelist.some((item) => {
          const partialWhitelistIp = item.ip.split(".").slice(0, 3).join(".");
          return partialIp === partialWhitelistIp;
        });
        if (!isAllowed) {
          console.log("❌ Blocked IP:", ip);

           return NextResponse.json(
        { success: false, error: "Check Out Failed . Please Connect With the Office Network" },
        { status: 403 }
      );
        } 



    // 2️⃣ Check if employee exists
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

    // 3️⃣ Find the target attendance by ID
    const index = attendanceArray.findIndex(
      (item) => item.id === attendenceid
    );

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Attendance record not found" },
        { status: 404 }
      );
    }


    const checkoutData = {
      ip,
      note,
      time,
      stopwatchTime,
      status:earlycheckout ? "Early Check Out" : "Late Check Out",
    };

    attendanceArray[index].checkout = checkoutData;

    
    await updateDoc(userRef, {
      Attendance: attendanceArray,
    });

   

    return NextResponse.json({
      success: true,
      message: "Checkout data updated successfully",
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
