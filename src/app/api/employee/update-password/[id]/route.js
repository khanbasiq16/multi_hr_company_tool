import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { sendpassowrdEmail } from "@/lib/SendpasswordEmail";

export async function POST(req, { params }) {
  try {
    const { id } = params;
    const { oldPassword, newPassword, confirmPassword } = await req.json();

    if (!oldPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: "Passwords do not match" },
        { status: 400 }
      );
    }

    const employeeRef = doc(db, "employees", id);
    const employeeSnap = await getDoc(employeeRef);

    if (!employeeSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "Employee not found" },
        { status: 404 }
      );
    }

    const employeeData = employeeSnap.data();
    const employeeemail = employeeData.employeeemail;

    if (!employeeemail) {
      return NextResponse.json(
        { success: false, error: "Employee email not found" },
        { status: 400 }
      );
    }

    // Step 2: Sign in using old password
    const userCredential = await signInWithEmailAndPassword(
      auth,
      employeeemail,
      oldPassword
    );
    const user = userCredential.user;

    await updatePassword(user, newPassword);

    await updateDoc(employeeRef, { updatedAt: new Date().toISOString() });

    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #4CAF50;">Password Updated Successfully 🔒</h2>
        <p>Hi <strong>${employeeemail}</strong>,</p>
        <p>Your password was updated successfully.</p>
        <p>If this wasn’t you, please contact support immediately.</p>
        <br/>
        <p>Best regards,<br/><strong>Brintor Management Team</strong></p>
      </div>
    `;

    await sendpassowrdEmail({
      to: employeeemail,
      subject: "Password Updated Successfully",
      html: htmlTemplate,
    });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error updating password:", error);

    let message = "An error occurred";
    if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
      message = "Old password is incorrect";
    } else if (error.code === "auth/user-not-found") {
      message = "No account found for this email";
    } else if (error.code === "auth/weak-password") {
      message = "New password is too weak";
    }

    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
