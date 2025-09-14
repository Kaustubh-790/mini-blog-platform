const { connectDB } = require("./config/database");
const { initializeFirebase } = require("./config/firebase");

// Initialize Firebase Admin SDK
initializeFirebase();

// Connect to MongoDB
connectDB();

// Import and start the server
require("./server");
