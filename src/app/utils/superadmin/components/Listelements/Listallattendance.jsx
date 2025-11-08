


// "use client";
// import React, { useState, useEffect, useMemo } from "react";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Calendar, MoreHorizontal } from "lucide-react";
// import {
//   useReactTable,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   flexRender,
// } from "@tanstack/react-table";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import MonthPicker from "../basecomponent/MonthPicker";
// import { useSelector } from "react-redux";

// /* ✅ Status Badge Component */
// const StatusBadge = ({ status }) => {
//   const colorMap = {
//     "On Time": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
//     Late: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
//     "Half Day": "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
//     "Short Day": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
//     "Early Check Out": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
//     "Late Check Out": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
//     "On Time Check Out": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
//   };

//   return (
//     <Badge className={`${colorMap[status] || "bg-gray-100 text-gray-700"}`}>
//       {status}
//     </Badge>
//   );
// };

// /* ✅ DataTable Component */
// const DataTable = ({ columns, data }) => {
//   const [globalFilter, setGlobalFilter] = useState("");
//   const table = useReactTable({
//     data,
//     columns,
//     state: { globalFilter },
//     onGlobalFilterChange: setGlobalFilter,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//   });

//   return (
//     <div className="space-y-4">
//       {/* 🔍 Global Search */}
//       <div className="flex justify-between items-center">
//         <Input
//           placeholder="Search attendance..."
//           value={globalFilter ?? ""}
//           onChange={(e) => setGlobalFilter(e.target.value)}
//           className="w-64"
//         />
//       </div>

//       {/* 🧾 Table */}
//       <div className="rounded-md border overflow-hidden">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-100 dark:bg-gray-800">
//             {table.getHeaderGroups().map((headerGroup) => (
//               <tr key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <th
//                     key={header.id}
//                     className="p-3 text-left font-semibold cursor-pointer select-none"
//                     onClick={header.column.getToggleSortingHandler()}
//                   >
//                     {flexRender(header.column.columnDef.header, header.getContext())}
//                     {header.column.getIsSorted() === "asc"
//                       ? " ▲"
//                       : header.column.getIsSorted() === "desc"
//                       ? " ▼"
//                       : ""}
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody>
//             {table.getRowModel().rows.length > 0 ? (
//               table.getRowModel().rows.map((row) => (
//                 <tr
//                   key={row.id}
//                   className="hover:bg-gray-50 dark:hover:bg-gray-900 transition"
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <td key={cell.id} className="p-3 border-b">
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan={columns.length}
//                   className="text-center text-gray-500 dark:text-gray-400 p-4"
//                 >
//                   No records found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* 🔄 Pagination */}
//       <div className="flex justify-between items-center mt-4">
//         <div className="text-sm text-gray-600 dark:text-gray-400">
//           Showing {table.getRowModel().rows.length} of {data.length} records
//         </div>
//         <div className="flex gap-2">
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

// /* ✅ Main Attendance Component */
// const ListAllAttendance = () => {

//   const {employees} = useSelector((state) => state.Employee);

 

//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const [selectedMonth, setSelectedMonth] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [filteredAttendance, setFilteredAttendance] = useState([]);
//   const [activeTab, setActiveTab] = useState("checkin");

//   /* ✅ Filtering Logic */
//   useEffect(() => {
//     if (!selectedEmployee) return setFilteredAttendance([]);

//     const employee = employees.find((emp) => emp.employeeName === selectedEmployee);
//     if (!employee) return;

//     let list = [...employee.Attendance];

//     if (selectedMonth) {
//       list = list.filter((att) => att.date.slice(0, 7) === selectedMonth);
//     }

//     if (selectedStatus && selectedStatus !== "All Status") {
//       list = list.filter(
//         (att) =>
//           att.checkin.status === selectedStatus ||
//           att.checkout.status === selectedStatus
//       );
//     }

//     setFilteredAttendance(list);
//   }, [selectedEmployee, selectedMonth, selectedStatus, employees]);

//   const filteredAttendance = useMemo(() => {
//   if (!selectedEmployee) return [];

//   const employee = employees.find(emp => emp.employeeName === selectedEmployee);
//   if (!employee) return [];

//   let list = [...employee.Attendance];

//   if (selectedMonth) {
//     list = list.filter(att => att.date.slice(0, 7) === selectedMonth);
//   }

//   // Filter by status (checkin or checkout)
//   if (selectedStatus && selectedStatus !== "All Status") {
//     list = list.filter(att => 
//       att.checkin.status === selectedStatus || att.checkout.status === selectedStatus
//     );
//   }

//   return list;
// }, [employees, selectedEmployee, selectedMonth, selectedStatus]);

// // Count of each status (for summary)
// const statusCounts = useMemo(() => {
//   if (!selectedEmployee) return {};
//   const employee = employees.find(emp => emp.employeeName === selectedEmployee);
//   if (!employee) return {};

//   const counts = {};
//   employee.Attendance.forEach(att => {
//     const checkinStatus = att.checkin.status;
//     const checkoutStatus = att.checkout.status;

//     counts[checkinStatus] = (counts[checkinStatus] || 0) + 1;
//     counts[checkoutStatus] = (counts[checkoutStatus] || 0) + 1;
//   });

//   return counts;
// }, [employees, selectedEmployee]);


//   /* ✅ Table Columns */
//   const columns = useMemo(() => [
//     { accessorKey: "formattedDate", header: "Date" },
//     { accessorKey: "ip", header: "IP Address" },
//     { accessorKey: "time", header: "Time" },
//     { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.getValue("status")} /> },
//     { accessorKey: "stopwatchTime", header: "Duration" },
//     { accessorKey: "note", header: "Note", cell: ({ row }) => <span className="italic text-gray-600 dark:text-gray-400">{row.getValue("note")}</span> },
//     {
//       id: "actions",
//       header: "Actions",
//       cell: ({ row }) => {
//         const record = row.original;
//         return (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <MoreHorizontal />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Actions</DropdownMenuLabel>
//               <DropdownMenuItem onClick={() => navigator.clipboard.writeText(record.ip)}>Copy IP</DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem onClick={() => alert(`Note: ${record.note || "No note"}`)}>View Note</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         );
//       },
//     },
//   ], []);

//   /* ✅ Format Data for Table */
//   const formattedData = filteredAttendance.map((att) => {
//     const dateObj = new Date(att.date);
//     const month = dateObj.toLocaleString("default", { month: "long" });
//     const year = dateObj.getFullYear();

//     const data = {
//       attendanceId: att.attendanceId,
//       formattedDate: att.date.replace(/-/g, "/"),
//       stopwatchTime: att.checkout.stopwatchTime,
//       note: att.note,
//       month,
//       year,
//     };

//     if (activeTab === "checkin") {
//       data.ip = att.checkin.ip;
//       data.time = att.checkin.time;
//       data.status = att.checkin.status;
//       data.note = att.checkin.note 
      
//     } else {
//       data.ip = att.checkout.ip;
//       data.time = att.checkout.time;
//       data.status = att.checkout.status;
//       data.note = att.checkout.note 
//     }

//     return data;
//   });

//   return (
//     <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl shadow-md h-[85vh] overflow-auto">
//       <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
//         Employee Attendance Records
//       </h2>

//       {/* 🔽 Filters */}
//       <div className="flex flex-wrap gap-4 mb-6">
//         <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
//           <SelectTrigger className="w-52 border p-2 rounded-md dark:bg-gray-900 dark:text-white">
//             <SelectValue placeholder="Select Employee" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="All">Select Employee</SelectItem>
//             {employees.map((emp) => (
//               <SelectItem key={emp.id} value={emp.employeeName}>{emp.employeeName}</SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         <MonthPicker value={selectedMonth} onChange={setSelectedMonth} />

//         <Select value={selectedStatus} onValueChange={setSelectedStatus}>
//           <SelectTrigger className="w-52 border p-2 rounded-md dark:bg-gray-900 dark:text-white">
//             <SelectValue placeholder="All Status" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="All Status">All Status</SelectItem>
//             <SelectItem value="On Time">On Time</SelectItem>
//             <SelectItem value="Late">Late</SelectItem>
//             <SelectItem value="Half Day">Half Day</SelectItem>
//             <SelectItem value="Short Day">Short Day</SelectItem>
//             <SelectItem value="Early Check Out">Early Check Out</SelectItem>
//             <SelectItem value="Late Check Out">Late Check Out</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* 🕒 Tabs */}
//       <Tabs value={activeTab} onValueChange={setActiveTab}>
//         <TabsList className="mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
//           <TabsTrigger value="checkin">Check In</TabsTrigger>
//           <TabsTrigger value="checkout">Check Out</TabsTrigger>
//         </TabsList>



//         <TabsContent value="checkin">
//           {formattedData.length > 0 ? <DataTable columns={columns} data={formattedData} /> :
//             <p className="text-center text-gray-500 dark:text-gray-400 mt-6">Select employee to view data.</p>}
//         </TabsContent>

//         <TabsContent value="checkout">
//           {formattedData.length > 0 ? <DataTable columns={columns} data={formattedData} /> :
//             <p className="text-center text-gray-500 dark:text-gray-400 mt-6">Select employee to view data.</p>}
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default ListAllAttendance;



"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MonthPicker from "../basecomponent/MonthPicker";
import { useSelector } from "react-redux";

/* ✅ Status Badge Component */
const StatusBadge = ({ status }) => {
  const colorMap = {
    "On Time": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    Late: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    "Half Day": "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    "Short Day": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    "Early Check Out": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    "Late Check Out": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    "On Time Check Out": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  };

  return <Badge className={`${colorMap[status] || "bg-gray-100 text-gray-700"}`}>{status}</Badge>;
};

/* ✅ DataTable Component */
const DataTable = ({ columns, data }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search attendance..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-64"
        />
      </div>

      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-3 text-left font-semibold cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === "asc"
                      ? " ▲"
                      : header.column.getIsSorted() === "desc"
                      ? " ▼"
                      : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3 border-b">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center text-gray-500 dark:text-gray-400 p-4">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {table.getRowModel().rows.length} of {data.length} records
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ✅ Main Attendance Component */
const ListAllAttendance = () => {
  const { employees } = useSelector((state) => state.Employee);

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [activeTab, setActiveTab] = useState("checkin");

  /* ✅ Filtered Attendance */
  const filteredAttendance = useMemo(() => {
    if (!selectedEmployee) return [];
    const employee = employees.find((emp) => emp.employeeName === selectedEmployee);
    if (!employee) return [];

    let list = [...employee.Attendance];

    if (selectedMonth) list = list.filter((att) => att.date.slice(0, 7) === selectedMonth);
    if (selectedStatus && selectedStatus !== "All Status")
      list = list.filter((att) => att.checkin.status === selectedStatus || att.checkout.status === selectedStatus);

    return list;
  }, [employees, selectedEmployee, selectedMonth, selectedStatus]);

  /* ✅ Status Counts */
  const statusCounts = useMemo(() => {
    if (!selectedEmployee) return {};
    const employee = employees.find((emp) => emp.employeeName === selectedEmployee);
    if (!employee) return {};

    const counts = {};
    employee.Attendance.forEach((att) => {
      counts[att.checkin.status] = (counts[att.checkin.status] || 0) + 1;
      counts[att.checkout.status] = (counts[att.checkout.status] || 0) + 1;
    });
    return counts;
  }, [employees, selectedEmployee]);

  /* ✅ Table Columns */
  const columns = useMemo(
    () => [
      { accessorKey: "formattedDate", header: "Date" },
      { accessorKey: "ip", header: "IP Address" },
      { accessorKey: "time", header: "Time" },
      { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.getValue("status")} /> },
      { accessorKey: "stopwatchTime", header: "Duration" },
      { accessorKey: "note", header: "Note", cell: ({ row }) => <span className="italic text-gray-600 dark:text-gray-400">{row.getValue("note")}</span> },
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
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(record.ip)}>Copy IP</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => alert(`Note: ${record.note || "No note"}`)}>View Note</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  /* ✅ Format Data for Table */
  const formattedData = useMemo(() => {
    return filteredAttendance.map((att) => {
      return {
        attendanceId: att.attendanceId,
        formattedDate: att.date.replace(/-/g, "/"),
        stopwatchTime: att.checkout.stopwatchTime,
        note: activeTab === "checkin" ? att.checkin.note : att.checkout.note,
        ip: activeTab === "checkin" ? att.checkin.ip : att.checkout.ip,
        time: activeTab === "checkin" ? att.checkin.time : att.checkout.time,
        status: activeTab === "checkin" ? att.checkin.status : att.checkout.status,
      };
    });
  }, [filteredAttendance, activeTab]);

  return (
    <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl shadow-md h-[85vh] overflow-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Employee Attendance Records</h2>

      {/* 🔽 Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
          <SelectTrigger className="w-52 border p-2 rounded-md dark:bg-gray-900 dark:text-white">
            <SelectValue placeholder="Select Employee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Select Employee</SelectItem>
            {employees.map((emp) => (
              <SelectItem key={emp.id} value={emp.employeeName}>{emp.employeeName}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <MonthPicker value={selectedMonth} onChange={setSelectedMonth} />

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-52 border p-2 rounded-md dark:bg-gray-900 dark:text-white">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Status">All Status</SelectItem>
            <SelectItem value="On Time">On Time</SelectItem>
            <SelectItem value="Late">Late</SelectItem>
            <SelectItem value="Half Day">Half Day</SelectItem>
            <SelectItem value="Short Day">Short Day</SelectItem>
            <SelectItem value="Early Check Out">Early Check Out</SelectItem>
            <SelectItem value="Late Check Out">Late Check Out</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 🕒 Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <TabsTrigger value="checkin">Check In</TabsTrigger>
          <TabsTrigger value="checkout">Check Out</TabsTrigger>
        </TabsList>

        <div className="mb-4 flex flex-wrap gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
  {[
    "On Time",
    "Late",
    "Half Day",
    "Short Day",
    "Early Check Out",
    "Late Check Out",
    "On Time Check Out",
  ].map((status) => (
    <span key={status} className="flex items-center gap-1">
      <StatusBadge status={status} /> {statusCounts[status] || 0} day{(statusCounts[status] || 0) !== 1 ? "s" : ""}
    </span>
  ))}
</div>

        <TabsContent value="checkin">
          {formattedData.length > 0 ? <DataTable columns={columns} data={formattedData} /> : <p className="text-center text-gray-500 dark:text-gray-400 mt-6">Select employee to view data.</p>}
        </TabsContent>

        <TabsContent value="checkout">
          {formattedData.length > 0 ? <DataTable columns={columns} data={formattedData} /> : <p className="text-center text-gray-500 dark:text-gray-400 mt-6">Select employee to view data.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ListAllAttendance;
