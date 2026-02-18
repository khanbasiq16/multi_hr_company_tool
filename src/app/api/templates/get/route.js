import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Saari templates fetch karein
    const templateRef = collection(db, "templates");
    const templatesnapshot = await getDocs(templateRef);

    const rawTemplates = templatesnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 2. Har template ke liye company ka data fetch karein
    const enrichedTemplates = await Promise.all(
      rawTemplates.map(async (template) => {
        // Maan lete hain template.company mein sirf ID pari hai
        const companyId = template.company;

        if (companyId) {
          // Companies collection se is ID ka document nikalein
          const companyRef = doc(db, "companies", companyId);
          const companySnap = await getDoc(companyRef);

          if (companySnap.exists()) {
            // Agar company mil jaye to template ke company field mein pura data assign kar dein
            return {
              ...template,
              company: {
                id: companySnap.id,
                ...companySnap.data()
              }
            };
          }
        }

        // Agar company ID na ho ya data na mile to waisa hi bhej dein
        return template;
      })
    );


    return NextResponse.json({
      success: true,
      templates: enrichedTemplates
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching and mapping companies:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch data", error: error.message },
      { status: 500 }
    );
  }
}