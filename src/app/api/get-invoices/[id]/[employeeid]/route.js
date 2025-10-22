import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id, employeeid } = params;


    const invoicesQuery = query(
      collection(db, "invoices"),
      where("companySlug", "==", id),
      where("user_id", "==", employeeid)
    );

    const invoicesSnapshot = await getDocs(invoicesQuery);

    const employeeInvoices = invoicesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      {
        success: true,
        invoices: employeeInvoices,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch invoices",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
