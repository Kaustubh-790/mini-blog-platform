const express = require("express");
const {
  authMiddleware,
  optionalAuthMiddleware,
} = require("../middleware/auth");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

const router = express.Router();

// PUT /api/users/me - Update current user profile
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { uid } = req.user;
    const { name, bio, avatarUrl, twitter, linkedin, instagram } = req.body;

    console.log("Profile update request for UID:", uid);
    console.log("Request body:", req.body);

    // First ensure user exists (get or create)
    const { getUserByUid } = require("../config/firebase");
    const firebaseUser = await getUserByUid(uid);
    console.log("Firebase user:", firebaseUser);

    const user = await User.getOrCreate(firebaseUser);
    console.log("User after getOrCreate:", user);

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (bio !== undefined) {
      updateData.bio = bio.trim();
    }

    if (avatarUrl !== undefined) {
      updateData.avatarUrl = avatarUrl.trim();
    }

    if (twitter !== undefined && twitter.trim() !== "") {
      updateData.twitter = twitter.trim();
    }

    if (linkedin !== undefined && linkedin.trim() !== "") {
      updateData.linkedin = linkedin.trim();
    }

    if (instagram !== undefined && instagram.trim() !== "") {
      updateData.instagram = instagram.trim();
    }

    // Validation
    if (updateData.name && updateData.name.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Name cannot be empty",
      });
    }

    console.log("About to update user with data:", updateData);
    const updatedUser = await User.updateByFirebaseUid(uid, updateData);
    console.log("Updated user result:", updatedUser);

    if (!updatedUser) {
      console.log("User not found after update attempt");
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        id: updatedUser._id,
        firebaseUid: updatedUser.firebaseUid,
        name: updatedUser.name,
        bio: updatedUser.bio,
        avatarUrl: updatedUser.avatarUrl,
        twitter: updatedUser.twitter,
        linkedin: updatedUser.linkedin,
        instagram: updatedUser.instagram,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update user profile",
      message: error.message,
    });
  }
});

// GET /api/users/me/posts - Get current user's posts (including drafts)
router.get("/me/posts", authMiddleware, async (req, res) => {
  try {
    const { uid } = req.user;
    const { includeDrafts = "true" } = req.query;

    const posts = await Post.findByAuthor(uid, includeDrafts === "true");

    res.json({
      success: true,
      data: posts.map((post) => ({
        id: post._id,
        title: post.title,
        slug: post.slug,
        tags: post.tags,
        status: post.status,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Get user posts error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user posts",
      message: error.message,
    });
  }
});

// GET /api/users/me/comments - Get current user's comments
router.get("/me/comments", authMiddleware, async (req, res) => {
  try {
    const { uid } = req.user;
    const { page = 1, limit = 20 } = req.query;

    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
    };

    const comments = await Comment.findByAuthor(uid, options);

    // Get post information for each comment
    const commentsWithPosts = await Promise.all(
      comments.map(async (comment) => {
        const post = await Post.findById(comment.postId);
        return {
          ...comment,
          post: post
            ? {
                id: post._id,
                title: post.title,
                slug: post.slug,
              }
            : null,
        };
      })
    );

    res.json({
      success: true,
      data: commentsWithPosts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: commentsWithPosts.length,
      },
    });
  } catch (error) {
    console.error("Get user comments error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user comments",
      message: error.message,
    });
  }
});

// GET /api/users/me/settings - Get current user's settings
router.get("/me/settings", authMiddleware, async (req, res) => {
  try {
    const { uid } = req.user;

    // First ensure user exists (get or create)
    const { getUserByUid } = require("../config/firebase");
    const firebaseUser = await getUserByUid(uid);
    const user = await User.getOrCreate(firebaseUser);

    // Return user settings or default settings if none exist
    const settings = user.settings || {
      preferences: {
        theme: "light",
        autoSave: true,
        draftsRetention: 30,
      },
    };

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Get user settings error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user settings",
      message: error.message,
    });
  }
});

// PUT /api/users/me/settings - Update current user's settings
router.put("/me/settings", authMiddleware, async (req, res) => {
  try {
    const { uid } = req.user;
    const { preferences } = req.body;

    // First ensure user exists (get or create)
    const { getUserByUid } = require("../config/firebase");
    const firebaseUser = await getUserByUid(uid);
    const user = await User.getOrCreate(firebaseUser);

    const settingsData = {};

    if (preferences) {
      settingsData.preferences = {
        theme: preferences.theme || "light",
        autoSave: Boolean(preferences.autoSave),
        draftsRetention: Math.max(
          1,
          Math.min(365, parseInt(preferences.draftsRetention) || 30)
        ),
      };
    }

    const updatedUser = await User.updateSettings(uid, settingsData);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: updatedUser.settings,
    });
  } catch (error) {
    console.error("Update user settings error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update user settings",
      message: error.message,
    });
  }
});

// DELETE /api/users/me - Delete current user account
router.delete("/me", authMiddleware, async (req, res) => {
  try {
    const { uid } = req.user;

    // Delete user's posts
    await Post.deleteByAuthor(uid);

    // Delete user's comments
    await Comment.deleteByAuthor(uid);

    // Delete user profile
    const deleted = await User.deleteByFirebaseUid(uid);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete user account error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete account",
      message: error.message,
    });
  }
});

// GET /api/users/:id - Get user profile by ID (must be last to avoid conflicts)
router.get("/:id", optionalAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Get user's published posts
    const posts = await Post.findByAuthor(user.firebaseUid, false);

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        posts: posts.map((post) => ({
          id: post._id,
          title: post.title,
          slug: post.slug,
          tags: post.tags,
          publishedAt: post.publishedAt,
          createdAt: post.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user profile",
      message: error.message,
    });
  }
});

module.exports = router;
