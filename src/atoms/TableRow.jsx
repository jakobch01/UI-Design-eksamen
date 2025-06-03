export default function TableRow({ row }) {
  return (
    <tr>
      {Object.values(row).map((value, idx) => (
        <td key={idx} className="p-2 border-b">
          {value}
        </td>
      ))}
    </tr>
  );
}