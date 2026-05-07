import { Navigate } from "react-router-dom";

// ProtectedRoute checks if user is logged in
function ProtectedRoute({ children }) {
  // Get token from localStorage
  const token = localStorage.getItem("token");

  // If there is no token, redirect user to login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If token exists, show the protected page
  return children;
}

export default ProtectedRoute;