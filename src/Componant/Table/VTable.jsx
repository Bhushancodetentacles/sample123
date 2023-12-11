/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import { ArrowUpDownIcon } from "lucide-react";
import Stack from "@mui/material/Stack";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const Table = ({
  cols,
  data,
  totalPages,
  page,
  handlePageChange,
  handleRowsPerPageChange,
  isTableLoading,
  isPaginationHide
}) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  useEffect(() => {
    setSortConfig({ key: "default", direction: "desc" });
  }, []);

  const sortedData = () => {
    if (sortConfig.key !== null) {
      const sortedItems = [...data];
      sortedItems.sort((a, b) => {
        const valueA = a[sortConfig.key];
        const valueB = b[sortConfig.key];

        if (typeof valueA === "number" && typeof valueB === "number") {
          // Sort numbers
          return sortConfig.direction === "asc"
            ? valueA - valueB
            : valueB - valueA;
        }

        if (typeof valueA === "string" && typeof valueB === "string") {
          // Sort strings
          const stringA = valueA.toLowerCase();
          const stringB = valueB.toLowerCase();
          if (stringA < stringB) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (stringA > stringB) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
          return 0;
        }

        if (valueA instanceof Date && valueB instanceof Date) {
          // Sort dates
          if (valueA < valueB) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (valueA > valueB) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
          return 0;
        }

        // Convert strings to dates and compare
        const dateA = new Date(valueA);
        const dateB = new Date(valueB);
        if (!isNaN(dateA) && !isNaN(dateB)) {
          if (dateA < dateB) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (dateA > dateB) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
          return 0;
        }

        // Default comparison (considering unknown types as strings)
        const unknownStringA = String(valueA).toLowerCase();
        const unknownStringB = String(valueB).toLowerCase();
        if (unknownStringA < unknownStringB) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (unknownStringA > unknownStringB) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });

      return sortedItems;
    }

    return data;
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleChangeRowsPerPage = (event) => {
    const value = parseInt(event.target.value, 10);
    setRowsPerPage(value);
    handleRowsPerPageChange(value);
  };

  // pagination style

  return (
    <>
      <div>
        <div className="p-10 bg-primaryDarkCards rounded-md  overflow-x-auto" style={{border:"2px solid rgba(34, 47, 27, 0.19)"}} >
          <table className="min-w-full divide-y divide-gray-200 supporttable fixeded" style={{width:"100%", overflow:"auto"}}>
            <thead>
              <tr>
                {cols.map((col, index) => (
                  <th
                    key={index}
                    style={{
                      cursor: col.sortable ? "pointer" : "default",
                    }}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  "
                    onClick={() => (col.sortable ? requestSort(col.key) : null)}
                  >
                    <div className="flex justify-center">
                      {col.title}
                      {col.sortable && (
                        <span>
                          {sortConfig.key === col.key && (
                            <span>
                              {sortConfig.direction === "asc" ? (
                                <ArrowUpDownIcon className="filterarrow" />
                              ) : (
                                <ArrowUpDownIcon className="filterarrow" />
                              )}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {isTableLoading ? (
                // Show a loading indicator while data is loading
                <tr>
                  <td colSpan={cols?.length}>
                    <div className="loader my-2">
                      <SkeletonTheme
                        baseColor="#82938e"
                        highlightColor="#3c4d41"
                        height={50}
                      >
                        <Skeleton count={10} />
                      </SkeletonTheme>
                    </div>
                  </td>
                </tr>
              ) : data?.length === 0 ? (
                // Show "No data found" message when there is no data
                <tr>
                  <td
                    colSpan={cols?.length}
                    className="px-6 py-4  text-center"
                  >
                    <div className="no-data-container">
                      <img
                        src="/assets/datanotfound.svg"
                        alt=""
                        className=""
                        style={{ width: "150px", border: "none", margin: "auto" }}
                      />
                      {/* <p className='px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider' >Data Not Found</p> */}
                    </div>
                  </td>
                </tr>
              ) : (
                // Render the data rows when data is available
                sortedData().map((item, rowIndex) => (
                  <tr key={rowIndex}>
                    {cols.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className={`px-6 py-4  text-center ${
                          col.colored ? "text-gradient font-semibold" : ""
                        }`}
                      >
                        {col.render
                          ? col.render(item, rowIndex)
                          : item[col.dataIndex]}
                      </td>
                    ))}
                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>
      </div>
      {
       ! isPaginationHide &&
        <Stack spacing={2} direction="row" className="mt-3">
          <select
            className=" p-2 bg-transparent rounded-lg  border border-primaryGray-700 overflow-x-auto text-sm"
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            style={{ borderRadius: "4px" }}
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
          <Pagination
            page={page}
            onChange={handlePageChange}
            count={totalPages}
            color="primary"
            variant="outlined"
            shape="rounded"
          />
        </Stack>
      }
    </>
  );
};

export default Table;
