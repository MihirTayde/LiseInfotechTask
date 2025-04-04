import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import PlayerModel from "../model/PlayerModel.js"; 

export const playerRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Invalid input or password too short" });
    }

    const existingPlayer = await PlayerModel.findOne({ $or: [{ email }, { username }] });
    if (existingPlayer) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newPlayer = new PlayerModel({ username, email, password: hashedPassword });

    await newPlayer.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
};

export const playerLogin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const player = await PlayerModel.findOne({ $or: [{ username }, { email }] });
    if (!player) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, player.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ playerId: player._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};
