import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const body = await req.json();
    const { role, company } = body;

    if (!role || !company) {
      return NextResponse.json({
        success: false,
        message: "Role and company are required",
      });
    }

    const templateId = uuidv4();


       const companyRef = doc(db, "companies", company);
      const companySnap = await getDoc(companyRef);

      const companydata = companySnap.data()

   
    const templateRef = doc(db, "templates", templateId);
    await setDoc(templateRef, {
      templateId,
      role,
      company:companydata,
      createdAt: new Date(),
    });

    if (role === "Admin") {
   

      if (!companySnap.exists()) {
        return NextResponse.json({
          success: false,
          message: `Company '${company}' does not exist`,
        });
      }

      await updateDoc(companyRef, {
        ContactTemplates: arrayUnion(templateId),
      });
    }

    const templatesRef = collection(db, "templates");
    const templatesSnapshot = await getDocs(templatesRef);
    const templates = templatesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      message: "Template created and company templates fetched successfully",
      templates,
    });
  } catch (error) {
    console.error("Error creating or fetching templates:", error);
    return NextResponse.json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}
