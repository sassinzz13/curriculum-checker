import React, { useState } from "react";
import FacultyLogin from "./components/Login/Faculty_Login";
import AdminLogin from "./components/Login/AdminLogin";
import LandingPage from "./components/LandingPage/LandingPage";

const App = () => {
  const [isFacultyClicked, setIsFacultyClicked] = useState(false);
  const [isAdminClicked, setIsAdminClicked] = useState(false);

  const handleFacultyClick = () => {
    setIsFacultyClicked(true);
    setIsAdminClicked(false);
  };

  const handleAdminClick = () => {
    setIsAdminClicked(true);
    setIsFacultyClicked(false);
  };

  return (
    <div className="app-container">
      <div className="main-content">
        {isFacultyClicked ? (
          <FacultyLogin />
        ) : isAdminClicked ? (
          <AdminLogin />
        ) : (
          <LandingPage 
            onFacultyClick={handleFacultyClick} 
            onAdminClick={handleAdminClick} 
          />
        )}
      </div>
    </div>
  );
};

export default App;
