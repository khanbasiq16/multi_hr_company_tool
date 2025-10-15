import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params; 
    const companySlug = id;

    if (!companySlug) {
      return NextResponse.json(
        { success: false, error: "Missing company slug" },
        { status: 400 }
      );
    }
    

    const invoicesQuery = query(
      collection(db, "invoices"),
      where("companySlug", "==", companySlug)
    );

    const snapshot = await getDocs(invoicesQuery);

    if (snapshot.empty) {
      return NextResponse.json(
        { success: true, invoices: [], message: "No invoices found for this company" },
        { status: 200 }
      );
    }

    const invoices = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, invoices }, { status: 200 });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch invoices", error: error.message },
      { status: 500 }
    );
  }
}
