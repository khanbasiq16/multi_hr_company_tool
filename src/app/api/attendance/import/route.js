import { db } from "@/lib/firebase";
import ExcelJS from "exceljs";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";


const excelDateToJSDate = (serial) => {
    if (!serial) return "";
    if (typeof serial === "string") return serial;

    const utc_days = serial - 25569;
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);

    const day = String(date_info.getUTCDate()).padStart(2, "0");
    const month = String(date_info.getUTCMonth() + 1).padStart(2, "0");
    const year = date_info.getUTCFullYear();

    return `${day}/${month}/${year}`;
};

export const POST = async (req) => {
    try {
        const formData = await req.formData();
        const file = formData.get("file");
        const employeeId = formData.get("employeeId");
        const clientIp = formData.get("clientIp");


        if (!employeeId) {
            return NextResponse.json(
                { success: false, message: "Employee ID missing" },
                { status: 400 }
            );
        }

        if (!file) {
            return NextResponse.json(
                { success: false, message: "No file uploaded" },
                { status: 400 }
            );
        }



        const empRef = doc(db, "employees", employeeId);
        const empSnap = await getDoc(empRef);


        if (!empSnap.exists()) {
            return NextResponse.json(
                { success: false, message: "Employee not found" },
                { status: 404 }
            );
        }

        const employee = empSnap.data();
        const existingAttendance = Array.isArray(employee.Attendance)
            ? employee.Attendance
            : [];

        // 🔹 Read Excel
        const buffer = Buffer.from(await file.arrayBuffer());
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);

        const newAttendanceRows = [];

        workbook.eachSheet((worksheet) => {
            worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                if (rowNumber === 1) return;

                const values = row.values.slice(1);

                const date = excelDateToJSDate(values[0]);
                if (!date) return;

                const formattedTime = new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                });

                newAttendanceRows.push({
                    id: uuidv4(),
                    date,
                    checkin: {
                        ip: clientIp,
                        time: formattedTime,
                        status: values[1] || "",
                        note: "",
                    },
                    checkout: {
                        ip: clientIp,
                        time: formattedTime,
                        stopwatchTime: "00:00:00",
                        status: values[2] || "",
                        note: "",
                    },
                });
            });
        });


     

        const updatedAttendance = [
            ...existingAttendance,
            ...newAttendanceRows,
        ];

        await updateDoc(empRef, {
            Attendance: updatedAttendance,
        });


        const employeesRef = collection(db, "employees");
        const employeesSnap = await getDocs(employeesRef);
        const employees = employeesSnap.docs.map((doc) => doc.data());


        return NextResponse.json({
            success: true,
            message: "Attendance uploaded successfully",
            allEmployees: employees,
        });

    } catch (err) {
        console.error("Attendance Upload Error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
};

