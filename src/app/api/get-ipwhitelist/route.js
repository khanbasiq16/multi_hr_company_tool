import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET() {
  try {
    const docRef = doc(db, "ipWhitelist", "global");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "No whitelist found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        whitelist: docSnap.data().whitelist || [],
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error fetching whitelist:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
