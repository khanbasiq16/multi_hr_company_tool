import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function GET(req, { params }) {
  const id = params.id;

  try {
    const empRef = doc(db, "employees", id);
    const empSnap = await getDoc(empRef);

    if (!empSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "Employee not found" },
        { status: 404 }
      );
    }

    const employeeData = empSnap.data();

    const companyIds = employeeData.companyIds || [];

    let companiesData = [];

    if (companyIds.length > 0) {
      const companiesRef = collection(db, "companies");
      const q = query(companiesRef, where("companyId", "in", companyIds)); 
      const querySnap = await getDocs(q);

      companiesData = querySnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    return NextResponse.json(
      {
        success: true,
        employee: employeeData,
        companies: companiesData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
