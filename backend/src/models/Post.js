const { getDB } = require("../config/database");
const { ObjectId } = require("mongodb");

class Post {
  constructor(data) {
    this.authorUid = data.authorUid;
    this.title = data.title;
    this.slug = data.slug;
    this.bodyMarkdown = data.bodyMarkdown || "";
    this.bodyHtml = data.bodyHtml || "";
    this.excerpt = data.excerpt || "";
    this.category = data.category || "General";
    this.tags = data.tags || [];
    this.status = data.status || "draft";
    this.featuredImage = data.featuredImage || null;
    this.featuredImageAlt = data.featuredImageAlt || "";
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.publishedAt = data.publishedAt || null;
  }

  static async create(postData) {
    const db = getDB();
    const post = new Post(postData);

    const result = await db.collection("posts").insertOne(post);
    return { ...post, _id: result.insertedId };
  }

  static async findById(id) {
    const db = getDB();
    return await db.collection("posts").findOne({ _id: new ObjectId(id) });
  }

  static async findBySlug(slug) {
    const db = getDB();
    return await db.collection("posts").findOne({ slug });
  }

  static async findAll(filters = {}) {
    const db = getDB();
    const query = {};

    // Apply filters
    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.authorUid) {
      query.authorUid = filters.authorUid;
    }

    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    // Default to published posts if no status filter
    if (!filters.status) {
      query.status = "published";
    }

    const sortField = filters.sortBy || "publishedAt";
    const sortOrder = filters.sortOrder === "asc" ? 1 : -1;

    return await db
      .collection("posts")
      .find(query)
      .sort({ [sortField]: sortOrder })
      .limit(filters.limit || 20)
      .skip(filters.skip || 0)
      .toArray();
  }

  static async getTotalCount(filters = {}) {
    const db = getDB();
    const query = {};

    // Apply filters (same as findAll)
    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.authorUid) {
      query.authorUid = filters.authorUid;
    }

    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    // Default to published posts if no status filter
    if (!filters.status) {
      query.status = "published";
    }

    return await db.collection("posts").countDocuments(query);
  }

  static async updateById(id, updateData, authorUid) {
    const db = getDB();
    updateData.updatedAt = new Date();

    const result = await db
      .collection("posts")
      .findOneAndUpdate(
        { _id: new ObjectId(id), authorUid },
        { $set: updateData },
        { returnDocument: "after" }
      );

    return result.value;
  }

  static async deleteById(id, authorUid) {
    const db = getDB();
    const result = await db.collection("posts").deleteOne({
      _id: new ObjectId(id),
      authorUid,
    });
    return result.deletedCount > 0;
  }

  static async findByAuthor(authorUid, includeDrafts = false) {
    const db = getDB();
    const query = { authorUid };

    if (!includeDrafts) {
      query.status = "published";
    }

    return await db
      .collection("posts")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
  }

  // Generate slug from title
  static generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .trim("-"); // Remove leading/trailing hyphens
  }

  // Check if slug is unique
  static async isSlugUnique(slug, excludeId = null) {
    const db = getDB();
    const query = { slug };

    if (excludeId) {
      query._id = { $ne: new ObjectId(excludeId) };
    }

    const existing = await db.collection("posts").findOne(query);
    return !existing;
  }

  // Get unique slug (handles duplicates)
  static async getUniqueSlug(title, excludeId = null) {
    let baseSlug = this.generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    while (!(await this.isSlugUnique(slug, excludeId))) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
}

module.exports = Post;
