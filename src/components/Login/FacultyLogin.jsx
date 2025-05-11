import React, { useState } from "react";
import "./FacultyLogin.css";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";

const FacultyLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://curriculum-checker.onrender.com/accounts/api/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate("/faculty-grades");
            } else {
                setError(data?.non_field_errors?.[0] || "Invalid credentials. Please try again.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again later.");
            console.error("Login error:", err);
        }
    };

    return (
        <div className="faculty-main-container">
            <Navbar />
            <div className="left-side">
                <div className="merlogo-container">
                    <img className="merlogo" src="/assets/merlogo.png" alt="Merlogo" />
                </div>

                <img src="/assets/wilkam.png" alt="wilkam" className="wilkam" />
                <img src="/assets/light1.png" alt="light1" className="light1" />
                <img src="/assets/light2.png" alt="light2" className="light2" />
                <img src="/assets/tear.png" alt="paper tear" className="tear" />

                <footer className="faculty-footer">
                    <p>© 2025 MgaLigmaProduction. All rights reserved.</p>
                </footer>
            </div>

            <div className="right-side">
                <div className="LeftName">
                    <h1>FACULTY LOGIN</h1>
                    <hr />
                </div>

                <div className="login-form-container">
                    <div className="login-form">
                        <img src="/assets/facimage.png" alt="Faculty Group" />

                        <form onSubmit={handleLogin}>
                            <label>FACULTY ID</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    setError("");
                                }}
                                required
                                placeholder="Enter your Faculty ID"
                            />

                            <label>PASSWORD</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError("");
                                }}
                                required
                                placeholder="Enter your Password"
                            />

                            {error && <p className="error-message">{error}</p>}

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

export default FacultyLogin;
