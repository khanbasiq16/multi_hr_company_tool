import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { status, invoiceId } = body;

    if (!invoiceId || !status) {
      return NextResponse.json(
        { success: false, message: "Invoice ID and status are required" },
        { status: 400 }
      );
    }
 
    const invoiceRef = doc(db, "invoices", invoiceId);


    const snapshot = await getDoc(invoiceRef);
    if (!snapshot.exists()) {
      return NextResponse.json(
        { success: false, message: "Invoice not found" },
        { status: 404 }
      );
    }

    await updateDoc(invoiceRef, {
      status: status,
    });

    return NextResponse.json({
      success: true,
      message: "Payment Successfull",
    });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { success: false, message: "Server Error", error },
      { status: 500 }
    );
  }
}
