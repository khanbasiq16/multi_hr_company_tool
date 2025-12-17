import { NextResponse } from "next/server";
import { collection, doc, setDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
    try {
        const body = await req.json();
        const { expenseCategoryName, expenseCategoryType, expenseCategoryDescription } = body;

        if (!expenseCategoryName || !expenseCategoryType) {
            return NextResponse.json(
                { error: "Expense name & type are required" },
                { status: 400 }
            );
        }

        const expenseCategoryId = uuidv4();

        const expenseDocRef = doc(db, "expensesCategory", expenseCategoryId);

        await setDoc(expenseDocRef, {
            id: expenseCategoryId,
            expenseCategoryName,
            expenseCategoryType,
            expenseCategoryDescription: expenseCategoryDescription || "",
            createdAt: serverTimestamp(),
        });


        const expensesCategoryCollection = collection(db, "expensesCategory");
        const snapshot = await getDocs(expensesCategoryCollection);
        const expensesCategory = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));


        return NextResponse.json(
            {
                success: true,
                message: "Expense created successfully",
                expensesCategory,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create Expense Error:", error);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
