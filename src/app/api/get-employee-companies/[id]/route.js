import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Employee ID is required" },
        { status: 400 }
      );
    }

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

    if (companyIds.length === 0) {
      return NextResponse.json({
        success: true,
        employee: { id: empSnap.id, ...employeeData },
        companies: [],
      });
    }

    const companiesRef = collection(db, "companies");

    let companyDocs = [];

    for (let i = 0; i < companyIds.length; i += 10) {
      const batch = companyIds.slice(i, i + 10);
      const q = query(companiesRef, where("__name__", "in", batch));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        companyDocs.push({ id: doc.id, ...doc.data() });
      });
    }

    return NextResponse.json({
      success: true,
      employee: { id: empSnap.id, ...employeeData },
      companies: companyDocs,
    });

  } catch (error) {
    console.error("Error fetching employee and companies:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
