"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Clock, MapPin } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";

const StatusBadge = ({ status }) => {
  const colorMap = {
    "On Time": "bg-green-100 text-green-700",
    Late: "bg-yellow-100 text-yellow-700",
    "Half Day": "bg-orange-100 text-orange-700",
    "Short Day": "bg-red-100 text-red-700",
    "Early Check Out": "bg-blue-100 text-blue-700",
    "Late Check Out": "bg-purple-100 text-purple-700",
  };
  return (
    <Badge className={`${colorMap[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </Badge>
  );
};

const ListAllAttendance = () => {
  const [employees] = useState([
    {
      id: 1,
      employeeName: "John Doe",
      Attendance: [
        {
          attendanceId: "A1",
          date: "2025-01-03",
          checkin: {
            time: "09:15 AM",
            ip: "192.168.1.10",
          },
          checkout: {
            time: "05:10 PM",
            ip: "192.168.1.12",
          },
          status: "Late",
          stopwatchTime: "07:55:00",
          note: "Arrived late due to traffic",
        },
        {
          attendanceId: "A2",
          date: "2025-01-04",
          checkin: {
            time: "09:00 AM",
            ip: "192.168.1.11",
          },
          checkout: {
            time: "06:00 PM",
            ip: "192.168.1.14",
          },
          status: "On Time",
          stopwatchTime: "09:00:00",
          note: "Full working day",
        },
      ],
    },
    {
      id: 2,
      employeeName: "Alice Smith",
      Attendance: [
        {
          attendanceId: "B1",
          date: "2025-01-03",
          checkin: {
            time: "08:55 AM",
            ip: "192.168.1.30",
          },
          checkout: {
            time: "04:55 PM",
            ip: "192.168.1.33",
          },
          status: "On Time",
          stopwatchTime: "08:00:00",
          note: "Good performance",
        },
        {
          attendanceId: "B2",
          date: "2025-01-04",
          checkin: {
            time: "10:10 AM",
            ip: "192.168.1.35",
          },
          checkout: {
            time: "05:40 PM",
            ip: "192.168.1.38",
          },
          status: "Late Check Out",
          stopwatchTime: "07:30:00",
          note: "Stayed late for extra work",
        },
      ],
    },
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [activeTab, setActiveTab] = useState("checkin");

  // Filtering logic
  useEffect(() => {
    if (!selectedEmployee) return setFilteredAttendance([]);
    const employee = employees.find(
      (emp) => emp.employeeName === selectedEmployee
    );
    if (!employee) return;

    let list = [...employee.Attendance];

    if (selectedMonth) {
      list = list.filter((att) => {
        const date = new Date(att.date);
        const monthYear = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        return monthYear === selectedMonth;
      });
    }

    if (selectedStatus) {
      list = list.filter((att) => att.status === selectedStatus);
    }

    setFilteredAttendance(list);
  }, [selectedEmployee, selectedMonth, selectedStatus, employees]);

  // ✅ Columns for professional DataTable
  const columns = useMemo(
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
      { accessorKey: "formattedDate", header: "Date" },
      { accessorKey: "ip", header: "IP Address" },
      { accessorKey: "time", header: "Time" },
      { accessorKey: "stopwatchTime", header: "Stopwatch" },
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

  // ✅ Format attendance data for the DataTable
  const formattedData = filteredAttendance.map((att) => {
    const dateObj = new Date(att.date);
    const month = dateObj.toLocaleString("default", { month: "long" });
    const year = dateObj.getFullYear();
    const data = {
      attendanceId: att.attendanceId,
      formattedDate: att.date,
      stopwatchTime: att.stopwatchTime,
      status: att.status,
      note: att.note,
      month,
      year,
    };
    if (activeTab === "checkin") {
      data.ip = att.checkin.ip;
      data.time = att.checkin.time;
    } else {
      data.ip = att.checkout.ip;
      data.time = att.checkout.time;
    }
    return data;
  });

  return (
    <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl shadow-md h-[85vh] overflow-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Employee Attendance Records
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="border p-2 rounded-md dark:bg-gray-900 dark:text-white"
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.employeeName}>
              {emp.employeeName}
            </option>
          ))}
        </select>

        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border p-2 rounded-md dark:bg-gray-900 dark:text-white"
        />

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border p-2 rounded-md dark:bg-gray-900 dark:text-white"
        >
          <option value="">All Status</option>
          <option value="On Time">On Time</option>
          <option value="Late">Late</option>
          <option value="Half Day">Half Day</option>
          <option value="Short Day">Short Day</option>
          <option value="Early Check Out">Early Check Out</option>
          <option value="Late Check Out">Late Check Out</option>
        </select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <TabsTrigger value="checkin">Check In</TabsTrigger>
          <TabsTrigger value="checkout">Check Out</TabsTrigger>
        </TabsList>

        <TabsContent value="checkin">
          {formattedData.length > 0 ? (
            <DataTable columns={columns} data={formattedData} />
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
              {selectedEmployee
                ? "No records found for selected filters."
                : "Please select an employee to view data."}
            </p>
          )}
        </TabsContent>

        <TabsContent value="checkout">
          {formattedData.length > 0 ? (
            <DataTable columns={columns} data={formattedData} />
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
              {selectedEmployee
                ? "No records found for selected filters."
                : "Please select an employee to view data."}
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ListAllAttendance;
