import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="sidebar-top">
        <h2 className="logo">{isExpanded ? "🎨 PaletteGen" : "🎨"}</h2>
        <nav>
          <button onClick={() => navigate("/home")}>
            🏠 {isExpanded && "Home"}
          </button>
          <button onClick={() => navigate("/about")}>
            ℹ️ {isExpanded && "About"}
          </button>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <button className="logout-btn" onClick={handleLogout}>
          🚪 {isExpanded && "Logout"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;