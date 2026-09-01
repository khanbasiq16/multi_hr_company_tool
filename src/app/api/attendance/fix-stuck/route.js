import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { formatKarachiDate as getKarachiDateStr } from "@/lib/attendanceTime"; // DD/MM/YYYY

export async function POST() {
  try {
    const snapshot = await adminDb
      .collection("employees")
      .where("isCheckedin", "==", true)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ success: true, message: "No stuck employees found.", reset: 0 });
    }

    const todayStr = getKarachiDateStr();
    const batch    = adminDb.batch();
    const reset    = [];

    snapshot.forEach((docSnap) => {
      const data      = docSnap.data();
      const startTime = data.startTime;

      // Only reset if startTime is from a previous day (or missing)
      let shouldReset = true;
      if (startTime) {
        const startDateStr = getKarachiDateStr(new Date(startTime));
        if (startDateStr === todayStr) {
          shouldReset = false; // still in today's shift — don't touch
        }
      }

      if (shouldReset) {
        batch.update(docSnap.ref, {
          isCheckedin:  false,
          isCheckedout: false,
          startTime:    null,
          attendanceid: "",
        });
        reset.push({ id: docSnap.id, name: data.employeeName || docSnap.id });
      }
    });

    await batch.commit();

    return NextResponse.json({
      success: true,
      message: `Reset ${reset.length} stuck employee(s).`,
      reset,
    });
  } catch (err) {
    console.error("fix-stuck error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
