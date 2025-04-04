import jwt from "jsonwebtoken";


export const adminLogOut = async (req, res) => {
  try {
    res
      .status(200)
      .clearCookie("token", { httpOnly: true })
      .json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (
      userName === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const tokenData = { role: "admin" };

      const token = jwt.sign(tokenData, process.env.JWT_SECRET || "secret", {
        expiresIn: "1d",
      });

      return res
        .status(200)
        .cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }) // Requires cookie-parser middleware
        .json({
          message: "Admin login successful",
          user: {
            username: userName, // Fixed variable name
            role: "admin",
          },
          token,
        });
    } else {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};