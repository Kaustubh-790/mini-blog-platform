const { verifyIdToken } = require("../config/firebase");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "No token provided or invalid format",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "No token provided",
      });
    }

    // Verify the Firebase ID token
    const decodedToken = await verifyIdToken(token);

    // Add user info to request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
      email_verified: decodedToken.email_verified,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or expired token",
    });
  }
};

// Optional auth middleware - doesn't fail if no token
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      if (token) {
        const decodedToken = await verifyIdToken(token);
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name,
          picture: decodedToken.picture,
          email_verified: decodedToken.email_verified,
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    console.log("Optional auth failed:", error.message);
    next();
  }
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
};
