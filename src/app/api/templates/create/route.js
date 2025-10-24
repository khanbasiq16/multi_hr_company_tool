import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const body = await req.json();
    const { role, company } = body;

    if (!role) {
      return NextResponse.json({ success: false, message: "Role required" });
    }

    const trmaplateId = uuidv4();

    const docRef = await setDoc(collection(db, "templates", trmaplateId), {
      trmaplateId,
      role,
      company: company || "",
      createdAt: new Date(),
    });

    const templatesCollection = collection(db, "templates");
    const templatesnapshot = await getDocs(templatesCollection);

    const templates = templatesnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      message: "Template saved successfully",
      templates,
    });
  } catch (error) {
    console.error("Error adding template:", error);
    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}
