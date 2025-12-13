import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";


export async function POST(req, { params }) {
    try {
        const { bankid } = await params;
        const body = await req.json();
        

        await updateDoc(doc(db, "Banks", bankid), {
            ...body,
            banktitle: body?.bankTitle,
            bankslug: body?.bankTitle.toLowerCase().replace(/\s+/g, "-"),
            updatedAt: new Date(),
        });


        const bankRef = doc(db, "Banks", bankid);
        const bankSnap = await getDoc(bankRef);

        if (!bankSnap.exists()) {
            return NextResponse.json(
                { success: false, error: "Bank not found" },
                { status: 404 }
            );
        }

        const bankData = bankSnap.data();

        return NextResponse.json({
            success: true,
            message: "Bank updated successfully",
            bank: bankData,
        });

    } catch (error) {
        console.log("Error updating bank:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}