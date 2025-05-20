import React from "react";
import { useNavigate } from "react-router-dom";

export default function SuperUserPanel() {
  const navigate = useNavigate();

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-2">Superbrugerpanel</h2>
      <p className="mb-4">Her kan du oprette dashboards og widgets til at overvåge fodringsmønstre.</p>

      <div className="grid gap-4 md:grid-cols-3">
        <button className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded">Opret nyt dashboard</button>
        <button className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded">Tilføj widget</button>
        <button
          onClick={() => navigate("/manage-users")}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded"
        >
          Opret ny bruger
        </button>
      </div>
    </div>
  );
}
