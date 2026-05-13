import { useState } from "react";
import { registerUser } from "../services/api";
import authBg from "../assets/auth-bg.jpg"; // background image

// Register page component
function Register() {
    // State for form inputs (username, email, password, role)
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "student",
    });

    // State for messages (success or error)
    const [message, setMessage] = useState("");

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
            // Send request to backend
            const data = await registerUser(formData);

            // If backend returns error, show it
            if (data.error) {
                setMessage(data.error);
            } else {
                // Success message
                setMessage("User registered successfully!");
            }
        } catch (error) {
            // Handle unexpected errors
            console.error("REGISTER ERROR:", error);
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
                    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
                    transform: "translateY(-200px)",
                }}
            >
                {/* App title */}
                <h1>TutorConnect</h1>

                <h2>Register</h2>

                <form onSubmit={handleSubmit}>
                    {/* Username input */}
                    <input
                        name="username"
                        placeholder="Username"
                        value={formData.username}
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

                    {/* Role select */}
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            marginBottom: "15px",
                        }}
                    >
                        <option value="student">Student</option>
                        <option value="tutor">Tutor</option>
                    </select>
                    <br /><br />

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
                        }}
                    >
                        Register
                    </button>
                </form>

                {/* Message display */}
                <p>{message}</p>
            </div>
        </div>
    );
}

export default Register;