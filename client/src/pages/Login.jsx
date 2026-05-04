import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

// Login page component
function Login() {
  // State for form inputs (email and password)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // State for messages (success or error)
  const [message, setMessage] = useState("");

  // Hook for navigation (redirect after login)
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

    // Send login request to backend
    const data = await loginUser(formData);

    console.log(data);

    // If login successful → save token and redirect
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Login successful!");

      // Redirect to tutors page (we will create it next)
      navigate("/tutors");
    } else {
      // Show error message
      setMessage(data.error || "Login failed");
    }
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        {/* Email input */}
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <br /><br />

        {/* Password input */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <br /><br />

        {/* Submit button */}
        <button type="submit">Login</button>
      </form>

      {/* Message display */}
      <p>{message}</p>
    </div>
  );
}

export default Login;