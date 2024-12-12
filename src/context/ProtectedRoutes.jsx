import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("userID");
    if (token) {
      setIsAuthenticated(true); // User is authenticated
    } else {
      navigate("/login"); // Redirect to login if no token
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return null; // Don't render the protected component
  }

  return element; // Render protected component if authenticated
};

export default ProtectedRoute;
