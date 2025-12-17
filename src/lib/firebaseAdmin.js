import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_FIREBASE_PROJECT_ID,
      clientEmail: process.env.NEXT_FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.NEXT_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const adminAuth = admin.auth();
const adminDb = admin.firestore();

// ✅ Add Firebase Cloud Messaging
const fcmAdmin = admin.messaging();

export { admin, adminAuth, adminDb , fcmAdmin };
