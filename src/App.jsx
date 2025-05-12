import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FacultyLogin from "./components/Login/FacultyLogin";
import FacultyGrade from "./components/FacultyGrade/FacultyGrade";
import AdminLogin from "./components/Login/AdminLogin";
import LandingPage from "./components/LandingPage/LandingPage";
import AdmPef from "./components/AdmPEF/AdmPEF";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <div className="main-content">
          <Routes>
            {/* Route for Landing Page */}
            <Route path="/off-limits" element={<LandingPage />} />

            {/* Route for Faculty Login */}
            <Route path="/off-limits" element={<FacultyLogin />} />

            {/* Route for FacultyGrades  */}
            <Route path="/off-limits" element={<FacultyGrade />} /> 

            {/* Route for Admin Login */}
            <Route path="/" element={<AdminLogin />} />

            {/* Route for Admin PEF */}
            <Route path="/admin-pef" element={<AdmPef/>}/>

          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
