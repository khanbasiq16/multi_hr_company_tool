// "use client";
// import React from "react";
// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { ChevronDown, MoreHorizontal } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Checkbox } from "@/components/ui/checkbox";

// // ✅ Reusable Status Badge Component
// const StatusBadge = ({ status }) => {
//   let colorClasses = "";

//   switch (status) {
//     case "On Time Check Out":
//       colorClasses =
//         "bg-green-500/20 text-green-700 border border-green-400 dark:bg-green-500/30 dark:text-green-300";
//       break;
//     case "Late Check Out":
//       colorClasses =
//         "bg-yellow-500/20 text-yellow-700 border border-yellow-400 dark:bg-yellow-500/30 dark:text-yellow-300";
//       break;
//     case "Early Check Out":
//       colorClasses =
//         "bg-blue-500/20 text-blue-700 border border-blue-400 dark:bg-blue-500/30 dark:text-blue-300";
//       break;
//     case "Absent":
//       colorClasses =
//         "bg-red-500/20 text-red-700 border border-red-400 dark:bg-red-500/30 dark:text-red-300";
//       break;
//     default:
//       colorClasses =
//         "bg-gray-500/20 text-gray-700 border border-gray-400 dark:bg-gray-700/40 dark:text-gray-300";
//       break;
//   }

//   return (
//     <span
//       className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 shadow-sm ${colorClasses}`}
//     >
//       {status || "N/A"}
//     </span>
//   );
// };

// // ✅ Main Table Component
// const CheckOutTable = ({ data = [] }) => {
//   const [sorting, setSorting] = React.useState([]);
//   const [columnVisibility, setColumnVisibility] = React.useState({});
//   const [rowSelection, setRowSelection] = React.useState({});
//   const [searchDate, setSearchDate] = React.useState("");
//   const [searchMonth, setSearchMonth] = React.useState("");
//   const [searchYear, setSearchYear] = React.useState("");

//   // ✅ Process Data
//   const processedData = React.useMemo(() => {
//     return data.map((item, index) => {
//       let dateObj;
//       if (item.date && item.date.includes("/")) {
//         const [day, month, year] = item.date.split("/");
//         dateObj = new Date(`${year}-${month}-${day}`);
//       } else {
//         dateObj = new Date(item.date || item.createdAt || Date.now());
//       }

//       const status = item.status || "N/A";

//       return {
//         id: item.id || index,
//         ip: item.ip || "N/A",
//         time: item.time || "N/A",
//         stopwatchTime: item.stopwatchTime || "—",
//         status,
//         note: item.note || "—",
//         dateObj,
//         formattedDate: dateObj.toLocaleDateString("en-GB"),
//         month: dateObj.toLocaleString("default", { month: "long" }),
//         year: dateObj.getFullYear().toString(),
//       };
//     });
//   }, [data]);

//   // ✅ Filters
//   const filteredData = React.useMemo(() => {
//     return processedData.filter((item) => {
//       const matchDate = searchDate
//         ? item.dateObj.toISOString().split("T")[0] === searchDate
//         : true;
//       const matchMonth = searchMonth
//         ? item.month.toLowerCase().includes(searchMonth.toLowerCase())
//         : true;
//       const matchYear = searchYear ? item.year.includes(searchYear) : true;
//       return matchDate && matchMonth && matchYear;
//     });
//   }, [processedData, searchDate, searchMonth, searchYear]);

//   // ✅ Columns
//   const columns = React.useMemo(
//     () => [
//       {
//         id: "select",
//         header: ({ table }) => (
//           <Checkbox
//             checked={
//               table.getIsAllPageRowsSelected() ||
//               (table.getIsSomePageRowsSelected() && "indeterminate")
//             }
//             onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//             aria-label="Select all"
//           />
//         ),
//         cell: ({ row }) => (
//           <Checkbox
//             checked={row.getIsSelected()}
//             onCheckedChange={(value) => row.toggleSelected(!!value)}
//             aria-label="Select row"
//           />
//         ),
//         enableSorting: false,
//         enableHiding: false,
//       },
//       { accessorKey: "ip", header: "IP Address" },
//       { accessorKey: "time", header: "Time" },
//       { accessorKey: "stopwatchTime", header: "Total Time" },
//       {
//         accessorKey: "status",
//         header: "Status",
//         cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
//       },
//       {
//         accessorKey: "note",
//         header: "Note",
//         cell: ({ row }) => (
//           <div className="italic text-gray-600 dark:text-gray-400">
//             {row.getValue("note")}
//           </div>
//         ),
//       },
//       { accessorKey: "formattedDate", header: "Date" },
//       { accessorKey: "month", header: "Month" },
//       { accessorKey: "year", header: "Year" },
//       {
//         id: "actions",
//         header: "Actions",
//         cell: ({ row }) => {
//           const record = row.original;
//           return (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" className="h-8 w-8 p-0">
//                   <MoreHorizontal />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                 <DropdownMenuItem
//                   onClick={() => navigator.clipboard.writeText(record.ip)}
//                 >
//                   Copy IP
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem
//                   onClick={() => alert(`Note: ${record.note || "No note"}`)}
//                 >
//                   View Note
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           );
//         },
//       },
//     ],
//     []
//   );

//   // ✅ React Table Config
//   const table = useReactTable({
//     data: filteredData,
//     columns,
//     state: { sorting, columnVisibility, rowSelection },
//     onSortingChange: setSorting,
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//   });

//   // ✅ Render Table
//   return (
//     <div className="w-full">
//       {/* 🔍 Filters */}
//       <div className="flex flex-wrap gap-2 items-center py-4">
//         <Input
//           type="date"
//           value={searchDate}
//           onChange={(e) => setSearchDate(e.target.value)}
//           className="max-w-[200px]"
//         />
//         <Input
//           placeholder="Month (e.g. March)"
//           value={searchMonth}
//           onChange={(e) => setSearchMonth(e.target.value)}
//           className="max-w-[200px]"
//         />
//         <Input
//           placeholder="Year (e.g. 2025)"
//           value={searchYear}
//           onChange={(e) => setSearchYear(e.target.value)}
//           className="max-w-[150px]"
//         />

//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" className="ml-auto">
//               Columns <ChevronDown className="ml-1 h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             {table
//               .getAllColumns()
//               .filter((column) => column.getCanHide())
//               .map((column) => (
//                 <DropdownMenuCheckboxItem
//                   key={column.id}
//                   checked={column.getIsVisible()}
//                   onCheckedChange={(value) => column.toggleVisibility(!!value)}
//                   className="capitalize"
//                 >
//                   {column.id}
//                 </DropdownMenuCheckboxItem>
//               ))}
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>

//       {/* 🧾 Table */}
//       <div className="overflow-hidden rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <TableHead key={header.id}>
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>

//           <TableBody>
//             {table.getRowModel().rows.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   No results found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* ⏩ Pagination */}
//       <div className="flex items-center justify-end space-x-2 py-4">
//         <div className="text-muted-foreground flex-1 text-sm">
//           {table.getFilteredSelectedRowModel().rows.length} of{" "}
//           {filteredData.length} selected.
//         </div>
//         <div className="space-x-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//           >
//             Previous
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckOutTable;


"use client";
import React from "react";
import axios from "axios";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useParams } from "next/navigation";

// ✅ Status Badge
const StatusBadge = ({ status }) => {
  let colorClasses = "";

  switch (status) {
    case "On Time Check Out":
      colorClasses =
        "bg-green-500/20 text-green-700 border border-green-400 dark:bg-green-500/30 dark:text-green-300";
      break;
    case "Late Check Out":
      colorClasses =
        "bg-yellow-500/20 text-yellow-700 border border-yellow-400 dark:bg-yellow-500/30 dark:text-yellow-300";
      break;
    case "Early Check Out":
      colorClasses =
        "bg-blue-500/20 text-blue-700 border border-blue-400 dark:bg-blue-500/30 dark:text-blue-300";
      break;
    case "Absent":
      colorClasses =
        "bg-red-500/20 text-red-700 border border-red-400 dark:bg-red-500/30 dark:text-red-300";
      break;
    default:
      colorClasses =
        "bg-gray-500/20 text-gray-700 border border-gray-400 dark:bg-gray-700/40 dark:text-gray-300";
      break;
  }

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 shadow-sm ${colorClasses}`}
    >
      {status || "N/A"}
    </span>
  );
};

// ✅ Main Component
const CheckOutTable = ({ data = [], setemployee }) => {
  const [sorting, setSorting] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [searchDate, setSearchDate] = React.useState("");
  const [searchMonth, setSearchMonth] = React.useState("");
  const [searchYear, setSearchYear] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const { user } = useSelector((state) => state.User);
  const { employeeid } = useParams();

  // ✅ Process Data
  const processedData = React.useMemo(() => {
    return data.map((item, index) => {
      let dateObj;
      if (item.date && item.date.includes("/")) {
        const [day, month, year] = item.date.split("/");
        dateObj = new Date(`${year}-${month}-${day}`);
      } else {
        dateObj = new Date(item.date || item.createdAt || Date.now());
      }

      const status =
        item.status ||
        item.checkout?.status ||
        item.checkin?.status ||
        "N/A";

      return {
        id: item.id || item._id || index,
        ip: item.ip || item.checkout?.ip || "N/A",
        time: item.time || item.checkout?.time || "N/A",
        stopwatchTime: item.stopwatchTime || item.checkout?.stopwatchTime || "—",
        status,
        note: item.note || item.checkout?.note || "—",
        dateObj,
        formattedDate: dateObj.toLocaleDateString("en-GB"),
        month: dateObj.toLocaleString("default", { month: "long" }),
        year: dateObj.getFullYear().toString(),
      };
    });
  }, [data]);

  // ✅ Filtered Data
  const filteredData = React.useMemo(() => {
    return processedData.filter((item) => {
      const matchDate = searchDate
        ? item.dateObj.toISOString().split("T")[0] === searchDate
        : true;
      const matchMonth = searchMonth
        ? item.month.toLowerCase().includes(searchMonth.toLowerCase())
        : true;
      const matchYear = searchYear ? item.year.includes(searchYear) : true;
      return matchDate && matchMonth && matchYear;
    });
  }, [processedData, searchDate, searchMonth, searchYear]);

  // ✅ Columns
  const columns = React.useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      { accessorKey: "ip", header: "IP Address" },
      { accessorKey: "time", header: "Time" },
      { accessorKey: "stopwatchTime", header: "Total Time" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
      },
      {
        accessorKey: "note",
        header: "Note",
        cell: ({ row }) => (
          <div className="italic text-gray-600 dark:text-gray-400">
            {row.getValue("note")}
          </div>
        ),
      },
      { accessorKey: "formattedDate", header: "Date" },
      { accessorKey: "month", header: "Month" },
      { accessorKey: "year", header: "Year" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const record = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(record.ip)}
                >
                  Copy IP
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => alert(`Note: ${record.note || "No note"}`)}
                >
                  View Note
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  // ✅ React Table
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // ✅ Update Status Handler
  const handleStatusUpdate = async (newStatus) => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (!selectedRows.length) {
      toast.error("Please select at least one row");
      return;
    }

    try {
      setLoading(true);
      const ids = selectedRows.map((r) => r.original.id);

      const res = await axios.post("/api/attendance/updatestatuscheckout", {
        ids,
        status: newStatus,
        employeeid,
      });

      if (res.data.success) {
        toast.success(`Updated ${ids.length} record(s) to "${newStatus}"`);
        setemployee(res.data.employee);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
      table.resetRowSelection();
    }
  };

  return (
    <div className="w-full">
      {/* 🔍 Filters + Admin Controls */}
      <div className="flex flex-wrap gap-2 items-center py-4">
        <Input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="max-w-[150px]"
        />
        <Input
          placeholder="Month (e.g. March)"
          value={searchMonth}
          onChange={(e) => setSearchMonth(e.target.value)}
          className="max-w-[200px]"
        />
        <Input
          placeholder="Year (e.g. 2025)"
          value={searchYear}
          onChange={(e) => setSearchYear(e.target.value)}
          className="max-w-[150px]"
        />

        {user?.role === "superAdmin" && (
          <Select
            onValueChange={(value) => handleStatusUpdate(value)}
            disabled={loading}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={loading ? "Updating..." : "Change Status"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="On Time Check Out">On Time Check Out</SelectItem>
              <SelectItem value="Late Check Out">Late Check Out</SelectItem>
              <SelectItem value="Early Check Out">Early Check Out</SelectItem>
              <SelectItem value="Absent">Absent</SelectItem>
            </SelectContent>
          </Select>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  className="capitalize"
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 🧾 Table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {filteredData.length} selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckOutTable;
