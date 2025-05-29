import React from "react";

export default function UnderfedPigsWidget({ data }) {
  return (
    <div className="bg-white text-black p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Underfed Pigs</h3>
      {data.length === 0 ? (
        <p className="text-sm text-gray-500">No underfed pigs found.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left">Responder</th>
              <th className="text-left">Location</th>
              <th className="text-left">Total Feed (g)</th>
              <th className="text-left">Weight Gain (kg)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((pig, idx) => (
              <tr key={idx}>
                <td>{pig.responder}</td>
                <td>{pig.location}</td>
                <td>{pig.totalFeed}</td>
                <td>{pig.weightGain}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
