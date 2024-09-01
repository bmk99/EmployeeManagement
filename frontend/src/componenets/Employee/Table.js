import React, { useContext } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AuthContext } from "../context/UserContext";
import { Link } from "react-router-dom";

function Table({ data, columns }) {
  const { details } = useContext(AuthContext);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    // <div className="employees-table-container p-2">
    //   <div className="table-heading">
    //     <h2>Employess</h2>
    //     <h2>
    //       <Link to="/empform"> Create Employee</Link>
    //     </h2>
    //     <h2>{details.username}</h2>
    //   </div>
    <>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <>
                      <div
                        className={`${
                          header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : ""
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                      {header.column.getCanFilter() ? (
                        <div className="filter-input-container">
                          <Filter column={header.column} />
                        </div>
                      ) : null}
                    </>
                  )}
                </th>
                // <th>EDIt</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} data-label={cell.column.columnDef.header}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination-controls">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div className="debug-info">
        {table.getPrePaginationRowModel().rows.length} ROWS
        {/* <pre>
          {JSON.stringify(
            { columnFilters: table.getState().columnFilters },
            null,
            2
          )}
        </pre> */}
      </div> 
   </>
  );
}

function Filter({ column }) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};

  return filterVariant === "range" ? (
    <div className="filter-input-container range-filter">
      <DebouncedInput
        type="number"
        value={columnFilterValue?.[0] ?? ""}
        onChange={(value) => column.setFilterValue((old) => [value, old?.[1]])}
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <DebouncedInput
        type="number"
        value={columnFilterValue?.[1] ?? ""}
        onChange={(value) => column.setFilterValue((old) => [old?.[0], value])}
        placeholder={`Max`}
        className="w-24 border shadow rounded"
      />
    </div>
  ) : filterVariant === "gender" ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
      className="filter-dropdown"
    >
      <option value="">All</option>
      <option value="MALE">MALE</option>
      <option value="FEMALE">FEMALE</option>
    </select>
  ) : filterVariant === "designation" ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
      className="filter-dropdown"
    >
      <option value="">All</option>
      <option value="HR">HR</option>
      <option value="MANAGER">MANAGER</option>
      <option value="SALES">SALES</option>
    </select>
  ) : filterVariant === "course" ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
      className="filter-dropdown"
    >
      <option value="">All</option>
      <option value="MBA">MBA</option>
      <option value="MCA">MCA</option>
      <option value="BCOM">BCOM</option>
      <option value="OTHERS">OTHERS</option>
    </select>
  ) : filterVariant === "name" ? (
    <DebouncedInput
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      type="text"
      value={columnFilterValue ?? ""}
    />
  ) : (
    ""
  );
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export { Table };
