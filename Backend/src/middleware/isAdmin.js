import jwt from "jsonwebtoken";

export const isAdmin = (req, res, next) => {
  try {
    // Get token from cookies or headers
    const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    // Check if user is an admin
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access only" });
    }

    // Attach user data to request
    req.user = decoded;
    next(); // Move to the next middleware or controller function
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
