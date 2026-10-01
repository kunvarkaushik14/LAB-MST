import { useState } from "react";

function Login({ onLogin }) {

    const [username, setUsername] = useState("");

    const [loading, setLoading] = useState(false);


    // ========================================
    // LOGIN FUNCTION
    // ========================================

    const handleLogin = async (role) => {

        if (!username.trim()) {

            alert("Please enter username");

            return;
        }

        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:5000/api/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username: username,
                        role: role
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert(data.message);

                return;
            }


            // Send user data to App
            onLogin({
                username: data.user.username,
                role: data.user.role,
                token: data.token
            });


        } catch (error) {

            alert(
                "Cannot connect to backend. Make sure server is running."
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="login-page">

            <div className="background-glow glow-one"></div>

            <div className="background-glow glow-two"></div>


            <div className="login-card">


                {/* BRAND */}

                <div className="brand">

                    <div className="brand-logo">
                        🔐
                    </div>

                    <div>

                        <h1>
                            RoleGuard
                        </h1>

                        <p>
                            JWT Access Control
                        </p>

                    </div>

                </div>


                {/* HEADING */}

                <div className="login-heading">

                    <div className="eyebrow">
                        SECURE ACCESS
                    </div>

                    <h2>
                        Welcome back
                    </h2>

                    <p>
                        Choose your role to continue
                        to the command center.
                    </p>

                </div>


                {/* USERNAME */}

                <div className="input-wrapper">

                    <label>
                        Username
                    </label>

                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                    />

                </div>


                {/* ROLE BUTTONS */}

                <div className="role-section">

                    <button
                        className="role-button admin-button"
                        onClick={() =>
                            handleLogin("ADMIN")
                        }
                        disabled={loading}
                    >

                        <div className="role-icon">
                            🛡️
                        </div>

                        <div className="role-info">

                            <strong>
                                Login as Admin
                            </strong>

                            <span>
                                Full administrative access
                            </span>

                        </div>

                        <div className="button-arrow">
                            →
                        </div>

                    </button>


                    <button
                        className="role-button viewer-button"
                        onClick={() =>
                            handleLogin("VIEWER")
                        }
                        disabled={loading}
                    >

                        <div className="role-icon">
                            👁️
                        </div>

                        <div className="role-info">

                            <strong>
                                Login as Viewer
                            </strong>

                            <span>
                                Read-only access
                            </span>

                        </div>

                        <div className="button-arrow">
                            →
                        </div>

                    </button>

                </div>


                {/* SECURITY */}

                <div className="security">

                    <span className="online-dot"></span>

                    JWT secured authentication

                </div>

            </div>

        </div>
    );
}

export default Login;