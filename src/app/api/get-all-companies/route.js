import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const companiesRef = collection(db, "companies");

    const snapshot = await getDocs(companiesRef);

    const companies = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, companies }, { status: 200 });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch companies", error: error.message },
      { status: 500 }
    );
  }
}
