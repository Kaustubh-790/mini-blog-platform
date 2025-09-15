const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config();

const initializeFirebase = () => {
  try {
    if (admin.apps.length === 0) {
      const serviceAccountPath = path.join(
        __dirname,
        "../../firebase-adminsdk.json"
      );

      if (
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY &&
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim() !== ""
      ) {
        try {
          const serviceAccount = JSON.parse(
            process.env.FIREBASE_SERVICE_ACCOUNT_KEY
          );
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: process.env.FIREBASE_PROJECT_ID || "mini-blog-platform",
          });
        } catch (parseError) {
          console.warn(
            "Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY, falling back to service account file"
          );

          admin.initializeApp({
            credential: admin.credential.cert(serviceAccountPath),
            projectId: process.env.FIREBASE_PROJECT_ID || "mini-blog-platform",
          });
        }
      } else {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccountPath),
          projectId: process.env.FIREBASE_PROJECT_ID || "mini-blog-platform",
        });
      }

      console.log("Firebase Admin SDK initialized");
    }

    return admin;
  } catch (error) {
    console.error("Firebase Admin SDK initialization error:", error);
    throw error;
  }
};

const verifyIdToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error("Token verification error:", error);
    throw new Error("Invalid token");
  }
};

const getUserByUid = async (uid) => {
  try {
    const userRecord = await admin.auth().getUser(uid);
    return userRecord;
  } catch (error) {
    console.error("Error getting user:", error);
    throw new Error("User not found");
  }
};

module.exports = {
  initializeFirebase,
  verifyIdToken,
  getUserByUid,
  admin,
};
