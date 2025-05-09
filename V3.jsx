import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FacultyLogin from "./components/Login/Faculty_Login";
import FacultyGrade from "./components/FacultyGrade/FacultyGrade";
import AdminLogin from "./components/Login/AdminLogin";
import LandingPage from "./components/LandingPage/LandingPage";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <div className="main-content">
          <Routes>
            {/* Route for Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Route for Faculty Login */}
            <Route path="/faculty-login" element={<FacultyLogin />} />

            {/* Route for Admin Login */}
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Route for Faculty Grade */}
            <Route path="/faculty-grades" element={<FacultyGrade />} /> 
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
