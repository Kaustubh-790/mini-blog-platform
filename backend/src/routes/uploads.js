const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

// Utility function to get the correct protocol for URLs
const getProtocol = (req) => {
  const protocol = req.get("X-Forwarded-Proto") || req.protocol;
  const isProduction = process.env.NODE_ENV === "production";
  return isProduction ? "https" : protocol;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed"));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

// POST /api/uploads
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    const originalPath = req.file.path;
    const optimizedPath = originalPath.replace(/\.[^/.]+$/, "_optimized.webp");

    try {
      console.log("Starting image optimization...");
      console.log("Original path:", originalPath);
      console.log("Optimized path:", optimizedPath);

      await sharp(originalPath)
        .resize(1200, 800, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 85 })
        .toFile(optimizedPath);

      console.log("Image optimization completed successfully");

      fs.unlinkSync(originalPath);
      console.log("Original file removed");

      const optimizedFilename = req.file.filename.replace(
        /\.[^/.]+$/,
        "_optimized.webp"
      );

      const fileUrl = `${getProtocol(req)}://${req.get(
        "host"
      )}/uploads/${optimizedFilename}`;

      const optimizedStats = fs.statSync(optimizedPath);

      console.log("Optimized filename:", optimizedFilename);
      console.log("File URL:", fileUrl);

      res.json({
        success: true,
        data: {
          filename: optimizedFilename,
          originalName: req.file.originalname,
          size: optimizedStats.size,
          originalSize: req.file.size,
          url: fileUrl,
          uploadedAt: new Date(),
          optimized: true,
        },
      });
    } catch (optimizationError) {
      console.error("Image optimization error:", optimizationError);

      const fileUrl = `${getProtocol(req)}://${req.get("host")}/uploads/${
        req.file.filename
      }`;

      console.log("Using original file due to optimization error");
      console.log("Original filename:", req.file.filename);
      console.log("File URL:", fileUrl);

      res.json({
        success: true,
        data: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          url: fileUrl,
          uploadedAt: new Date(),
          optimized: false,
        },
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to upload file",
      message: error.message,
    });
  }
});

// POST /api/uploads/multiple
router.post(
  "/multiple",
  authMiddleware,
  upload.array("images", 5),
  (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: "No files uploaded",
        });
      }

      const uploadedFiles = req.files.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        url: `${getProtocol(req)}://${req.get("host")}/uploads/${
          file.filename
        }`,
        uploadedAt: new Date(),
      }));

      res.json({
        success: true,
        data: uploadedFiles,
      });
    } catch (error) {
      console.error("Multiple upload error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to upload files",
        message: error.message,
      });
    }
  }
);

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File too large",
        message: "File size must be less than 5MB",
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        error: "Too many files",
        message: "Maximum 5 files allowed",
      });
    }
  }

  if (error.message.includes("Only image files")) {
    return res.status(400).json({
      success: false,
      error: "Invalid file type",
      message: error.message,
    });
  }

  next(error);
});

module.exports = router;
