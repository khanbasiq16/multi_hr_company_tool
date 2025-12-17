import { sendNotificationToEmail } from "@/lib/sendNotificationToEmail";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { email, Username, amount } = await req.json();


        await sendNotificationToEmail(email, { Username, amount });

        return NextResponse.json(
            { success: true, message: "Notification sent" },
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, error: "Failed to send notification" },
            { status: 500 }
        );
    }
}
