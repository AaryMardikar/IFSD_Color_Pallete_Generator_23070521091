const mongoose = require("mongoose");

const paletteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    colors: {
      type: [String], // Array of hex codes
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Palette", paletteSchema);