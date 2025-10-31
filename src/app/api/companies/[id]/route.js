import cloudinary from "@/lib/cloudinary";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Company ID required" }, { status: 400 });
    }

    const formData = await req.formData();
    const name = formData.get("name");
    const companyAddress = formData.get("companyAddress") || "";
    const companyPhoneNumber = formData.get("companyPhoneNumber") || "";
    const companyWebsite = formData.get("companyWebsite") || "";
    const companyFacebook = formData.get("companyFacebook") || "";
    const companyLinkedin = formData.get("companyLinkedin") || "";
    const companyInstagram = formData.get("companyInstagram") || "";
    const companyemail = formData.get("companyEmail") || "";
    const companyemailpassword = formData.get("companyEmailPassword") || "";
    const companyemailHost = formData.get("companyEmailHost") || "";
    const companysmtphost = formData.get("companySmtpHost") || "";
    const timezone = formData.get("timezone") || "";
    const file = formData.get("file");

        
    const companyRef = doc(db, "companies", id);
    const companySnap = await getDoc(companyRef);
    if (!companySnap.exists()) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const existingCompany = companySnap.data();
    let logoUrl = existingCompany.companyLogo || "";

   
    if (file && file.size > 0) {
     
      if (logoUrl) {
        const publicId = logoUrl
          .split("/")
          .pop()
          .split(".")[0]; 
        await cloudinary.uploader.destroy(`company_logos/${publicId}`);
      }

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

    
    const updatedData = {
      name,
      companyAddress,
      companyPhoneNumber,
      companyLogo: logoUrl,
      companyWebsite,
      companyemail:companyemail,
      companyemailpassword:companyemailpassword,
      companysmtphost:companysmtphost,
      companyemailhost:companyemailHost,
      companyFacebook,
      companyInstagram,
      companyLinkedin,
      timezone:timezone,
      companyslug: name.toLowerCase().replace(/\s+/g, "-"),
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(companyRef, updatedData);

    const updatedSnap = await getDoc(companyRef);
    return NextResponse.json({
      success: true,
      message: "Company updated successfully",
      company: { id: updatedSnap.id, ...updatedSnap.data() },
    });

  } catch (error) {
    console.error("PUT /api/companies error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
