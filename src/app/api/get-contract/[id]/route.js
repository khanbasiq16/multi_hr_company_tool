import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params;


    if (!id) {
      return NextResponse.json(
        { success: false, error: "Contract ID not provided" },
        { status: 400 }
      );
    }

    const contractRef = doc(db, "contracts", id);
    const contractSnap = await getDoc(contractRef);

    if (!contractSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "Contract not found" },
        { status: 404 }
      );
    }

    const contractData = { id: contractSnap.id, ...contractSnap.data() };


    const companySlug = contractData.companyid;

    if (!companySlug) {
      return NextResponse.json(
        { success: false, error: "Company slug not found in contract" },
        { status: 400 }
      );
    }

    const companyQuery = query(
      collection(db, "companies"),
      where("companyslug", "==", companySlug)
    );



    const companySnap = await getDocs(companyQuery);

    if (companySnap.empty) {
      return NextResponse.json(
        { success: false, error: "Company not found for this slug" },
        { status: 404 }
      );
    }



    const clientRef = doc(db, "clients", contractData?.clientId);
    const clientSnap = await getDoc(clientRef);

    if (!clientSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 }
      );
    }



    const companyData = {
      id: companySnap.docs[0].id,
      ...companySnap.docs[0].data(),

    };



    return NextResponse.json({
      success: true,
      contract: {
        ...contractData,
        company: companyData,
        clientinfo: clientSnap.data(),
      },
    });

  } catch (error) {
    console.error("Error fetching company by slug:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
