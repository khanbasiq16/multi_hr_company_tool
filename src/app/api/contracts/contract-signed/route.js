import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      contractId,
      updatedFields,
      status,
      time,
      timezone,
      latitude,
      longitude,
      exactLocation,
      city,
      area,
      country,
      ip,
    } = body;


    if (!contractId) {
      return NextResponse.json({
        success: false,
        message: "contractId is required",
      });
    }

    const ref = doc(db, "contracts", contractId);

    await updateDoc(ref, {
      fields: updatedFields,
      status,
      signedAt: time,
      timezone,
      ip,
      location: {
        latitude,
        longitude,
        exactLocation,
        city,
        area,
        country,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Contract signed successfully",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
