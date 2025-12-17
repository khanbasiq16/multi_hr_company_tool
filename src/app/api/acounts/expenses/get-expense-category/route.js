import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const expensesCategoryRef = collection(db, "expensesCategory");

        const expensesCategorySnapshot = await getDocs(expensesCategoryRef);

        const expensesCategories = expensesCategorySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json({ success: true, expensesCategories }, { status: 200 });
    } catch (error) {
        console.error("Error fetching expensesCategory:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch expensesCategory", error: error.message },
            { status: 500 }
        );
    }
}
