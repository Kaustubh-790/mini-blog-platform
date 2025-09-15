const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const { getUserByUid } = require("../config/firebase");
const User = require("../models/User");

const router = express.Router();

// GET /api/auth/me - Get current user profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const { uid } = req.user;

    // Get or create user profile
    const firebaseUser = await getUserByUid(uid);
    const user = await User.getOrCreate(firebaseUser);

    res.json({
      success: true,
      data: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        email: user.email || firebaseUser.email,
        emailVerified: firebaseUser.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get user profile",
      message: error.message,
    });
  }
});

// POST /api/auth/sync - Sync Firebase user with database
router.post("/sync", authMiddleware, async (req, res) => {
  try {
    const { uid } = req.user;
    console.log("🔄 Syncing user with UID:", uid);

    // Get Firebase user data
    const firebaseUser = await getUserByUid(uid);
    console.log("📋 Firebase user data:", {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
    });

    // Get or create user profile
    const user = await User.getOrCreate(firebaseUser);
    console.log("✅ User synced successfully:", {
      id: user._id,
      firebaseUid: user.firebaseUid,
      name: user.name,
    });

    res.json({
      success: true,
      data: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        email: user.email || firebaseUser.email,
        emailVerified: firebaseUser.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("❌ Sync user error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to sync user profile",
      message: error.message,
    });
  }
});

// Test endpoint to force create a user
router.post("/test-create", async (req, res) => {
  try {
    console.log("🧪 Testing user creation...");

    const testUserData = {
      firebaseUid: `test-user-${Date.now()}`,
      name: "Test User",
      bio: "Test bio",
      avatarUrl: "https://example.com/test.jpg",
    };

    console.log("🧪 Creating test user with data:", testUserData);
    const user = await User.create(testUserData);
    console.log("🧪 Test user created:", user);

    res.json({
      success: true,
      message: "Test user created successfully",
      data: user,
    });
  } catch (error) {
    console.error("🧪 Test user creation failed:", error);
    res.status(500).json({
      success: false,
      error: "Test user creation failed",
      message: error.message,
    });
  }
});

// Test endpoint to list all users
router.get("/test-list-users", async (req, res) => {
  try {
    console.log("📋 Listing all users...");
    const { getDB } = require("../config/database");
    const db = getDB();

    const users = await db.collection("users").find({}).toArray();
    console.log("📋 Found users:", users.length);
    console.log("📋 Users:", users);

    res.json({
      success: true,
      message: `Found ${users.length} users`,
      data: users,
    });
  } catch (error) {
    console.error("📋 Failed to list users:", error);
    res.status(500).json({
      success: false,
      error: "Failed to list users",
      message: error.message,
    });
  }
});

module.exports = router;
