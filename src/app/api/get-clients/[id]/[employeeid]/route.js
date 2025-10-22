import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id, employeeid } = params; 

    console.log(id)

    const companyQuery = query(
      collection(db, "companies"),
      where("companyslug", "==", id)
    );
    const companySnapshot = await getDocs(companyQuery);

    if (companySnapshot.empty) {
      return NextResponse.json(
        { success: false, message: "No company found with this slug" },
        { status: 404 }
      );
    }

    const companyData = companySnapshot.docs[0].data();
    const companyId = companyData?.companyId;



 
    const clientsQuery = query(
      collection(db, "clients"),
      where("companyId", "==", companyId),
      where("userid", "==", employeeid)
    );

    const clientSnapshot = await getDocs(clientsQuery);
    const employeeClients = clientSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      {
        success: true,
        clients: employeeClients,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch clients",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
