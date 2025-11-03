import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(req , {params}) {
  try {

    const {templateid} = params

    const docRef = doc(db, "templates", templateid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "No templates found" },
        { status: 404 }
      );
    }

    const template = docSnap.data()

    return NextResponse.json(
      {
        success: true,
        template: template,
      },
     
    );
    
  } catch (error) {
    console.error("Error fetching whitelist:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
