import { NextResponse } from "next/server";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const body = await req.json();

    const companySlug = body.companyName;
    const clientEmail = body.clientEmail;
    const employeeid = body.employeeid;

    const q1 = query(
      collection(db, "companies"),
      where("companyslug", "==", companySlug)
    );
    const querySnapshot = await getDocs(q1);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { success: false, error: "Company not found" },
        { status: 404 }
      );
    }

    const companyDoc = querySnapshot.docs[0];
    const companyData = { id: companyDoc.id, ...companyDoc.data() };

    const q2 = query(
      collection(db, "clients"),
      where("clientEmail", "==", clientEmail)
    );
    const existingClientSnapshot = await getDocs(q2);

    if (!existingClientSnapshot.empty) {
      return NextResponse.json(
        { success: false, error: "Client already exists with this email" },
        { status: 400 }
      );
    }

    const clientId = uuidv4();

    const clientData = {
      id: clientId,
      companyId: companyData.id,
      userid: employeeid,
      companyName: companyData.name,
      clientName: body.clientName,
      clientEmail: clientEmail,
      clientAddress: body.clientAddress,
      clientPhone: body.clientPhone,
      projectsDetails: body.projectsDetails,
      packageDetails: body.packageDetails,
      clientWebsite: body.clientWebsite,
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "clients", clientId), clientData);

    await updateDoc(doc(db, "companies", companyData.id), {
      AssignClient: arrayUnion(clientId),
    });

    const allClientsQuery = query(
      collection(db, "clients"),
      where("companyId", "==", companyData.id)
    );
    const snapshot = await getDocs(allClientsQuery);

    const allclients = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    const employeeClients = allclients.filter(
      (client) => client.userid === employeeid
    );

    return NextResponse.json({ success: true, allclients: employeeClients });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
