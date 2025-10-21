import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      totalCalls,
      followUps,
      followUpNames,
      newLeads,
      salesClosed,
      meetings,
      notes,
      satisfaction,
      employeeId,
    } = body;

    if (!employeeId) {
      return NextResponse.json(
        { success: false, message: "Employee ID is required" },
        { status: 400 }
      );
    }

    const summaryId = uuidv4();

    const summaryRef = doc(db, "summarywork", employeeId);

    const summaryData = {
      id: summaryId,
      employeeId,
      totalCalls,
      followUps,
      followUpNames,
      newLeads,
      salesClosed,
      meetings,
      notes,
      satisfaction,
      createdAt: new Date().toISOString(),
    };

    await setDoc(summaryRef, summaryData);

    return NextResponse.json(
      {
        success: true,
        message: "Summary work document saved successfully",
        summary: summaryData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 Error in /api/summarywork:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
