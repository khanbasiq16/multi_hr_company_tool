import { NextResponse } from "next/server";
import { doc, getDoc, getDocs, collection, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
    try {
        const body = await req.json();
        const { currenyName, currencyCode, currencySymbol  , Curencyrate} = body;
        const curencyid = uuidv4();


        if (!currenyName || !currencyCode || !currencySymbol || !Curencyrate) {
            return NextResponse.json(
                { error: "Curency Data are required" },
                { status: 400 }
            );
        }

        await setDoc(doc(collection(db, "currency"), curencyid), {
            curencyid,
            currenyName,
            currencyCode,
            currencySymbol,
            Curencyrate,
            createdAt: new Date().toISOString(),
        });


        const currencyRef = collection(db, "currency");
        const currencySnapshot = await getDocs(currencyRef);
        const currencies = currencySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        

        const response = NextResponse.json({
            message: `Currency Added successfully`,
            currencies: currencies,
            success: true,
        });

        return response;
    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
