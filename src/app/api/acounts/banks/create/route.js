import { NextResponse } from "next/server";
import {
    collection,
    getDocs,
    doc,
    setDoc,
    updateDoc,
    arrayUnion,
    getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
    try {
        const body = await req.json();

        const acountseref = doc(db, "Accounts", body.userid);
        const acountsnap = await getDoc(acountseref);

        if (!acountsnap.exists()) {
            return NextResponse.json(
                { success: false, error: "Accountants User not found" },
                { status: 404 }
            );
        }

        const bankid = uuidv4()

        await setDoc(doc(collection(db, "Banks"), bankid), {
            bankid,
            accountHolderName: body?.accountHolderName,
            banktitle: body?.bankTitle,
            accountType: body?.accountType,
            branchCode: body?.branchCode,
            iban: body?.iban,
            balance: body?.balance,
            currency: body?.currency,
            notes: body?.notes,
            bankslug: body?.bankTitle.toLowerCase().replace(/\s+/g, "-"),
            userid: body?.userid,
            Transaction: [],
            Transferlogs: [],
            Loanlogs: [],
            banks: [],
            status: "active",
            createdAt: new Date().toISOString(),
        });



        await updateDoc(acountseref, {
            banks: arrayUnion(bankid),
        });


        const BankRef = collection(db, "Banks");

        const Bankssnapshot = await getDocs(BankRef);

        const allbanks = Bankssnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));


        return NextResponse.json({ success: true, banks: allbanks });
    } catch (error) {
        console.error("Error creating client:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
