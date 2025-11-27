import { auth, db } from "@/lib/firebase";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    

    const body =  await req.json();
    const {
      companyIds, 
      companyName,
      employeeName,
      employeeAddress,
      employeeemail,
      employeepassword,
      employeePhone,
      employeeCNIC,
      employeeSalary,
      department,
      totalWorkingHours,
      dateOfJoining,
      salesTarget,
    } = body 





  
    if (!Array.isArray(companyIds) || companyIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one company must be selected" },
        { status: 400 }
      );
    }

    
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      employeeemail,
      employeepassword
    );

    const user = userCredential.user;
    const employeeId = user.uid;

   
    await setDoc(doc(collection(db, "employees"), employeeId), {
      employeeId,
      companyIds,
      companyName: companyName || "",
      employeeName,
      employeeAddress,
      employeeemail,
      employeePhone,
      employeeCNIC,
      employeeSalary,
      department,
      totalWorkingHours,
      dateOfJoining,
      Attendance: [],
      isCheckedin:false,
      isCheckedout:true,
      salesTarget: salesTarget || "",
      status: "active",
      createdAt: new Date().toISOString(),
    });

    
    const employeesCollection = collection(db, "employees");
    const snapshot = await getDocs(employeesCollection);

    const employees = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    
    return NextResponse.json(
      {
        success: true,
        message: "Employee created successfully",
        employees,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
