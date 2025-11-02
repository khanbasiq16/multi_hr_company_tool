import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc, getDocs, collection } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { status } = await req.json(); 

    
    const companyRef = doc(db, "companies", id);

    
    const companySnap = await getDoc(companyRef);
    if (!companySnap.exists()) {
      return NextResponse.json(
        { success: false, message: "Company not found" },
        { status: 404 }
      );
    }

    
    await updateDoc(companyRef, { status });


     const companiesRef = collection(db, "companies");
    
        const snapshot = await getDocs(companiesRef);
    
        const companies = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
    

    return NextResponse.json({
      success: true,
      message: `Company status updated to ${status}`,
      companies
    });
  } catch (error) {
    console.error("🔥 Error updating company status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update company status" },
      { status: 500 }
    );
  }
}
