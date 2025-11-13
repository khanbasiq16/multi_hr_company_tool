import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const { id } = params;
    const { fields } = await req.json();

    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Contract ID is required",
      });
    }

    if (!fields || !Array.isArray(fields)) {
      return NextResponse.json({
        success: false,
        message: "Fields must be a valid array",
      });
    }

    // Contract reference
    const contractRef = doc(db, "contracts", id);
    const contractSnap = await getDoc(contractRef);

    if (!contractSnap.exists()) {
      return NextResponse.json({
        success: false,
        message: "Contract not found",
      });
    }

    // ✅ Update only the fields array
    await updateDoc(contractRef, {
      fields,
      updatedAt: serverTimestamp(),
    });

    const updatedSnap = await getDoc(contractRef);

    return NextResponse.json({
      success: true,
      message: "Contract fields updated successfully",
      contract: { id: updatedSnap.id, ...updatedSnap.data() },
    });

  } catch (error) {
    console.error("Error updating contract fields:", error);
    return NextResponse.json(
      { success: false, message: "Error updating contract fields" },
      { status: 500 }
    );
  }
}
