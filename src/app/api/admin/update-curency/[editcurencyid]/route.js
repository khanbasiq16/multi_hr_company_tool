import { NextResponse } from "next/server";
import { updateDoc, doc, collection, getDocs, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req, { params }) {
    try {
        const body = await req.json();
        const { editcurencyid } = params;
        const { currenyName, currencyCode, currencySymbol, Curencyrate } = body;

        console.log(body)


        // ✅ Validation
        if (!currenyName || !currencyCode || !currencySymbol || !Curencyrate) {
            return NextResponse.json(
                { error: "Currency data are required" },
                { status: 400 }
            );
        }

        // ✅ Check if document exists
        const currencyDocRef = doc(db, "currency", editcurencyid);
        const currencySnapshot = await getDoc(currencyDocRef);

        if (!currencySnapshot.exists()) {
            return NextResponse.json(
                { error: "Currency not found" },
                { status: 404 }
            );
        }

        // ✅ Update document
        await updateDoc(currencyDocRef, {
            currenyName,
            currencyCode,
            currencySymbol,
            Curencyrate: parseFloat(Curencyrate),
        });

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
        console.error("Update Currency Error:", error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
