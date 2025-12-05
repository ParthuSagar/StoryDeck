import React from "react";
import { Navigate } from "react-router-dom";
import { getAuthTokens, isTokenExpired } from "../utils/authUtils";

const ProtectedRoute = ({ children }) => {
  const tokens = getAuthTokens();

  if (!tokens || isTokenExpired(tokens.access)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
