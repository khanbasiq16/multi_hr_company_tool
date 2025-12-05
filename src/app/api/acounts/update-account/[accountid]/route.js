import { NextResponse } from "next/server";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req, { params }) {
    try {
        const { accountid } = params;
        const data = await req.json();

        const accountRef = doc(db, "Accounts", accountid);
        const accountSnap = await getDoc(accountRef);

        if (!accountSnap.exists()) {
            return NextResponse.json(
                { success: false, error: "Account not found" },
                { status: 404 }
            );
        }

        await updateDoc(accountRef, {
            ...data,
            updatedAt: new Date().toISOString(),
        });

        const updatedSnap = await getDoc(accountRef);
        const accounts = { id: updatedSnap.id, ...updatedSnap.data() };

        return NextResponse.json({
            success: true,
            message: "Account updated successfully",
            accounts: accounts,
        });
    } catch (error) {
        console.error("Error updating employee:", error);
        return NextResponse.json(
            { success: false, error: "Error updating employee" },
            { status: 500 }
        );
    }
}
