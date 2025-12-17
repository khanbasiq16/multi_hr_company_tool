import { adminDb, fcmAdmin } from "./firebaseAdmin";

export async function sendNotificationToEmail(email, expenseData) {
    try {
        // 1️⃣ Get user document by email
        const userSnapshot = await adminDb
            .collection("users")
            .where("email", "==", email)
            .limit(1)
            .get();

        if (userSnapshot.empty) {
            console.log("No user found with email:", email);
            return;
        }

        const userData = userSnapshot.docs[0].data();
        const token = userData.fcmToken;

        if (!token) {
            console.log("User has no FCM token:", email);
            return;
        }

        // 2️⃣ Prepare notification
        const message = {
            notification: {
                title: "New Expense Added",
                body: `${expenseData.Username} added an expense of ${expenseData.amount}`,
            },
            token, // single device
        };

        // 3️⃣ Send notification
        const response = await fcmAdmin.send(message);
        console.log("Push Notification sent to:", email, response);
    } catch (err) {
        console.error("FCM Error:", err);
    }
}
