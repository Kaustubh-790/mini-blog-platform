const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config();

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length === 0) {
      // Try to use service account key file first
      const serviceAccountPath = path.join(
        __dirname,
        "../../firebase-adminsdk.json"
      );

      if (
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY &&
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim() !== ""
      ) {
        // Use environment variable (for production)
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
          // Fall back to service account file
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccountPath),
            projectId: process.env.FIREBASE_PROJECT_ID || "mini-blog-platform",
          });
        }
      } else {
        // Use service account file (for development)
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

// Verify Firebase ID token
const verifyIdToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error("Token verification error:", error);
    throw new Error("Invalid token");
  }
};

// Get user by UID
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
