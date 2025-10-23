import { NextResponse } from "next/server";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signToken } from "@/lib/signToken";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    let userCredential;
    try {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      return NextResponse.json(
        { success: false, 
          error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const loggedInUser = userCredential.user;

    const userRef = doc(db, "employees", loggedInUser.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return NextResponse.json(
        { success: false, error: "Acount not found. Please Try Again" },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    let departmentData = null;
    if (userData.department) {
      const deptRef = collection(db, "departments");
      const deptQuery = query(deptRef, where("departmentName", "==", userData.department));
      const deptSnapshot = await getDocs(deptQuery);

    
      if (!deptSnapshot.empty) {
        departmentData = { id: deptSnapshot.docs[0].id, ...deptSnapshot.docs[0].data() };
      }
    }

    let companiesData = [];
    if (Array.isArray(userData.companyIds) && userData.companyIds.length > 0) {
      const companiesRef = collection(db, "companies");
      const companiesQuery = query(companiesRef, where("companyId", "in", userData.companyIds));
      const companiesSnapshot = await getDocs(companiesQuery);

      companiesData = companiesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

       let slug = userData?.employeeName.trim().replace(/\s+/g, "-").toLowerCase()


    const token = signToken({
      id: loggedInUser.uid,
      email: loggedInUser.email,
      role: "employee",
      slug : slug 
    });

    const response = NextResponse.json({
      message: "Login successfully",
      user: {
        role: "employee",
        ...userData,
        department: departmentData || null,
        companies: companiesData || [],
      },
      token,
      success: true,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("login error:", err);
    return NextResponse.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
}
