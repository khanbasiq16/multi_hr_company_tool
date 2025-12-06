import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params;


    if (!id) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const banksRef = collection(db, "Banks");
    const q = query(banksRef, where("userid", "==", id));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json(
        { success: false, message: "No banks found for this user" },
        { status: 404 }
      );
    }

    const banks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));


    return NextResponse.json({
      success: true,
      banks,
    });

  } catch (error) {
    console.error("Error fetching user banks:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
