import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const body = await req.json();
    const { departmentName, description } = body;

    if (!departmentName) {
      return NextResponse.json(
        { error: "Department name is required" },
        { status: 400 }
      );
    }

    const departmentId = uuidv4();

    const newDepartment = {
      departmentId,
      departmentName,
      description: description || "",
      createdAt: Date.now(),
    };

    await  setDoc(doc(db, "departments", departmentId), newDepartment);

    const querySnapshot = await getDocs(collection(db, "departments"));
    const departments = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    

    return NextResponse.json({
      success: true,
      message: "Department created successfully",
      departments,
    });
  } catch (error) {
    console.error("Error creating department:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
