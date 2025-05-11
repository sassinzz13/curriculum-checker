import React from 'react';
import './LandingPage.css';
import Navbar from '../Navbar/Navbar'; // Import Navbar component
import { Link } from 'react-router-dom'; // Import Link for navigation

const LandingPage = () => {
  return (
    <div className="main">
      <Navbar />

      <div className="landing-main-container">
        <div className="main-top">
          <h1>User Selection</h1>
        </div>

        <div className="main-middle">
          <div className="fac-container">
            <Link to="/faculty-login"> {/* Link to Faculty Login page */}
              <img src="/assets/fac-logo.png" alt="faculty-logo" />
              <h1>Are you a Faculty?</h1>
              <p>Faculty grade students based on their subject, evaluating performance and providing feedback.</p>
            </Link>
          </div>
          

          <div className="adm-container">
            <Link to="/admin-login"> {/* Link to Admin Login page */}
              <img src="/assets/adm-logo.png" alt="admin-logo" />
              <h1>Are you an Admin?</h1>
              <p>Admins verify student information, grades, and credentials, ensuring accurate records.</p>
            </Link>
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
