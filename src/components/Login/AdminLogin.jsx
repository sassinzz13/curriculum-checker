import React, { useState } from "react";
import "./AdminLogin.css";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
    // State for admin credentials
    const [username, setADMUsername] = useState("");
    const [password, setADMPassword] = useState("");

    // React Router hook for navigation
    const navigate = useNavigate();

    // Handles the login form submission
    const handleLogin = async (e) => {
        e.preventDefault();

        // Send credentials to backend API
        const response = await fetch("https://curriculum-checker.onrender.com/accounts/api/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        // Redirect on success or show alert on failure
        if (response.ok) {
            navigate("/admin-pef");
        } else {
            alert("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="admin-main-container">
            {/* Top navigation bar */}
            <Navbar />

            {/* Left side branding and visual elements */}
            <div className="left-side">
                <div className="merlogo-container">
                    <img className="merlogo" src="/assets/merlogo.png" alt="Merlogo" />
                </div>

                {/* Decorative images */}
                <img src="/assets/wilkam.png" alt="Welcome" className="wilkam" />
                <img src="/assets/light1.png" alt="Light effect 1" className="light1" />
                <img src="/assets/light2.png" alt="Light effect 2" className="light2" />
                <img src="/assets/tear.png" alt="Paper tear" className="tear" />

                {/* Footer */}
                <footer className="admin-footer">
                    <p>© 2025 MgaLigmaProduction. All rights reserved.</p>
                </footer>
            </div>

            {/* Right side login form */}
            <div className="right-side">
                <div className="LeftName">
                    <h1>ADMIN LOGIN</h1>
                    <hr />
                </div>

                <div className="login-form-container">
                    <div className="login-form">
                        <img src="/assets/facimage.png" alt="Admin Group" />

                        {/* Login form */}
                        <form onSubmit={handleLogin}>
                            <label htmlFor="admin-id">Admin ID</label>
                            <input
                                id="admin-id"
                                type="text"
                                value={username}
                                onChange={(e) => setADMUsername(e.target.value)}
                                required
                                placeholder="Enter your admin ID"
                            />

                            <label htmlFor="admin-password">Password</label>
                            <input
                                id="admin-password"
                                type="password"
                                value={password}
                                onChange={(e) => setADMPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                            />

                            <button type="submit">Sign In</button>
                        </form>

                        {/* Placeholder link for forgot password */}
                        <div className="link">
                            <a href="#" className="forgot-password">Have you forgotten your Password?</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
