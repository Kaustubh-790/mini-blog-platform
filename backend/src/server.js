const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");
const userRoutes = require("./routes/users");
const uploadRoutes = require("./routes/uploads");

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5000",
  "https://blog-platform.onrender.com",
  // Vercel domains
  /^https:\/\/.*\.vercel\.app$/,
  /^https:\/\/.*\.vercel\.dev$/,
].filter(Boolean);

app.use(
  cors({
    origin: NODE_ENV === "production" ? allowedOrigins : true,
    credentials: true,
  })
);

app.use(compression());
app.use(morgan("combined"));
app.use(limiter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  "/uploads",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Credentials", "false");
    res.header("Cross-Origin-Resource-Policy", "cross-origin");

    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }

    next();
  },
  express.static(path.join(__dirname, "../uploads"))
);

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/uploads", uploadRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    ...(NODE_ENV === "development" && { stack: err.stack }),
  });
});

// API routes only - no static file serving
app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API route not found" });
  }
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(
    `Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`
  );
});

module.exports = app;
