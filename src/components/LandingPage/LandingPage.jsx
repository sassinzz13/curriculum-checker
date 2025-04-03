import React from 'react';
import './LandingPage.css';
import Navbar from "../NavBar/NavBar";

const LandingPage = ({ onFacultyClick, onAdminClick }) => {
  return (
    <div className="main">
      <Navbar />

      <div className="landing-main-container">
        <div className="main-top">
          <h1>User Selection</h1>
        </div>

        <div className="main-middle">
          <div className="fac-container" onClick={onFacultyClick}>
            <img src="/assets/fac-logo.png" alt="faculty-logo" />
            <h1>Are you a Faculty?</h1>
            <p>Faculty grade students based on their subject, evaluating performance and providing feedback.</p>
          </div>

          <div className="adm-container" onClick={onAdminClick}> 
            <img src="/assets/adm-logo.png" alt="admin-logo" />
            <h1>Are you an Admin?</h1>
            <p>Admins verify student information, grades, and credentials, ensuring accurate records.</p>
          </div>
        </div>

        <div className="main-bottom">
          <footer className="landing-footer">
            <p>© 2025 MgaLigmaProduction. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
