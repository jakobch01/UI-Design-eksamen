import React from "react";
import Text from "../atoms/Text";
import TableRow from "../atoms/TableRow";

export default function UnderfedPigsWidget({ data = [] }) {
  return (
    <div className="w-full bg-white text-black p-4 sm:p-6 rounded shadow">
      <Text
        as="h3"
        size="xl"
        color="black"
        className="mb-2 text-lg sm:text-xl"
      >
        Underfed Pigs
      </Text>

      {data.length === 0 ? (
        <Text size="small" color="gray-500" className="text-sm sm:text-base">
          No underfed pigs found.
        </Text>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-1 sm:p-2">Responder</th>
                <th className="text-left p-1 sm:p-2">Location</th>
                <th className="text-left p-1 sm:p-2">Total Feed (g)</th>
                <th className="text-left p-1 sm:p-2">Weight Gain (kg)</th>
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
                  cellClassName="p-1 sm:p-2 text-xs sm:text-sm"
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
