import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { attendanceIds, employeeId } = body;

        if (!attendanceIds || attendanceIds.length === 0) {
            return NextResponse.json(
                { error: "No attendance IDs provided" },
                { status: 400 }
            );
        }

        if (!employeeId) {
            return NextResponse.json(
                { error: "No employee ID provided" },
                { status: 400 }
            );
        }

        const employeeRef = doc(db, "employees", employeeId);
        const employeeSnap = await getDoc(employeeRef);

        if (!employeeSnap.exists()) {
            return NextResponse.json(
                { error: "Employee not found" },
                { status: 404 }
            );
        }

        const existingAttendance = employeeSnap.data().Attendance || [];

        const updatedAttendance = existingAttendance.filter(
            (att) => !attendanceIds.includes(att.id)
        );

        await updateDoc(employeeRef, {
            Attendance: updatedAttendance
        });


        const updatedemployeeRef = doc(db, "employees", employeeId);
        const updatedemployeeSnap = await getDoc(updatedemployeeRef);

        const updatedEmployee = updatedemployeeSnap.data() || [];

        return NextResponse.json(
            { success: true, message: "Attendance records deleted successfully", employee: updatedEmployee },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting attendance records:", error);
        return NextResponse.json(
            { error: "Failed to delete attendance records", details: error.message },
            { status: 500 }
        );
    }
}
