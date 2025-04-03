import React, { useState } from "react";
import "./FacultyLogin.css";
import Navbar from "../NavBar/NavBar";


const FacultyLogin = () => {
    const [faculty_id, setFacID] = useState("");
    const [faculty_password, setFacPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
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

                <footer class="faculty-footer">
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
                                value={faculty_id}
                                onChange={(e) => setFacID(e.target.value)}
                                required
                                placeholder="Enter your Faculty ID"
                            />
                            
                            <label>PASSWORD</label>
                            <input 
                                type="password"
                                value={faculty_password}
                                onChange={(e) => setFacPassword(e.target.value)}
                                required
                                placeholder="Enter your Password"
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

export default FacultyLogin;
