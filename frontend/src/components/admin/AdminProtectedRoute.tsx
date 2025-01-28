import { Navigate } from "react-router-dom";
import React, { ReactElement} from "react";

interface AdminProtectedRouteProps {
  children: ReactElement;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = Boolean(localStorage.getItem("authToken"));
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

export default AdminProtectedRoute;