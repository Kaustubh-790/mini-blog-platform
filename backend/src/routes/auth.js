const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const { getUserByUid } = require("../config/firebase");
const User = require("../models/User");

const router = express.Router();

// GET /api/auth/me
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const { uid } = req.user;

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

// POST /api/auth/sync
router.post("/sync", authMiddleware, async (req, res) => {
  try {
    const { uid } = req.user;

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
    console.error("Sync user error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to sync user profile",
      message: error.message,
    });
  }
});

module.exports = router;
