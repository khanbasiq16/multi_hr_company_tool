import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { contractName, templateId, companyid, status } = await req.json();

    if (!contractName || !templateId || !companyid) {
      return NextResponse.json({
        success: false,
        message: "Contract name, template, and company ID are required",
      });
    }

    const templateRef = doc(db, "template", templateId);
    const templateSnap = await getDoc(templateRef);

    if (!templateSnap.exists()) {
      return NextResponse.json({
        success: false,
        message: "Template not found",
      });
    }

    const templateData = templateSnap.data();
    
    const templateFields = templateData.fields || [];

    await addDoc(collection(db, "contracts"), {
      contractName,
      status: status || "draft",
      templateId,
      companyid,
      fields: templateFields,
      createdAt: serverTimestamp(),
    });

    
    const contractsRef = collection(db, "contracts");
    const q = query(contractsRef, where("companyid", "==", companyid));
    const snapshot = await getDocs(q);

    const contracts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      message: "Contract created successfully",
      contracts,
    });
  } catch (error) {
    console.error("Error creating contract:", error);
    return NextResponse.json(
      { success: false, message: "Error creating contract" },
      { status: 500 }
    );
  }
}
