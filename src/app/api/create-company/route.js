import cloudinary from "@/lib/cloudinary";
import { db } from "@/lib/firebase";
import { collection, doc, getDocs, query, where, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const companyAddress = formData.get("companyAddress") || "";
    const companyPhoneNumber = formData.get("companyPhoneNumber") || "";
    const companyWebsite = formData.get("companywebsite") || "";
    const companyFacebook = formData.get("companyFacebook") || "";
    const companyLinkedin = formData.get("companyLinkedin") || "";
    const companyInstagram = formData.get("companyInstagram") || "";
    const companyemail = formData.get("companyemail") || "";
    const companyemailpassword = formData.get("companyemailpassword") || "";
    const companysmtphost = formData.get("companysmtphost") || "";
    const companyemailhost = formData.get("companyemailhost") || "";
    const file = formData.get("file");

    if (!name) {
      return NextResponse.json(
        { error: "Company name required hai" },
        { status: 400 }
      );
    }

    try {
      const companiesCollection = collection(db, "companies");
      const q = query(companiesCollection, where("companyPhoneNumber", "==", companyPhoneNumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return NextResponse.json(
          { meesage: "Company email already exists" },
          { status: 400 }
        );
      }
    } catch (err) {
      console.log("Collection 'companies' does not exist yet, continuing...");
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
      companyLogo: logoUrl,
      companyWebsite,
      companyemail,              
      companyemailpassword,       
      companysmtphost,  
      companyemailhost,
      companyFacebook,
      companyInstagram,
      companyLinkedin,
      companyslug: name.toLowerCase().replace(/\s+/g, "-"),
      timezone: "Asia/Karachi",
      AssignEmployee: [],
      CreateClients: [],
      Createcontracts: [],
      ContactTemplates: [],
      createdAt: new Date().toISOString(),
      status: "active",
    });

    
    const allCompaniesSnap = await getDocs(collection(db, "companies"));
    const companies = allCompaniesSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      message: "Company created successfully",
      companies,
    });
  } catch (error) {
    console.error("POST /api/companies error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
