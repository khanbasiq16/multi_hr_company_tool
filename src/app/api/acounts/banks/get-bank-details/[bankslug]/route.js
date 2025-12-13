import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { bankslug } = params;

        
        if (!bankslug) {
            return NextResponse.json(
                { success: false, error: "Bank slug is required" },
                { status: 400 }
            );
        }

        const q1 = query(
            collection(db, "Banks"),
            where("bankslug", "==", bankslug)
        );

        const querySnapshot = await getDocs(q1);

        if (querySnapshot.empty) {
            return NextResponse.json(
                { success: false, error: "Bank not found" },
                { status: 404 }
            );
        }

        // Since slug is unique, get first doc
        const docSnap = querySnapshot.docs[0];
        const bankData = { id: docSnap.id, ...docSnap.data() };

        return NextResponse.json({
            success: true,
            bank: bankData,
        });

    } catch (error) {
        console.error("Error fetching bank details:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
