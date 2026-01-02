import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

const calculateTax = (basicSalary) => {
    const annualSalary = basicSalary * 12;
    let annualTax = 0;
    if (annualSalary <= 600000) annualTax = 0;
    else if (annualSalary <= 1200000) annualTax = (annualSalary - 600000) * 0.01;
    else if (annualSalary <= 2200000) annualTax = 6000 + (annualSalary - 1200000) * 0.11;
    else if (annualSalary <= 3200000) annualTax = 116000 + (annualSalary - 2200000) * 0.23;
    else if (annualSalary <= 4100000) annualTax = 346000 + (annualSalary - 3200000) * 0.3;
    else annualTax = 616000 + (annualSalary - 4100000) * 0.35;
    return Math.round(annualTax / 12);
};

export async function POST() {
    try {
        const snapshot = await getDocs(collection(db, "employees"));
        const now = new Date();


        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        const salaryRows = snapshot.docs.map(doc => {
            const data = doc.data();
            const attendance = data.Attendance || [];
            const basicSalary = parseFloat(data.employeeSalary || 0);

            // 1. Current Month Attendance Filter
            const monthData = attendance.filter(record => {
                if (!record.date) return false;
                const [d, m, y] = record.date.split("/");
                return parseInt(m) === currentMonth && parseInt(y) === currentYear;
            });

            // 2. Attendance Stats
            const lates = monthData.filter(a => a.checkin?.status === "Late").length;
            const absents = monthData.filter(a => a.checkin?.status === "Absent").length;

            // 3. Financial Calculations
            const perDaySalary = Math.round(basicSalary / 30);
            const monthlyTax = calculateTax(basicSalary);

            // Deductions (Basic Logic)
            const absentDeduction = absents * perDaySalary;
            const lateDeduction = Math.floor(lates / 3) * (perDaySalary / 2);

            const allowances = parseFloat(data.otherAllowances || 0);
            const advance = parseFloat(data.advanceLoan || 0);
            const bonus = parseFloat(data.performanceBonus || 0);
            const commission = parseFloat(data.salesCommission || 0);

            const grossTotal = (basicSalary + allowances + bonus + commission) - (monthlyTax + absentDeduction + lateDeduction + advance);

            return {
                "Name": data.employeeName || "N/A",
                "Designation": data.department || "N/A",
                "Joining Date": data.dateOfJoining || "N/A",
                "Basic Monthly Salary": basicSalary,
                "Per Day Salary": perDaySalary,
                "Other Allowances": allowances,
                "Advance/Loan": advance,
                "Late Comings": lates,
                "Absent": absents,
                "Performance Bonus": bonus,
                "Sales Commission": commission,
                "Tax": monthlyTax,
                "Gross Total": grossTotal,
                "Total Amount Payable": grossTotal
            };
        });

        // Create Excel
        const worksheet = XLSX.utils.json_to_sheet(salaryRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Salary Sheet");

        // Buffer for Response
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        return new NextResponse(excelBuffer, {
            status: 200,
            headers: {
                'Content-Disposition': `attachment; filename="Salary_Report_${currentMonth}_${currentYear}.xlsx"`,
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
        });

    } catch (error) {
        console.error("Export Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}