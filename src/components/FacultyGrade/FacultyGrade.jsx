import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import Navbar from "../Navbar/Navbar";
import StudentTable from "./StudentTable";
import Sidebar from "./SideBar";
import "./FacultyGrade.css";

const FacultyGrade = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sections, setSections] = useState([]);
  const [isEditable, setIsEditable] = useState(false);  // Track edit mode

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchSections = async () => {
    try {
      const response = await fetch("http://172.16.28.70:8000/api/students/");
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const toggleEditMode = () => {
    setIsEditable(!isEditable); 
  };

  const saveAllGrades = () => {
    const studentTableElement = document.getElementById("student-table-component");
    if (studentTableElement) {
      studentTableElement.dispatchEvent(new CustomEvent("saveAllGrades"));
    }
    setIsEditable(false); // Lock table after saving
  };


  return (
    <div className="fg-main-container">
      <Navbar />
      <nav className="fg-navbar">
        <FaBars className="fg-sidebar-icon" onClick={toggleSidebar} />
        <h1 className="fg-navbar-title">Welcome Merlions!</h1>
      </nav>

      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} sections={sections} />

      <div className="fg-main-content">
        <div className="fg-left-container">
          <div className="fg-table-container">
            <StudentTable isEditable={isEditable} /> {/* Pass the editable state */}
          </div>
        </div>
        <div className="fg-right-container">
          <div className="si-container">
            <h1>Student Information</h1>
          </div>
          <div className="stuinfo-container">
            <div className="stuimage">
              <img src="/assets/stuimage.jpg" alt="student/pic" />
            </div>
            <div className="stuinfo">
              <h2>Name:</h2>
              <h2>Student No:</h2>
              <h2>Department:</h2>
              <h2>Course:</h2>
              <h2>Block:</h2>
            </div>
          </div>
          <div className="fg-buttons">
              <button
                className="fg-btn"
                onClick={() => setIsEditable(true)} // Only enables editing
                disabled={isEditable} // Disable if already in edit mode
              >
                Edit
              </button>
              <button
                className="fg-btn"
                onClick={saveAllGrades}
                disabled={!isEditable}
              >
                Save
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyGrade;
