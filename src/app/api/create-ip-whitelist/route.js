import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const { whitelist } = await req.json();

    if (!whitelist || !Array.isArray(whitelist) ) {
      return NextResponse.json(
        { success: false, error: "Whitelist array is required" },
        { status: 400 }
      );
    }

    const docRef = doc(db, "ipWhitelist", "global"); 

 
    await setDoc(docRef, {
      whitelist,
      updatedAt: new Date(),
    });

   
    return NextResponse.json(
      {
        success: true,
        message: "Whitelist updated successfully",
        whitelist,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating whitelist:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
