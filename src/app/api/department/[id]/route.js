import { NextResponse } from "next/server";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Department ID is required" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const departmentRef = doc(db, "departments", id);

   
    const deptSnap = await getDoc(departmentRef);
    if (!deptSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "Department not found" },
        { status: 404 }
      );
    }

    await updateDoc(departmentRef, body);

    return NextResponse.json({
      success: true,
      message: "Department updated successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
