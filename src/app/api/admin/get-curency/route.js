import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const currencyRef = collection(db, "currency");

        const currencySnapshot = await getDocs(currencyRef);

        const currencies = currencySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json({ success: true, currencies: currencies }, { status: 200 });
    } catch (error) {
        console.error("Error fetching currencies:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch currencies", error: error.message },
            { status: 500 }
        );
    }
}
