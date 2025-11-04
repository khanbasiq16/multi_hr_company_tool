// import { db } from "@/lib/firebase";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const {
//       employeeId,
//       ip,
//       time,
//       note,
//       stopwatchTime,
//       attendenceid,
//       earlycheckout,
//     } = body;

//     console.log("Request Body:", body);

   
//     const docRef = doc(db, "ipWhitelist", "global");
//     const whitelistSnap = await getDoc(docRef);

//     if (!whitelistSnap.exists()) {
//       return NextResponse.json(
//         { success: false, error: "Whitelist not found." },
//         { status: 500 }
//       );
//     }

//     const whitelist = whitelistSnap.data()?.whitelist || [];
//     // const isAllowed = whitelist.some((item) => item.ip === ip);

//     // if (!isAllowed) {
//     //   console.log("❌ Blocked IP:", ip);
//     //   return NextResponse.json(
//     //     { success: false, error: "Unauthorized IP address." },
//     //     { status: 403 }
//     //   );
//     // }

//         let departmentData = null;
//         if (userData.department) {
//           const deptRef = collection(db, "departments");
//           const deptQuery = query(
//             deptRef,
//             where("departmentName", "==", userData.department)
//           );
//           const deptSnapshot = await getDocs(deptQuery);
    
//           if (!deptSnapshot.empty) {
//             departmentData = {
//               id: deptSnapshot.docs[0].id,
//               ...deptSnapshot.docs[0].data(),
//             };
//           }
//         }
    
//         if (!departmentData) {
//           return NextResponse.json(
//             { success: false, message: "Department not found" },
//             { status: 404 }
//           );
//         }
    

//     const partialIp = ip.split(".").slice(0, 3).join(".");

//         const isAllowed = whitelist.some((item) => {
//           const partialWhitelistIp = item.ip.split(".").slice(0, 3).join(".");
//           return partialIp === partialWhitelistIp;
//         });
//         if (!isAllowed) {
//           console.log("❌ Blocked IP:", ip);

//            return NextResponse.json(
//         { success: false, error: "Check Out Failed . Please Connect With the Office Network" },
//         { status: 403 }
//       );
//         } 



//     // 2️⃣ Check if employee exists
//     if (!employeeId) {
//       return NextResponse.json(
//         { success: false, message: "Employee ID is required" },
//         { status: 400 }
//       );
//     }

//     const userRef = doc(db, "employees", employeeId);
//     const userDoc = await getDoc(userRef);

//     if (!userDoc.exists()) {
//       return NextResponse.json(
//         { success: false, message: "User not found" },
//         { status: 404 }
//       );
//     }

//     const userData = userDoc.data();
//     const attendanceArray = userData.Attendance || [];

//     // 3️⃣ Find the target attendance by ID
//     const index = attendanceArray.findIndex(
//       (item) => item.id === attendenceid
//     );

//     if (index === -1) {
//       return NextResponse.json(
//         { success: false, message: "Attendance record not found" },
//         { status: 404 }
//       );
//     }


//     const checkoutData = {
//       ip,
//       note,
//       time,
//       stopwatchTime,
//       status:earlycheckout ? "Early Check Out" : "Late Check Out",
//     };

//     attendanceArray[index].checkout = checkoutData;

    
//     await updateDoc(userRef, {
//       Attendance: attendanceArray,
//     });

   

//     return NextResponse.json({
//       success: true,
//       message: "Checkout data updated successfully",
//       data: attendanceArray[index],
//     });
//   } catch (error) {
//     console.error("❌ Error in checkout:", error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }


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
      time, // e.g., "6:00 AM"
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

    // Allow same subnet (first 3 octets)
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

    // 3️⃣ Get Employee Data
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

    // 4️⃣ Find the Target Attendance Record
    const index = attendanceArray.findIndex(
      (item) => item.id === attendenceid
    );

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Attendance record not found" },
        { status: 404 }
      );
    }

    // 5️⃣ Get Department Info
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

    // 6️⃣ Parse and Compare Times
    // Example: departmentData.checkOutTime = "6:00 AM", departmentData.graceTime = 10
    function parseTime12Hour(timeStr) {
      const [timePart, modifier] = timeStr.trim().split(" ");
      let [hours, minutes] = timePart.split(":").map(Number);

      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    }

    const departmentDate = parseTime12Hour(departmentData.checkOutTime);
    const employeeDate = parseTime12Hour(time);

    const graceTime = departmentData.graceTime || 0; // in minutes
    const graceMillis = graceTime * 60 * 1000;
    const lateThreshold = new Date(departmentDate.getTime() + graceMillis);

    let status = "";
    if (employeeDate < departmentDate) {
      status = "Early Check Out";
    } else if (employeeDate > lateThreshold) {
      status = "Late Check Out";
    } else {
      status = "On Time Check Out";
    }

    // 7️⃣ Update Attendance Record
    attendanceArray[index].checkout = {
      ip,
      note,
      time,
      stopwatchTime,
      status,
    };

    await updateDoc(userRef, {
      Attendance: attendanceArray,
    });

    // ✅ Return Success
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
