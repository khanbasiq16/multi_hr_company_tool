import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params; 
   

    const templateRef = collection(db, "templates");

    const q = query(templateRef, where("company.companyslug", "==", id));

    const snapshot = await getDocs(q);

    const templates = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, templates }, { status: 200 });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch templates",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
