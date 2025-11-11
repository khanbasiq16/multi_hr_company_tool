import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const employeesSnap = await getDocs(collection(db, "employees"));
    const today = new Date();

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const yesterdayDay = yesterday.getDay();
    if (yesterdayDay === 6 || yesterdayDay === 0) {
      console.log("🛑 Yesterday was weekend — No attendance marking needed.");
      return NextResponse.json({
        success: false,
        message: "Yesterday was weekend — skipping marking",
      });
    }

    const yesterdayDateStr = yesterday.toLocaleDateString("en-GB");
    const autoCheckouts = [];

    for (const empDoc of employeesSnap.docs) {
      const empData = empDoc.data();
      const empId = empDoc.id;
      let attendance = empData.Attendance || [];

      const index = attendance.findIndex((a) => a.date === yesterdayDateStr);

      let totalWorkedTime = "00:00:00";
      if (empData.startTime) {
        const start = new Date(empData.startTime).getTime();
        const now = Date.now();
        const diffInSeconds = Math.floor((now - start) / 1000);

        const formatElapsedTime = (seconds) => {
          const h = Math.floor(seconds / 3600);
          const m = Math.floor((seconds % 3600) / 60);
          const s = seconds % 60;
          return `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
        };

        totalWorkedTime = formatElapsedTime(diffInSeconds);
      }

      if (index !== -1) {
        const entry = attendance[index];

        if (
          entry.checkin &&
          Object.keys(entry.checkin).length > 0 &&
          (!entry.checkout || Object.keys(entry.checkout).length === 0)
        ) {
          const fetchKarachiTime = () => {
            try {
              const karachiDate = new Date().toLocaleString("en-US", {
                timeZone: "Asia/Karachi",
              });
              return new Date(karachiDate);
            } catch (error) {
              console.error("Failed to get Karachi time:", error);
              return new Date();
            }
          };

          const checkoutTime = fetchKarachiTime();
          entry.checkout = {
            time: checkoutTime,
            status: "Late Checkout",
            note: "Auto-marked as Late Checkout",
            stopwatchTime: totalWorkedTime,
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
      await updateDoc(empRef, {
        Attendance: attendance,
        isCheckedin: false,
        isCheckedout: true,
        startTime: null,
      });
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
