import React from "react";
import { useAuth } from "../auth/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Velkommen, {user.username} ({user.role})</p>
      {user.role === "superuser" && (
        <div className="mt-4 space-x-4">
          <a href="/super" className="text-blue-500 underline">Superbrugerpanel</a>
          <a href="/manage-users" className="text-blue-500 underline">Brugeradministration</a>
        </div>
      )}
      <button onClick={logout} className="mt-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded">
        Log ud
      </button>
    </div>
  );
}
