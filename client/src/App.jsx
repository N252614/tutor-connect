import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Tutors from "./pages/Tutors";
import ProtectedRoute from "./components/ProtectedRoute";

// Navigation component (so we can use useNavigate)
function Navigation() {
  const navigate = useNavigate();

  function handleLogout() {
    // Remove token and user from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login page
    navigate("/login");
  }

  const isLoggedIn = localStorage.getItem("token");

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      gap: "10px",
      padding: "20px",
      position: "relative",
      zIndex: 5,
    }}
    >
      <Link to="/register">
        <button>Register</button>
      </Link>

      <Link to="/login" style={{ marginLeft: "10px" }}>
        <button>Login</button>
      </Link>

      <Link to="/tutors" style={{ marginLeft: "10px" }}>
        <button>Tutors</button>
      </Link>

      {/* Show Logout button only if logged in */}
      {isLoggedIn && (
        <button
          onClick={handleLogout}
          style={{
            marginLeft: "10px",
            backgroundColor: "#ff4d4f",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Logout
        </button>
      )}
    </div>
  );
}

// Main App component
function App() {
  return (
    <Router>
      <Navigation />

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected route */}
        <Route
          path="/tutors"
          element={
            <ProtectedRoute>
              <Tutors />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;