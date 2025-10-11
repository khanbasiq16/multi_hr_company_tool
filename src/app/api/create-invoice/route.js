import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp, setDoc, doc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      companyName,
      clientId,
      invoiceNumber,
      invoiceDate,
      totalAmount,
      createdBy,
      status,
      user_id,
      invoiceAmount,
      description,
    } = body;

    if (!clientId || !invoiceNumber || !companyName) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const invoiceId = uuidv4();

    const invoices = await setDoc(doc(db, "invoices", invoiceId), {
      invoiceId,
      companyName,
      clientId,
      invoiceNumber,
      invoiceDate,
      totalAmount: Number(totalAmount),
      createdBy,
      status: status || "Draft",
      user_id,
      invoiceAmount: Number(invoiceAmount) || 0,
      description: description || "",
      createdAt: Timestamp.now(),
    });

    return NextResponse.json({
      success: true,
      invoices,
      message: "Invoice created successfully",
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
