import { NextResponse } from "next/server";
import {
    doc,
    getDoc,
    updateDoc,
    arrayUnion
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
    const { amount, bankId, userid, ip } = await req.json();

    try {

        const bankRef = doc(db, "Banks", bankId);
        const bankSnap = await getDoc(bankRef);

        if (!bankSnap.exists()) {
            return NextResponse.json({ success: false, error: "Bank not found" }, { status: 404 });
        }

        const bank = bankSnap.data();
        const newBalance = parseInt(bank.balance) + parseInt(amount);


        const userRef = doc(db, "Accounts", userid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        const user = userSnap.data();

        const logId = uuidv4();

        await updateDoc(bankRef, {
            balance: newBalance,
            Logs: arrayUnion({
                id: logId,
                status: "Credit",
                ip,
                userid,
                amount,
                userName: user.accountuserName || "Unknown",
                role: "Accounts",
                date: new Date().toISOString()
            }),
        });


        const newbankRef = doc(db, "Banks", bankId);
        const newbankSnap = await getDoc(newbankRef);

        if (!newbankSnap.exists()) {
            return NextResponse.json({ success: false, error: "Bank not found" }, { status: 404 });
        }

        const bankdetails = newbankSnap.data();


        return NextResponse.json({
            success: true,
            message: "Balance updated & log added successfully",
            bank: bankdetails
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}
