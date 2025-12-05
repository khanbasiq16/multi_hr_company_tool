import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export const POST = async (req) => {
    try {
        const formData = await req.formData();
        const file = formData.get("file");
        const employeeId = formData.get("employeeId");

        console.log(employeeId)

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);

        const sheetsData = [];

        workbook.eachSheet((worksheet) => {


            const sheetRows = [];
            worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                if (rowNumber === 1) return;

                console.log(row.values.slice(1));

                sheetRows.push(
                    {
                        id: uuidv4(),
                        date: row.values.slice(1),
                        checkin: {
                            ip: serverIp,
                            time: formattedTime,
                            status: "Absent",
                            note: "Auto-marked Absent",
                        },
                        checkout: {
                            ip: serverIp,
                            time: formattedTime,
                            stopwatchTime: "00:00:00",
                            status: "Absent",
                            note: "Auto-marked Absent",
                        },
                    }
                );
            });




            console.log(sheetsData);
        });

        return NextResponse.json({ success: true, data: sheetsData });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
};
