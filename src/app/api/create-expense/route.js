import { NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // Your Firebase init file
import { collection, addDoc, Timestamp, getDocs } from "firebase/firestore";
import { Readable } from "stream";

import { v4 as uuidv4 } from "uuid";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const expenseName = formData.get("expenseName");
    const price = formData.get("price");
    const description = formData.get("description");
    const file = formData.get("attachment");

    if (!expenseName || !price || !file) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadFromBuffer = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "expenses_attachments" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        Readable.from(buffer).pipe(stream);
      });

    const uploadResult = await uploadFromBuffer();

    const expenseId = uuidv4();

    const docRef = await addDoc(collection(db, "expenses"), {
      expenseId,
      expenseName,
      price: Number(price),
      description,
      attachmentUrl: uploadResult.secure_url,
      createdAt: Timestamp.now(),
    });

      const companiesRef = collection(db, "expenses");
    
        const snapshot = await getDocs(companiesRef);
    
        const expenses = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

    return NextResponse.json({ success: true, expenses });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
