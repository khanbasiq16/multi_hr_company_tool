const { adminDb, fcmAdmin } = require("./firebaseAdmin");

export async function sendNotificationToAdmins(expenseData) {
    try {
        // 1️⃣ Get all admin users
        const adminSnapshot = await adminDb.collection("Users").get();
        const tokens = [];

        adminSnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.fcmToken) tokens.push(data.fcmToken);
        });

        if (tokens.length === 0) return;

        // 2️⃣ Prepare notification
        const message = {
            notification: {
                title: "New Expense Added",
                body: `${expenseData.Username} added an expense of ${expenseData.amount}`,
            },
            tokens,
        };

        // 3️⃣ Send notification
        const response = await fcmAdmin.sendMulticast(message);
        console.log("Push Notifications sent:", response.successCount);
    } catch (err) {
        console.error("FCM Error:", err);
    }
}
