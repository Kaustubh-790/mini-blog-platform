const express = require("express");
const {
  authMiddleware,
  optionalAuthMiddleware,
} = require("../middleware/auth");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");

const router = express.Router();

// GET /api/posts
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

    if (author) {
      filters.authorUid = author;
    }

    if (tags) {
      filters.tags = Array.isArray(tags) ? tags : [tags];
    }

    const posts = await Post.findAll(filters);

    const totalCount = await Post.getTotalCount(filters);

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
        total: totalCount,
        totalPages: Math.ceil(totalCount / parseInt(limit)),
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

// GET /api/posts/:id
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

    const author = await User.findByFirebaseUid(post.authorUid);

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

// POST /api/posts
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
      featuredImage,
      featuredImageAlt = "",
    } = req.body;
    const { uid } = req.user;

    if (!title || (!bodyMarkdown && !bodyHtml)) {
      return res.status(400).json({
        success: false,
        error: "Title and content are required",
      });
    }

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
      featuredImage: featuredImage || null,
      featuredImageAlt: featuredImageAlt || "",
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

// PUT /api/posts/:id
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      bodyMarkdown,
      bodyHtml,
      excerpt,
      category,
      tags,
      status,
      featuredImage,
      featuredImageAlt,
    } = req.body;
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
      if (status === "published" && existingPost.status !== "published") {
        updateData.publishedAt = new Date();
      }
    }

    if (featuredImage !== undefined) {
      updateData.featuredImage = featuredImage;
    }

    if (featuredImageAlt !== undefined) {
      updateData.featuredImageAlt = featuredImageAlt;
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

// DELETE /api/posts/:id
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

    await Comment.deleteByPostId(id);

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
