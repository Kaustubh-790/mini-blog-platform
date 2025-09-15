const { getDB } = require("../config/database");
const { ObjectId } = require("mongodb");

class Comment {
  constructor(data) {
    this.postId = new ObjectId(data.postId);
    this.authorUid = data.authorUid;
    this.body = data.body;
    this.likes = data.likes || [];
    this.likeCount = data.likeCount || 0;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static async create(commentData) {
    const db = getDB();
    const comment = new Comment(commentData);

    const result = await db.collection("comments").insertOne(comment);
    return { ...comment, _id: result.insertedId };
  }

  static async findById(id) {
    const db = getDB();
    return await db.collection("comments").findOne({ _id: new ObjectId(id) });
  }

  static async findByPostId(postId, options = {}) {
    const db = getDB();
    const limit = options.limit || 50;
    const skip = options.skip || 0;

    return await db
      .collection("comments")
      .find({ postId: new ObjectId(postId) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .toArray();
  }

  static async findByAuthor(authorUid, options = {}) {
    const db = getDB();
    const limit = options.limit || 20;
    const skip = options.skip || 0;

    return await db
      .collection("comments")
      .find({ authorUid })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .toArray();
  }

  static async updateById(id, updateData, authorUid) {
    const db = getDB();
    updateData.updatedAt = new Date();

    const result = await db
      .collection("comments")
      .findOneAndUpdate(
        { _id: new ObjectId(id), authorUid },
        { $set: updateData },
        { returnDocument: "after" }
      );

    return result.value;
  }

  static async deleteById(id, authorUid) {
    const db = getDB();
    const result = await db.collection("comments").deleteOne({
      _id: new ObjectId(id),
      authorUid,
    });
    return result.deletedCount > 0;
  }

  static async countByPostId(postId) {
    const db = getDB();
    return await db.collection("comments").countDocuments({
      postId: new ObjectId(postId),
    });
  }

  static async deleteByPostId(postId) {
    const db = getDB();
    const result = await db.collection("comments").deleteMany({
      postId: new ObjectId(postId),
    });
    return result.deletedCount;
  }

  static async likeComment(id, userUid) {
    const db = getDB();
    const result = await db.collection("comments").findOneAndUpdate(
      { _id: new ObjectId(id), likes: { $ne: userUid } },
      {
        $push: { likes: userUid },
        $inc: { likeCount: 1 },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "after" }
    );
    return result.value;
  }

  static async unlikeComment(id, userUid) {
    const db = getDB();
    const result = await db.collection("comments").findOneAndUpdate(
      { _id: new ObjectId(id), likes: userUid },
      {
        $pull: { likes: userUid },
        $inc: { likeCount: -1 },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "after" }
    );
    return result.value;
  }

  static async isLikedByUser(id, userUid) {
    const db = getDB();
    const comment = await db.collection("comments").findOne({
      _id: new ObjectId(id),
      likes: userUid,
    });
    return !!comment;
  }

  // Delete all comments by author
  static async deleteByAuthor(authorUid) {
    const db = getDB();
    const result = await db.collection("comments").deleteMany({ authorUid });
    return result.deletedCount;
  }
}

module.exports = Comment;
