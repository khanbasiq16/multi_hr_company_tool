import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Company slug not provided" },
        { status: 400 }
      );
    }

   
    const q = query(
      collection(db, "companies"),
      where("companyslug", "==", id) 
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { success: false, error: "Company not found" },
        { status: 404 }
      );
    }

   
    const docSnap = querySnapshot.docs[0];
    const companyData = { id: docSnap.id, ...docSnap.data() };

    return NextResponse.json({
      success: true,
      company: companyData,
    });
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

