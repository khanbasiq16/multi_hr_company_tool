import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Contract ID not provided" },
        { status: 400 }
      );
    }

    const contractRef = doc(db, "contracts", id);
    const contractSnap = await getDoc(contractRef);

    if (!contractSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "Contract not found" },
        { status: 404 }
      );
    }

    const contractData = { id: contractSnap.id, ...contractSnap.data() };

    let templateData = null;

    if (contractData.templateId) {
      const templateRef = doc(db, "templates", contractData.templateId);
      const templateSnap = await getDoc(templateRef);

      if (templateSnap.exists()) {
        templateData = { id: templateSnap.id, ...templateSnap.data() };
      }
    }
 
    const mergedContract = {
      ...contractData,
      template: templateData,
    };


    return NextResponse.json({
      success: true,
      contract: mergedContract,
    });
  } catch (error) {
    console.error("Error fetching contract:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
