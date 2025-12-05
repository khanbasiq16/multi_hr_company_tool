import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const AccountsRef = collection(db, "Accounts");

        const Accountssnapshot = await getDocs(AccountsRef);

        const accountsuser = Accountssnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json({ success: true, accounts: accountsuser }, { status: 200 });
    } catch (error) {
        console.error("Error fetching companies:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch companies", error: error.message },
            { status: 500 }
        );
    }
}
