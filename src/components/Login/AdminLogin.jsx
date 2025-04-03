import React, { useState } from "react";
import "./AdminLogin.css";
import Navbar from "../NavBar/NavBar";


const AdminLogin = () => {
    const [admin_id, setADMID] = useState("");
    const [admin_password, setADMPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
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

                <footer class="admin-footer">
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
                                value={admin_id}
                                onChange={(e) => setADMID(e.target.value)}
                                required
                                placeholder="Enter your admin ID"
                            />
                            
                            <label>PASSWORD</label>
                            <input 
                                type="password"
                                value={admin_password}
                                onChange={(e) => setADMPassword(e.target.value)}
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

export default AdminLogin;
