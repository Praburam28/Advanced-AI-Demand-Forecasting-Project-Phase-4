const DataTable = ({ columns = [], data = [], emptyMessage = "No data found" }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-100 text-left">
            {columns.map((col) => (
              <th key={col.key} className="p-3 font-semibold text-slate-700">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr key={row.id || index} className="border-b hover:bg-slate-50">
              {columns.map((col) => (
                <td key={col.key} className="p-3">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="p-5 text-center text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;