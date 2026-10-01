import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {

    const [user, setUser] = useState(() => {

        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            return JSON.parse(savedUser);
        }

        return null;
    });


    // ========================================
    // LOGIN
    // ========================================

    const handleLogin = (userData) => {

        setUser(userData);

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        localStorage.setItem(
            "token",
            userData.token
        );
    };


    // ========================================
    // LOGOUT
    // ========================================

    const handleLogout = () => {

        localStorage.removeItem("user");
        localStorage.removeItem("token");

        setUser(null);
    };


    return (

        <>

            {!user ? (

                <Login
                    onLogin={handleLogin}
                />

            ) : (

                <Dashboard
                    user={user}
                    onLogout={handleLogout}
                />

            )}

        </>

    );
}

export default App;