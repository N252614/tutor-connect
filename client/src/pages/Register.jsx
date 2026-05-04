import { useState } from "react";
import { registerUser } from "../services/api";

// Register page component
function Register() {
  // State for form inputs (username, email, password)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
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

    // Log form data for debugging
    console.log("REGISTER FORM DATA:", formData);

    try {
      // Send request to backend
      const data = await registerUser(formData);

      console.log("REGISTER RESPONSE:", data);

      // If backend returns error → show it
      if (data.error) {
        setMessage(data.error);
      } else {
        // Success message
        setMessage("User registered successfully!");
      }
    } catch (error) {
      // Handle unexpected errors (server not running, network issues)
      console.error("REGISTER ERROR:", error);
      setMessage("Something went wrong. Check the backend server.");
    }
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        {/* Username input */}
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <br /><br />

        {/* Email input */}
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <br /><br />

        {/* Password input */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <br /><br />

        {/* Submit button */}
        <button type="submit">Register</button>
      </form>

      {/* Message display */}
      <p>{message}</p>
    </div>
  );
}

export default Register;