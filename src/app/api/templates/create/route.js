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

    if (!companySnap.exists()) {
      return NextResponse.json({
        success: false,
        message: `Company '${company}' does not exist`,
      });
    }

    const companydata = companySnap.data();

    const defaultFields = [

      {
        id: "start-date-field",
        type: "date",
        label: "Start Date",
        question: "Start Date",
        answer: "",
        isFixed: true,
      },
      {
        id: "ending-date-field",
        type: "date",
        label: "Ending Date",
        question: "Ending Date",
        answer: "",
        isFixed: true,
      },
      {
        id: "your-signature-field",
        type: "signature",
        signatureType: "typed",
        label: "Your Signature",
        question: "Your Signature",
        answer: "",
        isFixed: true,
      },
      {
        id: "client-signature-field",
        type: "signature",
        signatureType: "pad",
        label: "Client Signature",
        question: "Client Signature",
        answer: "",
        isFixed: true,
      },
      {
        id: "appendix-field",
        type: "appendix",
        label: "Appendix",
        question: "Appendix",
        answer: "",
        isFixed: true,
      },
    ];


    // Create template
    const templateRef = doc(db, "templates", templateId);
    await setDoc(templateRef, {
      templateId,
      role,
      company: companydata,
      fields: defaultFields,
      createdAt: new Date(),
    });

    if (role === "Admin") {
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
      message: "Template created successfully ",
      templates,
    });
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}
