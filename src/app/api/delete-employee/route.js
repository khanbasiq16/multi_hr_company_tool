import { auth, db } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  deleteUser,
  getAuth,
} from "firebase/auth";
import {
  doc,
  deleteDoc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { employeeIds } = await req.json();

    if (!employeeIds || employeeIds.length === 0) {
      return NextResponse.json(
        { message: "No employee IDs provided" },
        { status: 400 }
      );
    }

    const deletedEmployees = [];

    for (const id of employeeIds) {
      const employeeRef = doc(db, "employees", id);
      const employeeSnap = await getDoc(employeeRef);

      if (!employeeSnap.exists()) continue;

      const employeeData = employeeSnap.data();
      const { email, password } = employeeData; 

      if (!email || !password) {
        console.log(`⚠️ Missing credentials for employee ID: ${id}`);
        continue;
      }

      try {
       
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
     
        await deleteUser(userCredential.user);
       
        await deleteDoc(employeeRef);

        deletedEmployees.push({ id, email });
      } catch (error) {
        console.log(`⚠️ Could not delete user ${email}:`, error.message);
      }
    }
    
    const employeeCollection = collection(db, "employees");
    const snapshot = await getDocs(employeeCollection);
    const employees = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      message: `Deleted ${deletedEmployees.length} employee(s) successfully.`,
      deletedEmployees,
      employees,
    });
  } catch (error) {
    console.error("❌ Error deleting employees:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
