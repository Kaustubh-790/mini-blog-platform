const express = require("express");
const {
  authMiddleware,
  optionalAuthMiddleware,
} = require("../middleware/auth");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

const router = express.Router();

// GET /api/users/:id - Get user profile by ID
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

// PUT /api/users/me - Update current user profile
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { uid } = req.user;
    const { name, bio, avatarUrl } = req.body;

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

    // Validation
    if (updateData.name && updateData.name.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Name cannot be empty",
      });
    }

    const updatedUser = await User.updateByFirebaseUid(uid, updateData);

    if (!updatedUser) {
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

module.exports = router;
