// "use client";
// import { createemployees } from "@/features/Slice/EmployeeSlice";
// import axios from "axios";
// import React, { useEffect } from "react";
// import toast from "react-hot-toast";
// import { useDispatch, useSelector } from "react-redux";

// const Listallattendance = () => {
//   const dispatch = useDispatch();
//   const {employees }= useSelector((state)=> state.Employee)


//   useEffect(() => {
//     const getallemployess = async () => {
//       try {
//         const res = await axios.get("/api/get-all-employees");

//         if (res.data.success) {
//           dispatch(createemployees(res.data.employees));

//         }
//       } catch (error) {
//         console.log(error);
//         toast.error(error.response.data.error);
//       }
//     };

//     getallemployess();
//   }, []);

//   return (
//     <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl shadow-md h-[64vh] overflow-auto">

//     </div>
//   );
// };

// export default Listallattendance;


"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createemployees } from "@/features/Slice/EmployeeSlice";

const Listallattendance = () => {
  const dispatch = useDispatch();
  const { employees } = useSelector((state) => state.Employee);

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredAttendance, setFilteredAttendance] = useState([]);

  // Fetch employees
  useEffect(() => {
    const getAllEmployees = async () => {
      try {
        const res = await axios.get("/api/get-all-employees");
        if (res.data.success) {
          dispatch(createemployees(res.data.employees));
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.error || "Failed to load employees");
      }
    };

    getAllEmployees();
  }, [dispatch]);

  // Filter attendance when filters change
  useEffect(() => {
    if (!selectedEmployee) return;

    const employee = employees.find(
      (emp) => emp.employeeName === selectedEmployee
    );
    if (!employee || !employee.Attendance) return;

    let attendanceList = [...employee.Attendance];

    // 🔹 Filter by month (if selected)
    if (selectedMonth) {
      attendanceList = attendanceList.filter((att) => {
        const date = new Date(att.date);
        const monthYear = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        return monthYear === selectedMonth;
      });
    }

    // 🔹 Filter by status (Late, Half Day, etc.)
    if (selectedStatus) {
      attendanceList = attendanceList.filter(
        (att) => att.status === selectedStatus
      );
    }

    setFilteredAttendance(attendanceList);
  }, [selectedEmployee, selectedMonth, selectedStatus, employees]);

  return (
    <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl shadow-md h-[64vh] overflow-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Employee Attendance Records
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Employee Dropdown */}
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="border p-2 rounded-md dark:bg-gray-900 dark:text-white"
        >
          <option value="">Select Employee</option>
          {employees?.map((emp) => (
            <option key={emp.id} value={emp.employeeName}>
              {emp.employeeName}
            </option>
          ))}
        </select>

        {/* Month Filter */}
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border p-2 rounded-md dark:bg-gray-900 dark:text-white"
        />

        {/* Status Dropdown */}
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
        </select>
      </div>

      {/* Attendance Table */}
      {filteredAttendance.length > 0 ? (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-2 border-b dark:border-gray-700">Date</th>
              <th className="p-2 border-b dark:border-gray-700">Check In</th>
              <th className="p-2 border-b dark:border-gray-700">Check Out</th>
              <th className="p-2 border-b dark:border-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.map((att, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-900 transition"
              >
                <td className="p-2 border-b dark:border-gray-700">
                  {new Date(att.date).toLocaleDateString()}
                </td>
                <td className="p-2 border-b dark:border-gray-700">
                  {att.checkin.status || "—"}
                </td>
                <td className="p-2 border-b dark:border-gray-700">
                  {att.checkout.status || "—"}
                </td>
                <td className="p-2 border-b dark:border-gray-700">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      att.status === "On Time"
                        ? "bg-green-100 text-green-700"
                        : att.status === "Late"
                        ? "bg-yellow-100 text-yellow-700"
                        : att.status === "Half Day"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {att.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : selectedEmployee ? (
        <p className="text-gray-500 dark:text-gray-400 text-center mt-6">
          No attendance records found for selected filters.
        </p>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center mt-6">
          Please select an employee to view attendance.
        </p>
      )}
    </div>
  );
};

export default Listallattendance;
