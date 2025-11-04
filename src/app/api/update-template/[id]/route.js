import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

export async function POST(req, { params }) {
  try {
    const { id } = params;
    const { templateName, fields ,  slug} = await req.json();

    if (!templateName || !Array.isArray(fields)) {
      return NextResponse.json(
        { success: false, message: "Invalid data format" },
        { status: 400 }
      );
    }

    const docRef = doc(db, "templates", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { success: false, message: "Template not found" },
        { status: 404 }
      );
    }

    await updateDoc(docRef, {
      templateName,
      fields,
      slug,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Template updated successfully!",
    });
  } catch (error) {
    console.error("Error updating template:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
