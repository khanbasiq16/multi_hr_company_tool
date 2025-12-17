import { NextResponse } from "next/server";
import { collection, doc, setDoc, serverTimestamp, getDocs, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "@/lib/cloudinary";
import { sendNotificationToAdmins } from "@/lib/sendNotificationToAdmins";
import { sendNotificationToAllAccounts } from "@/lib/sendNotificationToAllAccounts";

export async function POST(req) {
    try {
        const formData = await req.formData();

        const amount = formData.get("amount");
        const categoryId = formData.get("categoryId");
        const date = formData.get("date");
        const description = formData.get("description");
        const paymentMethod = formData.get("paymentMethod");
        const bankAccountId = formData.get("bankAccountId");
        const userid = formData.get("userid");

        const files = formData.getAll("files");

        if (!amount) {
            return NextResponse.json(
                { meesage: "Amount is required" },
                { status: 400 }
            );
        }

        let imageUrls = [];

        if (files && files.length > 0) {
            for (const file of files) {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                const uploadResult = await new Promise((resolve, reject) => {
                    cloudinary.uploader
                        .upload_stream(
                            { folder: "expenses" },
                            (error, result) => {
                                if (error) reject(error);
                                else resolve(result);
                            }
                        )
                        .end(buffer);
                });

                imageUrls.push(uploadResult.secure_url);
            }
        }

        const expenseId = uuidv4();

        const userRef = doc(db, "Users", userid);
        const userlistData = await getDoc(userRef);

        if (!userlistData.exists()) {
            return NextResponse.json(
                { meesage: "User not found" },
                { status: 404 }
            );
        }

        const userData = userlistData.data();

        const categoryRef = doc(db, "expensesCategory", categoryId);
        const categoryData = await getDoc(categoryRef);

        if (!categoryData.exists()) {
            return NextResponse.json(
                { meesage: "Category not found" },
                { status: 404 }
            );
        }

        const updateCategory = await updateDoc(categoryRef, {
            expensesId: arrayUnion(expenseId),
        });

        if (bankAccountId) {
            const bankRef = doc(db, "Banks", bankAccountId);
            const bankData = await getDoc(bankRef);

            if (!bankData.exists()) {
                return NextResponse.json(
                    { meesage: "Bank not found" },
                    { status: 404 }
                );
            }

            const bankdata = bankData.data();
            const bankBalance = bankdata.balance;

            if (bankBalance < amount) {
                return NextResponse.json(
                    { meesage: "InSuficient Balance" },
                    { status: 400 }
                );
            }

            const newBalance = (
                parseFloat(bankBalance) - parseFloat(amount)
            ).toFixed(2);

            const updateBank = await updateDoc(bankRef, {
                balance: newBalance,
                expenselogs: arrayUnion({
                    expenseId,
                    amount,
                    ExpenseCategory: categoryData?.expenseCategoryName,
                    expencaid: categoryId,
                    date,
                    paymentMethod,
                    bankAccountId,
                    BankAcountName: bankdata?.banktitle,
                    Username: userData?.accountuserName,
                    createdAt: serverTimestamp(),
                }),
            });

        }

        const createExpense = await setDoc(doc(db, "expenses", expenseId), {
            expenseId,
            amount,
            categoryId,
            date,
            description,
            paymentMethod,
            bankAccountId,
            imageUrls,
            createdAt: serverTimestamp(),
            status: "active",
        });

        const expenseData = {
            expenseId,
            amount,
            categoryId,
            date,
            description,
            paymentMethod,
            bankAccountId,
            Username: userData?.accountuserName,
            imageUrls,
            createdAt: serverTimestamp(),
            status: "active",
        };

        await sendNotificationToAdmins(expenseData);
        await sendNotificationToAllAccounts(expenseData);


        const expensedata = await collection(db, "expenses");
        const expenseSnapshot = await getDocs(expensedata);
        const allExpenseData = expenseSnapshot.docs.map((doc) => doc.data());


        return NextResponse.json(
            { success: true, message: "Expense created successfully", data: allExpenseData },
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