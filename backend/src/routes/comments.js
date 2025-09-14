const express = require("express");
const {
  authMiddleware,
  optionalAuthMiddleware,
} = require("../middleware/auth");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

const router = express.Router();

// GET /api/comments/posts/:postId - Get comments for a post
router.get("/posts/:postId", optionalAuthMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
    };

    const comments = await Comment.findByPostId(postId, options);

    // Get author information for each comment
    const commentsWithAuthors = await Promise.all(
      comments.map(async (comment) => {
        const author = await User.findByFirebaseUid(comment.authorUid);
        return {
          ...comment,
          author: author
            ? {
                id: author._id,
                name: author.name,
                avatarUrl: author.avatarUrl,
              }
            : null,
        };
      })
    );

    res.json({
      success: true,
      data: commentsWithAuthors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: commentsWithAuthors.length,
      },
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch comments",
      message: error.message,
    });
  }
});

// POST /api/comments/posts/:postId - Add comment to a post
router.post("/posts/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { body } = req.body;
    const { uid } = req.user;

    // Validation
    if (!body || body.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Comment body is required",
      });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    const commentData = {
      postId,
      authorUid: uid,
      body: body.trim(),
    };

    const comment = await Comment.create(commentData);

    // Get author information
    const author = await User.findByFirebaseUid(uid);
    const commentWithAuthor = {
      ...comment,
      author: author
        ? {
            id: author._id,
            name: author.name,
            avatarUrl: author.avatarUrl,
          }
        : null,
    };

    res.status(201).json({
      success: true,
      data: commentWithAuthor,
    });
  } catch (error) {
    console.error("Create comment error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create comment",
      message: error.message,
    });
  }
});

// PUT /api/comments/:id - Update comment
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req.body;
    const { uid } = req.user;

    // Validation
    if (!body || body.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Comment body is required",
      });
    }

    const existingComment = await Comment.findById(id);
    if (!existingComment) {
      return res.status(404).json({
        success: false,
        error: "Comment not found",
      });
    }

    if (existingComment.authorUid !== uid) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this comment",
      });
    }

    const updateData = {
      body: body.trim(),
    };

    const updatedComment = await Comment.updateById(id, updateData, uid);

    // Get author information
    const author = await User.findByFirebaseUid(uid);
    const commentWithAuthor = {
      ...updatedComment,
      author: author
        ? {
            id: author._id,
            name: author.name,
            avatarUrl: author.avatarUrl,
          }
        : null,
    };

    res.json({
      success: true,
      data: commentWithAuthor,
    });
  } catch (error) {
    console.error("Update comment error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update comment",
      message: error.message,
    });
  }
});

// DELETE /api/comments/:id - Delete comment
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { uid } = req.user;

    const existingComment = await Comment.findById(id);
    if (!existingComment) {
      return res.status(404).json({
        success: false,
        error: "Comment not found",
      });
    }

    if (existingComment.authorUid !== uid) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this comment",
      });
    }

    const deleted = await Comment.deleteById(id, uid);

    if (deleted) {
      res.json({
        success: true,
        message: "Comment deleted successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to delete comment",
      });
    }
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete comment",
      message: error.message,
    });
  }
});

module.exports = router;
