import { useEffect, type ReactNode } from "react";

export type TableColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
};

type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  getRowKey: (row: T, index: number) => string | number;
  onRowClick?: (row: T) => void;

  loading?: boolean;
  error?: string;
  emptyMessage?: string;
};

export default function Table<T>({
  columns,
  data,
  getRowKey,
  onRowClick,
  loading = false,
  error,
  emptyMessage = "No data found.",
}: TableProps<T>) {
 useEffect(()=>{
   console.log(data)
 },[])
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-gray-50">
            <tr className="border-b border-gray-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-red-600"
                >
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              data.map((row, index) => (
                <tr
                  key={getRowKey(row, index)}
                  onClick={() => onRowClick?.(row)}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={(event) => {
                    if (
                      onRowClick &&
                      (event.key === "Enter" || event.key === " ")
                    ) {
                      event.preventDefault();
                      onRowClick(row);
                    }
                  }}
                  className={`
                    border-b border-gray-100 last:border-b-0
                    transition-colors
                    ${
                      onRowClick
                        ? "cursor-pointer hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        : ""
                    }
                  `}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="whitespace-nowrap px-4 py-3 text-sm text-gray-700"
                    >
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}