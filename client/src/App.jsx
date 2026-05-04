import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";

// Main application component
function App() {
  return (
    <Router>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        {/* Navigation buttons */}
        <Link to="/register">
          <button>Register</button>
        </Link>

        <Link to="/login" style={{ marginLeft: "10px" }}>
          <button>Login</button>
        </Link>
      </div>

      {/* Application routes */}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
