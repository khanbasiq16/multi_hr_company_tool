import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { deleteDoc, doc } from "firebase/firestore";

export async function POST(req, { params }) {
    try {
        const { id } = params;

        console.log("Deleting ID:", id);

        const holidayRef = doc(db, "Holidays", id);
        await deleteDoc(holidayRef);

        return NextResponse.json({ message: "Holiday deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Firebase Delete Error:", error);
        return NextResponse.json({ message: "Error deleting holiday", error: error.message }, { status: 500 });
    }
}