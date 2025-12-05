import { db } from "@/lib/firebase";
import { admin } from "@/lib/firebaseAdmin";
import { doc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { accountIds } = await req.json();

        if (!Array.isArray(accountIds) || accountIds.length === 0) {
            return NextResponse.json(
                { success: false, message: "No employees selected for deletion" },
                { status: 400 }
            );
        }

        for (const accountId of accountIds) {
            try {
                await admin.auth().deleteUser(accountId);

                await deleteDoc(doc(db, "Accounts", accountId));

                console.log(`✅ Deleted Accountant with ID: ${accountId}`);
            } catch (err) {
                console.error(`❌ Failed to delete ${accountId}:`, err.message);
            }
        }

        // 3️⃣ Fetch updated employees list
        const snapshot = await getDocs(collection(db, "Accounts"));
        const allaccounts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json(
            {
                success: true,
                message: "Selected Accountants deleted successfully",
                accounts: allaccounts,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("🔥 Delete employee error:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
