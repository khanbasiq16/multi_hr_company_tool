import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; // setDoc use karein
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, date } = body;

        if (!name || !date) {
            return NextResponse.json(
                { success: false, message: "Holiday name and date are required" },
                { status: 400 }
            );
        }

        const customId = uuidv4();
        const holidayDocRef = doc(db, "Holidays", customId);

        await setDoc(holidayDocRef, {
            id: customId,
            name: name,
            date: date,
            createdAt: serverTimestamp(),
        });

        return NextResponse.json(
            {
                success: true,
                message: "Holiday added successfully",
                id: customId
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Holiday Save Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}