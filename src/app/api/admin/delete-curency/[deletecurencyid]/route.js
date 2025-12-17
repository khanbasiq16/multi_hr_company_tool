import { NextResponse } from "next/server";
import { doc, deleteDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req, { params }) {
    try {
        const { deletecurencyid } = params;

        console.log(deletecurencyid)

        if (!deletecurencyid) {
            return NextResponse.json(
                { error: "Currency ID is required" },
                { status: 400 }
            );
        }

        // ✅ Check if document exists
        const currencyDocRef = doc(db, "currency", deletecurencyid);
        const currencySnapshot = await getDoc(currencyDocRef);

        if (!currencySnapshot.exists()) {
            return NextResponse.json(
                { error: "Currency not found" },
                { status: 404 }
            );
        }

        // ✅ Delete document
        await deleteDoc(currencyDocRef);

        // ✅ Fetch all currencies after update
        const currencyRef = collection(db, "currency");
        const currencySnapshots = await getDocs(currencyRef);
        const currencies = currencySnapshots.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // ✅ Return response
        return NextResponse.json({
            message: "Currency updated successfully",
            currencies,
            success: true,
        });

    } catch (error) {
        console.error("Delete Currency Error:", error);
        return NextResponse.json(
            { error: error },
            { status: 500 }
        );
    }
}
