import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, match: /^\S+@\S+\.\S+$/ },
    password: { type: String, required: true, minlength: 6 },
  });
  
  const User = mongoose.model("Player", playerSchema);