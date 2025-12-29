import { NextResponse } from "next/server";
import {
    collection,
    query,
    where,
    getDocs,
    doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(req, { params }) {
    const { id } = params;

    try {
        if (!id) {
            return NextResponse.json(
                { success: false, message: "User ID is required" },
                { status: 400 }
            );
        }


        const q = query(
            collection(db, "expenses"),
            where("userId", "==", id)
        );

        const snapshot = await getDocs(q);

        const expenses = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));


        return NextResponse.json(
            {
                success: true,
                count: expenses.length,
                expenses,

            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Get Expenses Error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
