
import cloudinary from "@/lib/cloudinary";
import { db } from "@/lib/firebase";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
 
    const formData = await req.formData();


    const name = formData.get("name");
    const companyAddress = formData.get("companyAddress") || "";
    const companyPhoneNumber = formData.get("companyPhoneNumber") || "";
    const companyWebsite = formData.get("companywebsite") || "";
    const file = formData.get("file");

    if (!name) {
      return NextResponse.json(
        { error: "Company name required hai" },
        { status: 400 }
      );
    }

    let logoUrl = "";
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "company_logos" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });

      logoUrl = uploadResult.secure_url;
    }

    const companyId = uuidv4();

    await setDoc(doc(db, "companies", companyId), {
      companyId,
      name,
      companyAddress,
      companyPhoneNumber,
      companyLogo:logoUrl,
      companyWebsite,
      companyslug: name.toLowerCase().replace(/\s+/g, '-'),
      timezone: "Asia/Karachi",
      AssignEmployee: [],
      CreateClients: [],
      Createcontracts: [],
      ContactTemplates: [],
      createdAt: new Date().toISOString(),
      status: "active",
    });


    const querySnapshot = await getDocs(collection(db, "companies"));
    const companies = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
 

    return NextResponse.json({
      success: true,
      message: "Company created successfully",
      companies
    });

  } catch (error) {
    console.error("POST /api/companies error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
