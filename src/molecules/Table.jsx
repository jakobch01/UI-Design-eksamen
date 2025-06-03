import TableRow from "../atoms/TableRow";
import Text from "../atoms/Text";

export default function Table({ headers, data }) {
  return (
    <div className="overflow-x-auto rounded">
      <table className="min-w-full bg-white text-black text-sm">
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="text-left p-2 font-semibold border-b">
                <Text variant="label">{header}</Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="p-2 text-gray-500">
                No data found.
              </td>
            </tr>
          ) : (
            data.map((row, idx) => <TableRow key={idx} row={row} />)
          )}
        </tbody>
      </table>
    </div>
  );
}