import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { ids, status, employeeid } = await req.json();

    if (!ids?.length || !status || !employeeid) {
      return NextResponse.json(
        { success: false, message: "Missing ids, status, or employeeid" },
        { status: 400 }
      );
    }

    const empRef = doc(db, "employees", employeeid);
    const empSnap = await getDoc(empRef);

    if (!empSnap.exists()) {
      return NextResponse.json(
        { success: false, message: "Employee not found" },
        { status: 404 }
      );
    }

    const empData = empSnap.data();
    const attendanceArray = empData.Attendance || [];

 
    const updatedAttendance = attendanceArray.map((att) => {
      if (att?.id && ids.includes(att.id)) {
        return {
          ...att,
          checkin: {
            ...att.checkin,
            status: status, 
          },
        };
      }
      return att;
    });

    await updateDoc(empRef, { Attendance: updatedAttendance });

    const updatedSnap = await getDoc(empRef);
    const updatedData = updatedSnap.data();

    return NextResponse.json({
      success: true,
      message: "Attendance status updated successfully",
      employee: updatedData,
    });
  } catch (error) {
    console.error("Error updating Firebase:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
