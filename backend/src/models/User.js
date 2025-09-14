const { getDB } = require("../config/database");

class User {
  constructor(data) {
    this.firebaseUid = data.firebaseUid;
    this.name = data.name;
    this.bio = data.bio || "";
    this.avatarUrl = data.avatarUrl || "";
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static async create(userData) {
    const db = getDB();
    const user = new User(userData);

    console.log("💾 Attempting to insert user into database:", user);
    const result = await db.collection("users").insertOne(user);
    console.log("💾 Insert result:", result);

    const createdUser = { ...user, _id: result.insertedId };
    console.log("💾 Created user object:", createdUser);

    return createdUser;
  }

  static async findByFirebaseUid(firebaseUid) {
    const db = getDB();
    console.log("🔍 Searching for user with firebaseUid:", firebaseUid);
    const user = await db.collection("users").findOne({ firebaseUid });
    console.log(
      "🔍 Search result:",
      user ? `Found user with ID: ${user._id}` : "No user found"
    );
    return user;
  }

  static async findById(id) {
    const db = getDB();
    return await db.collection("users").findOne({ _id: id });
  }

  static async updateByFirebaseUid(firebaseUid, updateData) {
    const db = getDB();
    updateData.updatedAt = new Date();

    const result = await db
      .collection("users")
      .findOneAndUpdate(
        { firebaseUid },
        { $set: updateData },
        { returnDocument: "after" }
      );

    return result.value;
  }

  static async deleteByFirebaseUid(firebaseUid) {
    const db = getDB();
    const result = await db.collection("users").deleteOne({ firebaseUid });
    return result.deletedCount > 0;
  }

  // Get or create user profile (useful for first-time login)
  static async getOrCreate(firebaseUser) {
    console.log("🔍 Looking for existing user with UID:", firebaseUser.uid);
    let user = await this.findByFirebaseUid(firebaseUser.uid);

    if (!user) {
      console.log("👤 User not found, creating new user...");
      const userData = {
        firebaseUid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
        bio: "",
        avatarUrl: firebaseUser.photoURL || "",
      };
      console.log("📝 Creating user with data:", userData);
      user = await this.create(userData);
      console.log("✅ New user created with ID:", user._id);
    } else {
      console.log("👤 Existing user found:", user._id);
    }

    return user;
  }
}

module.exports = User;
