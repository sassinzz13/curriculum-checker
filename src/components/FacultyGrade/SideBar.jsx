import React from "react";
import "./Sidebar.css";
import { FaTimes } from "react-icons/fa";

const Sidebar = ({ isOpen, toggleSidebar, sections }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <FaTimes className="close-icon" onClick={toggleSidebar} />
      <h2 className="sidebar-title">Handled Sections</h2>
      <ul>
        {sections.length > 0 ? (
          sections.map((section, index) => (
            <li key={index}>
              <a href={`/section/${section.id}`}>{section.name}</a>
            </li>
          ))
        ) : (
          <li>No sections assigned</li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
