import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChromePicker } from "react-color";
import Sidebar from "./Sidebar";
import "./Home.css";

// helper function to generate random colors
function generateRandomColors() {
  return Array(5)
    .fill()
    .map(
      () =>
        `#${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")}`
    );
}

const Home = () => {
  const [colors, setColors] = useState(generateRandomColors());
  const [paletteName, setPaletteName] = useState("");
  const [selectedColorIndex, setSelectedColorIndex] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [user] = useState(
    JSON.parse(localStorage.getItem("user")) || { name: "Guest" }
  );

  // regenerate new colors
  const regenerate = () => {
    setColors(generateRandomColors());
  };

  // handle color picker updates
  const handleColorChange = (color) => {
    const newColors = [...colors];
    newColors[selectedColorIndex] = color.hex;
    setColors(newColors);
  };

  const togglePicker = (index) => {
    if (selectedColorIndex === index && showPicker) {
      setShowPicker(false);
    } else {
      setSelectedColorIndex(index);
      setShowPicker(true);
    }
  };

  // save palette to backend
  const savePalette = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/palette/save",
        { name: paletteName || "Untitled Palette", colors },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("🎨 Palette saved successfully!");
      setPaletteName("");
    } catch (error) {
      alert("Error saving palette!");
      console.error(error);
    }
  };

  // spacebar regenerates colors
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        regenerate();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []); // we don’t need regenerate here as dependency

  return (
    <div className="home-layout">
      <Sidebar />

      <div className="palette-wrapper">
        <div className="top-bar">
          <h1>🎨 Color Palette Generator</h1>
          <p>Welcome, <strong>{user.name}</strong>!</p>
          <button className="random-btn" onClick={regenerate}>
            🔁 Generate New
          </button>
        </div>

        <div className="palette">
          {colors.map((color, index) => (
            <div
              key={index}
              className="color-tile"
              style={{ backgroundColor: color }}
              onClick={() => togglePicker(index)}
            >
              <div className="color-info">
                <h2>{color.toUpperCase()}</h2>
                <p>Click to edit</p>
              </div>

              {showPicker && selectedColorIndex === index && (
                <div className="color-picker-popup">
                  <ChromePicker
                    color={color}
                    onChangeComplete={handleColorChange}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="save-bar">
          <input
            type="text"
            placeholder="Palette Name"
            value={paletteName}
            onChange={(e) => setPaletteName(e.target.value)}
          />
          <button onClick={savePalette}>💾 Save Palette</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
