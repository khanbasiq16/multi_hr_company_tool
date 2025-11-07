


import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    console.log("🕗 Daily Attendance Check Started...");

    const employeesSnap = await getDocs(collection(db, "employees"));
    const today = new Date();

    const day = today.getDay();
    if (day === 6 || day === 0) {
      console.log("🛑 Weekend detected — No attendance marking today.");
      return NextResponse.json({
        success: false,
        message: "Weekend detected — skipping marking",
      });
    }

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayDateStr = yesterday.toLocaleDateString("en-GB");

    const autoCheckouts = [];

    for (const empDoc of employeesSnap.docs) {
      const empData = empDoc.data();
      const empId = empDoc.id;
      let attendance = empData.Attendance || [];

      const index = attendance.findIndex((a) => a.date === yesterdayDateStr);

      if (index !== -1) {
        const entry = attendance[index];

        if (
          entry.checkin &&
          Object.keys(entry.checkin).length > 0 &&
          (!entry.checkout || Object.keys(entry.checkout).length === 0)
        ) {
          entry.checkout = {
            time: null,
            status: "Late Checkout",
            note: "Auto-marked as Late Checkout",
            autoCheckout: true,
          };
          autoCheckouts.push({ employeeId: empId, date: yesterdayDateStr });
        }
      } else {
        
        attendance.push({
          id: uuidv4(),
          date: yesterdayDateStr,
          checkin: { status: "Absent", note: "Auto-marked Absent" },
          checkout: { status: "Absent", note: "Auto-marked Absent" },
        });
      }

      const empRef = doc(db, "employees", empId);
      await updateDoc(empRef, { Attendance: attendance });
    }

    return NextResponse.json({
      success: true,
      message: "✅ Daily attendance check done",
      autoCheckouts,
    });
  } catch (err) {
    console.error("🔥 Error in daily check:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
