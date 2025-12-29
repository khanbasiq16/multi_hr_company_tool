import { NextResponse } from "next/server";
import { doc, updateDoc, getDoc } from "firebase/firestore"; // getDoc add kiya check ke liye
import { db } from "@/lib/firebase";

export async function POST(req, { params }) {
    try {
        const { id } = params;
        const { name } = await req.json();

        console.log("Updating ID:", id);
        console.log("New Name:", name);

        if (!name) {
            return NextResponse.json({ message: "Holiday name is required" }, { status: 400 });
        }

        const holidayRef = doc(db, "Holidays", id);

        const docSnap = await getDoc(holidayRef);
        
        if (!docSnap.exists()) {
            console.error("Document not found in Firestore for ID:", id);
            return NextResponse.json({ 
                message: "Holiday document not found in database. Please check if the ID is correct." 
            }, { status: 404 });
        }

        await updateDoc(holidayRef, {
            name: name,
            updatedAt: new Date().toISOString()
        });

        return NextResponse.json({ message: "Holiday updated successfully" }, { status: 200 });

    } catch (error) {
        console.error("Firebase Update Error Detail:", error);
        return NextResponse.json({ 
            message: "Error updating holiday", 
            error: error.message 
        }, { status: 500 });
    }
}