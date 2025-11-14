import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function POST(req, { params }) {
  try {
    const { id } = params; // Contract ID from URL

    const {companyslug} = await req.json();

    const contractURL = `${process.env.NEXT_PUBLIC_BASE_URL}/client/${companyslug}/send-contracts/${id}`;

    await updateDoc(doc(db, "contracts", id), {
      contractURL,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      contractURL,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
