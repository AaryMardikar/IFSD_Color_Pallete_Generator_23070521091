const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Palette = require("../models/Palette");

// 🔒 Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// 🟢 POST: Save palette
router.post("/save", verifyToken, async (req, res) => {
  try {
    const { name, colors } = req.body;
    const newPalette = new Palette({
      userId: req.user.id,
      name,
      colors,
    });

    await newPalette.save();
    res.status(201).json({ message: "Palette saved successfully!", palette: newPalette });
  } catch (error) {
    console.error("Error saving palette:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// 🟣 GET: Fetch all palettes for a user
router.get("/user/:id", verifyToken, async (req, res) => {
  try {
    const palettes = await Palette.find({ userId: req.params.id });
    res.status(200).json(palettes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// 🔴 DELETE: Remove a palette
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    await Palette.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Palette deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
