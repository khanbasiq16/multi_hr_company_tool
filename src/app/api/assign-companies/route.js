import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const { employeeId, companyIds } = await req.json();

    if (!employeeId || !Array.isArray(companyIds)) {
      return NextResponse.json(
        { success: false, message: "Invalid payload" },
        { status: 400 }
      );
    }

    const empRef = doc(db, "employees", employeeId);
    const empSnap = await getDoc(empRef);

    if (!empSnap.exists()) {
      return NextResponse.json(
        { success: false, message: "Employee not found" },
        { status: 404 }
      );
    }

    await updateDoc(empRef, {
      companyIds:companyIds,
    });

    return NextResponse.json({
      success: true,
      message: "Companies assigned successfully",
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
