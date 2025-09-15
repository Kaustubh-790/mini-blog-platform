const { getDB } = require("../config/database");

class User {
  constructor(data) {
    this.firebaseUid = data.firebaseUid;
    this.email = data.email || "";
    this.name = data.name;
    this.bio = data.bio || "";
    this.avatarUrl = data.avatarUrl || "";
    this.website = data.website || "";
    this.location = data.location || "";
    this.twitter = data.twitter || "";
    this.linkedin = data.linkedin || "";
    this.instagram = data.instagram || "";
    this.settings = data.settings || {
      preferences: {
        theme: "light",
        autoSave: true,
        draftsRetention: 30,
      },
    };
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static async create(userData) {
    const db = getDB();
    const user = new User(userData);

    const result = await db.collection("users").insertOne(user);

    const createdUser = { ...user, _id: result.insertedId };

    return createdUser;
  }

  static async findByFirebaseUid(firebaseUid) {
    const db = getDB();
    const user = await db.collection("users").findOne({ firebaseUid });
    return user;
  }

  static async findById(id) {
    const db = getDB();
    const { ObjectId } = require("mongodb");
    return await db.collection("users").findOne({ _id: new ObjectId(id) });
  }

  static async updateByFirebaseUid(firebaseUid, updateData) {
    const db = getDB();
    updateData.updatedAt = new Date();

    const updateResult = await db
      .collection("users")
      .updateOne({ firebaseUid }, { $set: updateData });

    if (updateResult.modifiedCount === 0) {
      return null;
    }

    const updatedUser = await db.collection("users").findOne({ firebaseUid });

    return updatedUser;
  }

  static async deleteByFirebaseUid(firebaseUid) {
    const db = getDB();
    const result = await db.collection("users").deleteOne({ firebaseUid });
    return result.deletedCount > 0;
  }

  static async getOrCreate(firebaseUser) {
    let user = await this.findByFirebaseUid(firebaseUser.uid);

    if (!user) {
      const userData = {
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email || "",
        name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
        bio: "",
        avatarUrl: firebaseUser.photoURL || "",
        website: "",
        location: "",
        twitter: "",
        linkedin: "",
        instagram: "",
      };
      user = await this.create(userData);
    } else {
    }

    return user;
  }

  static async updateSettings(firebaseUid, settingsData) {
    const db = getDB();
    const updateData = {
      settings: settingsData,
      updatedAt: new Date(),
    };

    const updateResult = await db
      .collection("users")
      .updateOne({ firebaseUid }, { $set: updateData });

    if (updateResult.modifiedCount === 0) {
      return null;
    }

    const updatedUser = await db.collection("users").findOne({ firebaseUid });

    return updatedUser;
  }

  static async getSettings(firebaseUid) {
    const user = await this.findByFirebaseUid(firebaseUid);
    return user ? user.settings : null;
  }
}

module.exports = User;
