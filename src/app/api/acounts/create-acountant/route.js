import { auth, db } from "@/lib/firebase";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const {
            accountuserName,
            accountuseremail,
            accountuserpassword,
            accountAddress,
        } = body;

        // Basic validation
        if (!accountuserName || !accountuseremail || !accountuserpassword) {
            return NextResponse.json(
                { success: false, error: "All fields are required" },
                { status: 400 }
            );
        }

        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            accountuseremail,
            accountuserpassword
        );

        const user = userCredential.user;
        const employeeId = user.uid;

        // Save user info in Firestore
        await setDoc(doc(collection(db, "Accounts"), employeeId), {
            employeeId,
            accountuserName,
            accountuseremail,
            accountuserpassword,
            accountAddress,
            banks: [],
            status: "active",
            createdAt: new Date().toISOString(),
        });

        // Fetch all accounts
        const accountsCollection = collection(db, "Accounts");
        const snapshot = await getDocs(accountsCollection);
        const accounts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json(
            {
                success: true,
                message: "Account created successfully",
                accounts,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error creating account:", error);

        let errorMessage = "Something went wrong";
        if (error.code === "auth/email-already-in-use") {
            errorMessage = "Email is already in use";
        } else if (error.code === "auth/invalid-email") {
            errorMessage = "Invalid email address";
        } else if (error.code === "auth/weak-password") {
            errorMessage = "Password is too weak";
        }

        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 400 }
        );
    }
}
