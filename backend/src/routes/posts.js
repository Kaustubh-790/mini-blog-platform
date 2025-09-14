const express = require("express");
const {
  authMiddleware,
  optionalAuthMiddleware,
} = require("../middleware/auth");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");

const router = express.Router();

// GET /api/posts - List posts with optional filters
router.get("/", optionalAuthMiddleware, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      author,
      tags,
      sortBy = "publishedAt",
      sortOrder = "desc",
    } = req.query;

    const filters = {
      status: status || "published",
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      sortBy,
      sortOrder,
    };

    // Add author filter if provided
    if (author) {
      filters.authorUid = author;
    }

    // Add tags filter if provided
    if (tags) {
      filters.tags = Array.isArray(tags) ? tags : [tags];
    }

    const posts = await Post.findAll(filters);

    // Get author information for each post
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        const author = await User.findByFirebaseUid(post.authorUid);
        return {
          ...post,
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
      data: postsWithAuthors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: postsWithAuthors.length,
      },
    });
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch posts",
      message: error.message,
    });
  }
});

// GET /api/posts/:id - Get single post
router.get("/:id", optionalAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    // Get author information
    const author = await User.findByFirebaseUid(post.authorUid);

    // Get comment count
    const commentCount = await Comment.countByPostId(id);

    const postWithDetails = {
      ...post,
      author: author
        ? {
            id: author._id,
            name: author.name,
            avatarUrl: author.avatarUrl,
          }
        : null,
      commentCount,
    };

    res.json({
      success: true,
      data: postWithDetails,
    });
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch post",
      message: error.message,
    });
  }
});

// POST /api/posts - Create new post
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      bodyMarkdown,
      bodyHtml,
      excerpt,
      category = "General",
      tags = [],
      status = "draft",
    } = req.body;
    const { uid } = req.user;

    // Validation
    if (!title || (!bodyMarkdown && !bodyHtml)) {
      return res.status(400).json({
        success: false,
        error: "Title and content are required",
      });
    }

    // Generate unique slug
    const slug = await Post.getUniqueSlug(title);

    const postData = {
      authorUid: uid,
      title,
      slug,
      bodyMarkdown: bodyMarkdown || "",
      bodyHtml: bodyHtml || "",
      excerpt: excerpt || "",
      category: category || "General",
      tags: Array.isArray(tags) ? tags : [],
      status,
      publishedAt: status === "published" ? new Date() : null,
    };

    const post = await Post.create(postData);

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create post",
      message: error.message,
    });
  }
});

// PUT /api/posts/:id - Update post
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, bodyMarkdown, bodyHtml, excerpt, category, tags, status } =
      req.body;
    const { uid } = req.user;

    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    if (existingPost.authorUid !== uid) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this post",
      });
    }

    const updateData = {};

    if (title !== undefined) {
      updateData.title = title;
      // Generate new slug if title changed
      if (title !== existingPost.title) {
        updateData.slug = await Post.getUniqueSlug(title, id);
      }
    }

    if (bodyMarkdown !== undefined) {
      updateData.bodyMarkdown = bodyMarkdown;
    }

    if (bodyHtml !== undefined) {
      updateData.bodyHtml = bodyHtml;
    }

    if (excerpt !== undefined) {
      updateData.excerpt = excerpt;
    }

    if (category !== undefined) {
      updateData.category = category;
    }

    if (tags !== undefined) {
      updateData.tags = Array.isArray(tags) ? tags : [];
    }

    if (status !== undefined) {
      updateData.status = status;
      // Set publishedAt if status changed to published
      if (status === "published" && existingPost.status !== "published") {
        updateData.publishedAt = new Date();
      }
    }

    const updatedPost = await Post.updateById(id, updateData, uid);

    res.json({
      success: true,
      data: updatedPost,
    });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update post",
      message: error.message,
    });
  }
});

// DELETE /api/posts/:id - Delete post
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { uid } = req.user;

    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    if (existingPost.authorUid !== uid) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this post",
      });
    }

    // Delete associated comments
    await Comment.deleteByPostId(id);

    // Delete the post
    const deleted = await Post.deleteById(id, uid);

    if (deleted) {
      res.json({
        success: true,
        message: "Post deleted successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to delete post",
      });
    }
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete post",
      message: error.message,
    });
  }
});

module.exports = router;
