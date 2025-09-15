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

    console.log("Attempting to insert user into database:", user);
    const result = await db.collection("users").insertOne(user);
    console.log("Insert result:", result);

    const createdUser = { ...user, _id: result.insertedId };
    console.log("Created user object:", createdUser);

    return createdUser;
  }

  static async findByFirebaseUid(firebaseUid) {
    const db = getDB();
    console.log("Searching for user with firebaseUid:", firebaseUid);
    const user = await db.collection("users").findOne({ firebaseUid });
    console.log(
      "Search result:",
      user ? `Found user with ID: ${user._id}` : "No user found"
    );
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

    console.log("Updating user with firebaseUid:", firebaseUid);
    console.log("Update data:", updateData);

    // Use updateOne instead of findOneAndUpdate for better compatibility
    const updateResult = await db
      .collection("users")
      .updateOne({ firebaseUid }, { $set: updateData });

    console.log("Update result:", updateResult);

    if (updateResult.modifiedCount === 0) {
      console.log("No user was updated");
      return null;
    }

    // Fetch the updated user
    const updatedUser = await db.collection("users").findOne({ firebaseUid });
    console.log("Updated user:", updatedUser);

    return updatedUser;
  }

  static async deleteByFirebaseUid(firebaseUid) {
    const db = getDB();
    const result = await db.collection("users").deleteOne({ firebaseUid });
    return result.deletedCount > 0;
  }

  // Get or create user profile (useful for first-time login)
  static async getOrCreate(firebaseUser) {
    console.log("Looking for existing user with UID:", firebaseUser.uid);
    let user = await this.findByFirebaseUid(firebaseUser.uid);

    if (!user) {
      console.log("User not found, creating new user...");
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
      console.log("Creating user with data:", userData);
      user = await this.create(userData);
      console.log("New user created with ID:", user._id);
    } else {
      console.log("Existing user found:", user._id);
    }

    return user;
  }

  // Update user settings
  static async updateSettings(firebaseUid, settingsData) {
    const db = getDB();
    const updateData = {
      settings: settingsData,
      updatedAt: new Date(),
    };

    console.log("Updating settings for firebaseUid:", firebaseUid);
    console.log("Settings update data:", updateData);

    // Use updateOne instead of findOneAndUpdate for better compatibility
    const updateResult = await db
      .collection("users")
      .updateOne({ firebaseUid }, { $set: updateData });

    console.log("Settings update result:", updateResult);

    if (updateResult.modifiedCount === 0) {
      console.log("No user settings were updated");
      return null;
    }

    // Fetch the updated user
    const updatedUser = await db.collection("users").findOne({ firebaseUid });
    console.log("Updated user with settings:", updatedUser);

    return updatedUser;
  }

  // Get user settings
  static async getSettings(firebaseUid) {
    const user = await this.findByFirebaseUid(firebaseUid);
    return user ? user.settings : null;
  }
}

module.exports = User;
