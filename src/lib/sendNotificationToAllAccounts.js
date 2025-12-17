const { adminDb, fcmAdmin } = require("./firebaseAdmin");

export async function sendNotificationToAllAccounts(expenseData) {
    try {
        // 1️⃣ Get all users from "Accounts" collection
        const accountsSnapshot = await adminDb.collection("Accounts").get();
        const tokens = [];

        accountsSnapshot.forEach((doc) => {
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
        console.log("Push Notifications sent to Accounts:", response.successCount);
    } catch (err) {
        console.error("FCM Error:", err);
    }
}
