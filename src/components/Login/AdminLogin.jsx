import React, { useState } from "react";
import "./AdminLogin.css";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
    const [username, setADMUsername] = useState("");
    const [password, setADMPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await fetch("https://curriculum-checker.onrender.com/accounts/api/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            navigate("/admin-pef"); 
        } else {
            alert("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="admin-main-container">
            <Navbar />

            <div className="left-side">
                <div className="merlogo-container">
                    <img className="merlogo" src="/assets/merlogo.png" alt="Merlogo" />
                </div>

                <img src="/assets/wilkam.png" alt="wilkam" className="wilkam" />
                <img src="/assets/light1.png" alt="light1" className="light1" />
                <img src="/assets/light2.png" alt="light2" className="light2" />
                <img src="/assets/tear.png" alt="paper tear" className="tear" />

                <footer className="admin-footer">
                    <p>© 2025 MgaLigmaProduction. All rights reserved.</p>
                </footer>
            </div>

            <div className="right-side">
                <div className="LeftName">
                    <h1>ADMIN LOGIN</h1>
                    <hr />
                </div>

                <div className="login-form-container">
                    <div className="login-form">
                        <img src="/assets/facimage.png" alt="Admin Group" />

                        <form onSubmit={handleLogin}>
                            <label>Admin ID</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setADMUsername(e.target.value)}
                                required
                                placeholder="Enter your admin ID"
                            />

                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setADMPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                            />

                            <button type="submit">Sign In</button>
                        </form>

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
