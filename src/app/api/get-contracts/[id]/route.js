import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Company slug not provided" },
        { status: 400 }
      );
    }

    const q = query(collection(db, "contracts"), where("companyid", "==", id));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { success: false, error: "Contracts not found" },
        { status: 404 }
      );
    }

    const contracts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

   
    
    return NextResponse.json({
      success: true,
      contracts, 
    });
  } catch (error) {
    console.error("Error fetching contracts:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
