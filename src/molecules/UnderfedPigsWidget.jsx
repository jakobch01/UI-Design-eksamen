// src/molecules/UnderfedPigsWidget.jsx
import React from "react";
import Text from "../atoms/Text";
import TableRow from "../atoms/TableRow";

export default function UnderfedPigsWidget({ data = [] }) {
  return (
    <div className="bg-white text-black p-4 rounded shadow">
      <Text as="h3" size="xl" color="black" className="mb-2">
        Underfed Pigs
      </Text>

      {data.length === 0 ? (
        <Text size="small" color="gray-500">
          No underfed pigs found.
        </Text>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Responder</th>
              <th className="text-left p-2">Location</th>
              <th className="text-left p-2">Total Feed (g)</th>
              <th className="text-left p-2">Weight Gain (kg)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((pig, idx) => (
              <TableRow
                key={idx}
                row={{
                  responder: pig.responder,
                  location: pig.location,
                  totalFeed: pig.totalFeed,
                  weightGain: pig.weightGain,
                }}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
