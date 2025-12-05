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
            accountuseraddress,
            accountuserphone,
        } = body;


        if (!accountuserName || !accountuseremail || !accountuserpassword) {
            return NextResponse.json(
                { success: false, error: "All fields are required" },
                { status: 400 }
            );
        }


        const userCredential = await createUserWithEmailAndPassword(
            auth,
            accountuseremail,
            accountuserpassword
        );

        const user = userCredential.user;
        const accountId = user.uid;


        await setDoc(doc(collection(db, "Accounts"), accountId), {
            accountId,
            accountuserName,
            accountuseremail,
            accountuserpassword,
            accountuseraddress,
            accountuserphone,
            banks: [],
            status: "active",
            createdAt: new Date().toISOString(),
        });


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
                accounts:accounts,
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
