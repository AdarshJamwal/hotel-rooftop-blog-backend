const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET_KEY is missing from environment variables.");
}

const verifyToken = (req, res, next) => {
  try {
    // Try to retrieve the token from cookies or Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Ensure the token contains a valid `userId`
    if (!decoded.userId) {
      return res.status(401).json({ message: "Invalid token provided" });
    }

    // Attach decoded information to the request object
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();

  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
