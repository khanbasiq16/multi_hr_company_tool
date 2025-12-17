"use client";
import React, { useState, useMemo } from "react";
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
import { Loader2, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MonthPicker from "../basecomponent/MonthPicker";
import { useDispatch, useSelector } from "react-redux";
import Listallattendancewithgraph from "./Listallattendancewithgraph";
import axios from "axios";
import toast from "react-hot-toast";
import AttendanceImportDialog from "../dialog/AttendanceImportDialog";
import { createemployees } from "@/features/Slice/EmployeeSlice";

/* Status Badge Component */
const StatusBadge = ({ status }) => {
  const colorMap = {
    "On Time":
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    Late: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    "Half Day": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    "Short Day":
      "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    "Early Check Out":
      "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    "Late Check Out":
      "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    "On Time Check Out":
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    Absent: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <Badge className={`${colorMap[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </Badge>
  );
};

/* DataTable Component */
const DataTable = ({ columns, data, rowSelection, setRowSelection, selectedEmployee, setSelectedEmployee, activeTab }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [deleteloading, setDeleteloading] = useState(false);

  const { employees } = useSelector((state) => state.Employee);
  const dispatch = useDispatch()

  const handledatadelete = async (selectedRows) => {
    setDeleteloading(true);


    try {
      let filteredData = [];

      for (let i = 0; i < selectedRows.length; i++) {
        filteredData.push(selectedRows[i].attendanceId);
      }

      const employee = employees.find((emp) => emp.employeeName === selectedEmployee);



      const res = await axios.post("/api/attendance/delete-attendance", {
        attendanceIds: filteredData,
        employeeId: employee.employeeId,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setSelectedEmployee(res.data.employee);

        setDeleteloading(false);
      }

    }

    catch (error) {
      console.log(error.message);
      toast.error("Attendance deleted failed");
      setDeleteloading(false);

    }



  }


  const handlechangestatus = async (status, selectedRows) => {

    toast.loading("Updating Attendance Status...");

    try {
      const attendanceIds = selectedRows.map(row => row.attendanceId);

      const employee = employees.find(
        (emp) => emp.employeeName === selectedEmployee
      );


      let url = activeTab === "checkin" ? "/api/attendance/change-checkin-attendance-status" : "/api/attendance/change-checkout-attendance-status"

      const res = await axios.post(url, {
        ids: attendanceIds,
        employeeid: employee.employeeId,
        status,
      }
        , {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(createemployees(res.data.allemployees))
        toast.dismiss();
      }

    } catch (error) {
      console.log(error.message);
      console.log(error);
      toast.error("Attendance update failed");
      toast.dismiss();
    }

  };


  const table = useReactTable({
    data: data,
    columns,
    state: { globalFilter, rowSelection },
    onGlobalFilterChange: setGlobalFilter,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });



  const CHECKIN_STATUSES = [
    "On Time",
    "Late",
    "Half Day",
    "Short Day",
    "Absent",
  ];


  const CHECKOUT_STATUSES = [
    "On Time Check Out",
    "Late Check Out",
    "Early Check Out",
    "Absent",
  ];


  return (
    <div className="space-y-4">
      {/* Search & Delete */}
   


      <div className="flex flex-col gap-3 mb-2 sm:flex-row sm:justify-between sm:items-center">

        {/* LEFT SIDE */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">

          {/* Search */}
          <Input
            placeholder="Search attendance..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full sm:w-64"
          />

          {/* Change Status Select */}
          {Object.keys(rowSelection).length > 0 && (
            <>
              {activeTab === "checkin" ? (
                <Select
                  onValueChange={(status) =>
                    handlechangestatus(
                      status,
                      table.getSelectedRowModel().rows.map(row => row.original)
                    )
                  }
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Change Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {CHECKIN_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Select
                  onValueChange={(status) =>
                    handlechangestatus(
                      status,
                      table.getSelectedRowModel().rows.map(row => row.original)
                    )
                  }
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Change Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {CHECKOUT_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex justify-between gap-3 sm:justify-end sm:items-center">

          <AttendanceImportDialog selectedEmployee={selectedEmployee} />

          <Button
            variant="destructive"
            className="w-10 sm:w-auto"
            disabled={deleteloading || Object.keys(rowSelection).length === 0}
            onClick={() => {
              const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
              handledatadelete(selectedRows);
            }}
          >
            {deleteloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </Button>

        </div>
      </div>


      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-3 text-left font-semibold cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler?.()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
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
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3 border-b">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center text-gray-500 dark:text-gray-400 p-4"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {table.getRowModel().rows.length} of {data.length} records
        </div>
        <div className="flex gap-2">
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

const ListAllAttendance = () => {
  const { employees } = useSelector((state) => state.Employee);

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [activeTab, setActiveTab] = useState("checkin");
  const [rowSelection, setRowSelection] = useState({});

  const absentPercentage = 10;
  const absentConversion = {
    Late: { count: 3, toAbsent: 1 },
    "Half Day": { count: 2, toAbsent: 1 },
    "Short Day": { count: 3, toAbsent: 1 },
  };

  const filteredAttendance = useMemo(() => {
    if (!selectedEmployee) return [];
    const employee = employees.find(
      (emp) => emp.employeeName === selectedEmployee
    );
    if (!employee) return [];

    let list = [...employee.Attendance];

    if (selectedMonth && selectedMonth !== "") {
      list = list.filter((att) => {
        const [day, month, year] = att.date.split("/");
        const attendanceMonth = `${year}-${month}`;
        return attendanceMonth === selectedMonth;
      });
    }

    return list
      .map((att) => ({
        ...att,
        checkin: att.checkin || {
          status: "Absent",
          ip: "-",
          time: "-",
          note: "-",
          stopwatchTime: "-",
        },
        checkout: att.checkout || {
          status: "Absent",
          ip: "-",
          time: "-",
          note: "-",
          stopwatchTime: "-",
        },
      }))
      .filter((att) => {
        if (selectedStatus && selectedStatus !== "All Status") {
          const statusToCheck =
            activeTab === "checkin" ? att.checkin.status : att.checkout.status;
          return statusToCheck === selectedStatus;
        }
        return true;
      });
  }, [employees, selectedEmployee, selectedMonth, selectedStatus, activeTab]);

  const statusCounts = useMemo(() => {
    const counts = {};
    filteredAttendance.forEach((att) => {
      const statusToCheck =
        activeTab === "checkin" ? att.checkin.status : att.checkout.status;
      counts[statusToCheck] = (counts[statusToCheck] || 0) + 1;
    });
    return counts;
  }, [filteredAttendance, activeTab]);

  const totalAbsentDays = useMemo(() => {
    if (!selectedEmployee || activeTab !== "checkin") return 0;
    let counts = { Late: 0, "Half Day": 0, "Short Day": 0, Absent: 0 };

    filteredAttendance.forEach((att) => {
      const status = att.checkin.status;
      counts[status] = (counts[status] || 0) + 1;
    });

    let effectiveAbsent = counts["Absent"] || 0;

    Object.keys(absentConversion).forEach((status) => {
      const { count, toAbsent } = absentConversion[status];
      const conversion = Math.floor((counts[status] || 0) / count) * toAbsent;
      effectiveAbsent += conversion;
    });

    return effectiveAbsent;
  }, [filteredAttendance, selectedEmployee, activeTab]);



  const getDaysInMonth = (monthStr) => {
    if (!monthStr) return 30; // default
    const [year, month] = monthStr.split("-");
    return new Date(year, parseInt(month), 0).getDate();
  };

  const totalDeduction = useMemo(() => {
    if (!selectedEmployee || activeTab !== "checkin") return 0;
    const selectedEmp = employees.find(
      (emp) => emp.employeeName === selectedEmployee
    );
    if (!selectedEmp) return 0;

    const salary = selectedEmp.employeeSalary || 0;
    const daysInMonth = getDaysInMonth(selectedMonth);
    const perDaySalary = salary / daysInMonth;

    return Math.round(perDaySalary * totalAbsentDays);
  }, [totalAbsentDays, employees, selectedEmployee, selectedMonth, activeTab]);

  /* Columns */
  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      { accessorKey: "formattedDate", header: "Date" },
      { accessorKey: "ip", header: "IP Address" },
      { accessorKey: "time", header: "Time" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
      },
      {
        accessorKey: "stopwatchTime",
        header: "Duration",
        cell: ({ row }) =>
          row.original[
          "stopwatchTime"
          ],
      },
      {
        accessorKey: "note",
        header: "Note",
        cell: ({ row }) => (
          <span className="italic text-gray-600 dark:text-gray-400">
            {row.getValue("note")}
          </span>
        ),
      },
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
    [activeTab]
  );

  const formattedData = useMemo(() => {
    return filteredAttendance.map((att) => ({
      attendanceId: att.id,
      formattedDate: att.date.replace(/-/g, "/"),
      stopwatchTime: att.checkout.stopwatchTime,
      note: activeTab === "checkin" ? att.checkin.note : att.checkout.note,
      ip: activeTab === "checkin" ? att.checkin.ip : att.checkout.ip,
      time: activeTab === "checkin" ? att.checkin.time : att.checkout.time,
      status:
        activeTab === "checkin" ? att.checkin.status : att.checkout.status,
    }));
  }, [filteredAttendance, activeTab]);

  const selectedEmp = employees.find(
    (emp) => emp.employeeName === selectedEmployee
  );
  const totalSalary = selectedEmp?.employeeSalary || 0;
  const netSalary = totalSalary - totalDeduction;

  return (
    <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl shadow-md h-[85vh] overflow-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Employee Attendance Records
      </h2>

      {/* Salary Info (only for Check-In) */}
      {selectedEmployee && activeTab === "checkin" && (
        <div className="flex gap-6 mb-4 text-sm font-medium">
          <span>
            Total Salary: <strong>{totalSalary} PKR</strong>
          </span>
          <span>
            Absent Days: <strong>{totalAbsentDays}</strong>
          </span>
          <span>
            Deduction:{" "}
            <strong className="text-red-600">{totalDeduction} PKR</strong>
          </span>
          <span>
            Net Salary: <strong className="text-green-600">{netSalary} PKR</strong>
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
          <SelectTrigger className="w-52 border p-2 rounded-md dark:bg-gray-900 dark:text-white">
            <SelectValue placeholder="Select Employee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Select Employee</SelectItem>
            {employees.map((emp) => (
              <SelectItem key={emp.id} value={emp.employeeName}>
                {emp.employeeName}
              </SelectItem>
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
            <SelectItem value="Absent">Absent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <TabsTrigger value="checkin">Check In</TabsTrigger>
          <TabsTrigger value="checkout">Check Out</TabsTrigger>
        </TabsList>

        {/* Status Counts */}
        <div className="mb-4 flex flex-wrap gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
          {Object.keys(statusCounts).map((status) => (
            <span key={status} className="flex items-center gap-1">
              <StatusBadge status={status} /> {statusCounts[status]} day
              {statusCounts[status] !== 1 ? "s" : ""}
            </span>
          ))}
        </div>

        <TabsContent value="checkin">
          {formattedData.length > 0 ? (
            <DataTable
              columns={columns}
              data={formattedData}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              selectedEmployee={selectedEmployee}
              setSelectedEmployee={setSelectedEmployee}
              activeTab={activeTab}
            />
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
              Select employee to view data.
            </p>
          )}
        </TabsContent>

        <TabsContent value="checkout">
          {formattedData.length > 0 ? (
            <DataTable
              columns={columns}
              data={formattedData}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              selectedEmployee={selectedEmployee}
              selectedEmployeeData={setSelectedEmployee}
              activeTab={activeTab}
            />
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
              Select employee to view data.
            </p>
          )}
        </TabsContent>
      </Tabs>

      {/* Attendance Graph */}
      <Listallattendancewithgraph
        data={filteredAttendance}
        activeTab={activeTab}
        selectedMonth={selectedMonth}
      />


    </div>
  );
};

export default ListAllAttendance;


