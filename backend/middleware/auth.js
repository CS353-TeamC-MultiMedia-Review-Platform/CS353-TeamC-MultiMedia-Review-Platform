const admin = require("firebase-admin");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Extract token
    const token = authHeader.split("Bearer ")[1];

    // Verify token with Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Attach user to request
    req.user = decodedToken;

    next(); // continue to route

  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;