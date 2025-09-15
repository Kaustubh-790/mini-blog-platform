const { MongoClient } = require("mongodb");
require("dotenv").config();

let client;
let db;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    client = new MongoClient(mongoUri, {
      ssl: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,

      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,

      retryWrites: true,
      retryReads: true,

      maxPoolSize: 10,
      minPoolSize: 5,

      heartbeatFrequencyMS: 10000,
    });

    console.log("Attempting to connect to MongoDB...");
    await client.connect();

    await client.db("admin").command({ ping: 1 });

    db = client.db();
    console.log("Connected to MongoDB");

    await createIndexes();

    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);

    if (client) {
      try {
        await client.close();
      } catch (closeError) {
        console.error("Error closing client:", closeError);
      }
    }

    throw error;
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

const connectWithRetry = async (maxRetries = 3, delay = 5000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await connectDB();
    } catch (error) {
      console.error(`Connection attempt ${i + 1} failed:`, error.message);

      if (i === maxRetries - 1) {
        console.error("Max retries reached. Exiting...");
        process.exit(1);
      }

      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

module.exports = {
  connectDB,
  connectWithRetry,
  getDB,
  closeDB,
};
