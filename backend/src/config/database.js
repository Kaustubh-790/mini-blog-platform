const { MongoClient } = require("mongodb");
require("dotenv").config();

let client;
let db;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    client = new MongoClient(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    db = client.db("blogPlatform");

    console.log("Connected to MongoDB - blogPlatform database");

    await createIndexes();

    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    await db.collection("posts").createIndex({ authorUid: 1 });
    await db.collection("posts").createIndex({ slug: 1 }, { unique: true });
    await db.collection("posts").createIndex({ tags: 1 });
    await db.collection("posts").createIndex({ status: 1 });
    await db.collection("posts").createIndex({ publishedAt: -1 });
    await db.collection("posts").createIndex({ createdAt: -1 });

    await db.collection("comments").createIndex({ postId: 1 });
    await db.collection("comments").createIndex({ authorUid: 1 });
    await db.collection("comments").createIndex({ createdAt: -1 });

    await db
      .collection("users")
      .createIndex({ firebaseUid: 1 }, { unique: true });

    console.log("Database indexes created");
  } catch (error) {
    console.error("Error creating indexes:", error);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return db;
};

const closeDB = async () => {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
};

module.exports = {
  connectDB,
  getDB,
  closeDB,
};
