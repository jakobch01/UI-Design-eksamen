
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SuperUserPanel from "./pages/SuperUserPanel";
import ExcelDataViewer from "./components/ExcelDataViewer";
import { DashboardProvider } from "./context/DashboardContext";


const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/dashboard" />;
  return children;
};



export default function App() {
  return (
    <AuthProvider>
      <DashboardProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/super"
            element={
              <ProtectedRoute role="superuser">
                <SuperUserPanel />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
      </DashboardProvider>
    </AuthProvider>
  );
}
