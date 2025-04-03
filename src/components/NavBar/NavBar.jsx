import React from 'react';
import './Navbar.css';  

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src="/assets/udm-logo.png" alt="School Logo" className="logo" />
                <span className="school-name">Universidad de Manila</span>
            </div>
        </nav>
    );
}

export default Navbar;
