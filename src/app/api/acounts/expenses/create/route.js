import { NextResponse } from "next/server";
import {
    collection,
    doc,
    setDoc,
    serverTimestamp,
    getDocs,
    getDoc,
    updateDoc,
    arrayUnion,
    Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
    try {
        const formData = await req.formData();

        const amount = parseFloat(formData.get("amount"));
        const categoryId = formData.get("categoryId") || "";
        const date = formData.get("date") || "";
        const description = formData.get("description") || "";
        const paymentMethod = formData.get("paymentMethod") || "";
        const bankAccountId = formData.get("bankAccountId") || "";
        const userid = formData.get("userid") || "";

        if (!amount || isNaN(amount)) {
            return NextResponse.json(
                { message: "Valid amount is required" },
                { status: 400 }
            );
        }

        /* ================= IMAGE UPLOAD ================= */
        let imageUrls = [];
        const files = formData.getAll("files");

        if (files && files.length > 0) {
            for (const file of files) {
                const buffer = Buffer.from(await file.arrayBuffer());

                const uploadResult = await new Promise((resolve, reject) => {
                    cloudinary.uploader
                        .upload_stream({ folder: "expenses" }, (err, result) => {
                            if (err) reject(err);
                            else resolve(result);
                        })
                        .end(buffer);
                });

                imageUrls.push(uploadResult.secure_url);
            }
        }

        const expenseId = uuidv4();

        /* ================= USER ================= */
        const userRef = doc(db, "Accounts", userid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const userData = userSnap.data();
        const username = userData?.accountuserName || "";

        /* ================= CATEGORY ================= */
        const categoryRef = doc(db, "expensesCategory", categoryId);
        const categorySnap = await getDoc(categoryRef);

        if (!categorySnap.exists()) {
            return NextResponse.json(
                { message: "Category not found" },
                { status: 404 }
            );
        }

        const categoryName =
            categorySnap.data()?.expenseCategoryName || "";

        const categoryType =
            categorySnap.data()?.expenseCategoryType || "";

        await updateDoc(categoryRef, {
            expensesId: arrayUnion(expenseId),
        });

        /* ================= BANK ================= */
        let bankId = "";
        let bankTitle = "";

        if (bankAccountId) {
            const bankRef = doc(db, "Banks", bankAccountId);
            const bankSnap = await getDoc(bankRef);

            if (!bankSnap.exists()) {
                return NextResponse.json(
                    { message: "Bank not found" },
                    { status: 404 }
                );
            }

            const bankData = bankSnap.data();
            const bankBalance = parseFloat(bankData.balance);

            if (bankBalance < amount) {
                return NextResponse.json(
                    { message: "Insufficient balance" },
                    { status: 400 }
                );
            }

            bankId = bankData?.bankid || "";
            bankTitle = bankData?.banktitle || "";

            const newBalance = (bankBalance - amount).toFixed(2);

            await updateDoc(bankRef, {
                balance: newBalance,
                expenselogs: arrayUnion({
                    expenseId,
                    amount,
                    ExpenseCategory: categoryName,
                    expencaid: categoryId,
                    date,
                    status: "Debit",
                    paymentMethod,
                    bankAccountId: bankId,
                    BankAcountName: bankTitle,
                    Username: username,
                    createdAt: Timestamp.now(),
                }),
            });
        }

        /* ================= UPDATE USER ================= */
        await updateDoc(userRef, {
            expensesId: arrayUnion(expenseId),
        });

        /* ================= CREATE EXPENSE ================= */
        await setDoc(doc(db, "expenses", expenseId), {
            expenseId,
            amount,
            expensecategoryid: categoryId,
            expensecategoryName: categoryName,
            expensecategoryType: categoryType,
            date,
            description,
            paymentMethod,
            bankAccountId: bankId,
            bankAccountName: bankTitle,
            userId: userid,
            Username: userData.accountuserName,
            imageUrls,
            createdAt: Timestamp.now(),
            status: "active",
        });

        /* ================= RESPONSE ================= */
        const expenseSnap = await getDocs(collection(db, "expenses"));
        const allExpenses = expenseSnap.docs.map((d) => d.data());

        return NextResponse.json(
            {
                success: true,
                message: "Expense added successfully",
                expenses: allExpenses,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Create Expense Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
