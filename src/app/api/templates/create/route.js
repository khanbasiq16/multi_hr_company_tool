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
    const { role, company  } = body;

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

    // Create template
    const templateRef = doc(db, "templates", templateId);
    await setDoc(templateRef, {
      templateId,
      role,
      company: companydata,
      fields: [],
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
