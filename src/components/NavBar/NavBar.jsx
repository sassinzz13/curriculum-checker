import React from 'react';
import './Navbar.css';  

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src="/assets/nakaw.png" alt="School Logo" className="logo" />
                <span className="school-name">ComSci Attitude Curriculum-Checker</span>
            </div>
        </nav>
    );
}

export default Navbar;
