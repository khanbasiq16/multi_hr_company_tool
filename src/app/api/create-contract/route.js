import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { contractName, templateId , companyid } = await req.json();

    if (!contractName || !templateId) {
      return NextResponse.json({
        success: false,
        message: "Contract name and template are required",
      });
    }

    await addDoc(collection(db, "contracts"), {
      contractName,
      templateId,
      companyid,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: "Contract created successfully",
    });
  } catch (error) {
    console.error("Error creating contract:", error);
    return NextResponse.json(
      { success: false, message: "Error creating contract" },
      { status: 500 }
    );
  }
}
