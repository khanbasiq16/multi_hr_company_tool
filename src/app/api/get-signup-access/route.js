import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const docRef = doc(db, "settings", "adminConfig");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ signupAccess: false });
    }

    const data = docSnap.data();
    return NextResponse.json({ signupAccess: data.signupAccess });
  } catch (error) {
    console.error("Error fetching signup access:", error);
    return NextResponse.json(
      { error: "Failed to fetch signup access" },
      { status: 500 }
    );
  }
}
