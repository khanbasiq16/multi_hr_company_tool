import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

export async function POST(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    const {
      companyName,
      clientName,
      clientAddress,
      clientEmail,
      clientPhone,
      projectsDetails,
      packageDetails,
      clientWebsite,
    } = body;

    if (!clientName || !clientEmail || !clientPhone) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const clientRef = doc(db, "clients", id);

    await updateDoc(clientRef, {
      companyName,
      clientName,
      clientAddress,
      clientEmail,
      clientPhone,
      projectsDetails,
      packageDetails,
      clientWebsite,
      updatedAt: new Date().toISOString(),
    });

    // ✅ Fetch updated client
    const updatedClientSnap = await getDoc(clientRef);
    const updatedClient = updatedClientSnap.exists()
      ? { id: updatedClientSnap.id, ...updatedClientSnap.data() }
      : null;

    return NextResponse.json({
      success: true,
      message: "Client updated successfully",
      client: updatedClient,
    });
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update client" },
      { status: 500 }
    );
  }
}
