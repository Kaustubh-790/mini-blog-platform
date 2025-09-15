const { connectWithRetry } = require("./config/database");
const { initializeFirebase } = require("./config/firebase");

// Initialize Firebase Admin SDK
initializeFirebase();

// Connect to MongoDB
const startApp = async () => {
  try {
    await connectWithRetry();
    require("./server");
  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
};

startApp();
