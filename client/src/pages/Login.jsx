import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import authBg from "../assets/auth-bg.jpg"; // background image

// Login page component
function Login() {
    // State for form inputs (email and password)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    // State for messages (success or error)
    const [message, setMessage] = useState("");

    // Hook for navigation after successful login
    const navigate = useNavigate();

    // Handle input changes
    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    // Handle form submit
    async function handleSubmit(e) {
        e.preventDefault();

        try {
            // Send login request to backend
            const data = await loginUser(formData);

            // If login successful, save token and user data
            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                setMessage("Login successful!");

                // Redirect user to tutors page
                navigate("/tutors");
            } else {
                // Show error message
                setMessage(data.error || "Login failed");
            }
        } catch (error) {
            console.error("LOGIN ERROR:", error);
            setMessage("Something went wrong. Check the backend server.");
        }
    }

    return (
        <div
            style={{
                position: "relative",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
            }}
        >
            {/* Background image */}
            <img
                src={authBg}
                alt="background"
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: -2,
                }}
            />

            {/* Overlay for better readability */}
            <div
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(255,255,255,0.45)",
                    zIndex: -1,
                }}
            />

            {/* Form container */}
            <div
                style={{
                    backgroundColor: "white",
                    padding: "30px",
                    borderRadius: "12px",
                    width: "300px",
                    textAlign: "center",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.12)",
                    transform: "translateY(-140px)",
                }}
            >
                {/* App title */}
                <h1>TutorConnect</h1>

                <h2>Login</h2>

                <form onSubmit={handleSubmit}>
                    {/* Email input */}
                    <input
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            marginBottom: "10px",
                            boxSizing: "border-box",
                        }}
                    />

                    {/* Password input */}
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            marginBottom: "10px",
                            boxSizing: "border-box",
                        }}
                    />

                    {/* Submit button */}
                    <button
                        type="submit"
                        style={{
                            backgroundColor: "#6C63FF",
                            color: "white",
                            border: "none",
                            padding: "10px",
                            width: "100%",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            marginTop: "8px",
                        }}
                    >Login</button>
                </form>

                {/* Message display */}
                <p>{message}</p>
            </div>
        </div>
    );
}

export default Login;