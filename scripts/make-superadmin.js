/**
 * One-time script to set a user's role to superAdmin in Firestore.
 * Run: node scripts/make-superadmin.js
 *
 * Requires environment variables (uses .env.local via dotenv).
 */

require("dotenv").config({ path: ".env" });
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId:   process.env.NEXT_FIREBASE_PROJECT_ID,
      clientEmail: process.env.NEXT_FIREBASE_CLIENT_EMAIL,
      privateKey:  process.env.NEXT_FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

const db   = admin.firestore();
const auth = admin.auth();

const TARGET_EMAIL = "khanbasiq16@gmail.com";

async function run() {
  console.log(`Looking up user: ${TARGET_EMAIL}`);

  // Find the Firebase Auth user by email
  let authUser;
  try {
    authUser = await auth.getUserByEmail(TARGET_EMAIL);
  } catch (err) {
    console.error("User not found in Firebase Auth:", err.message);
    process.exit(1);
  }

  const uid = authUser.uid;
  console.log(`Found Auth user — UID: ${uid}`);

  // Read existing Firestore doc
  const ref = db.collection("users").doc(uid);
  const snap = await ref.get();

  if (!snap.exists) {
    console.error(`No Firestore users/${uid} document found. Make sure the user has signed in at least once.`);
    process.exit(1);
  }

  const data = snap.data();
  console.log(`Current role: ${data.role}`);

  if (data.role === "superAdmin") {
    console.log("Already a superAdmin. Nothing to do.");
    process.exit(0);
  }

  await ref.update({ role: "superAdmin" });
  console.log(`Role updated to superAdmin for ${TARGET_EMAIL} (uid: ${uid})`);
  process.exit(0);
}

run().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
