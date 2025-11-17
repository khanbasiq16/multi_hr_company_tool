"use client";
import React, { useEffect, useState } from "react";
import CheckInTable from "../Tables/CheckInTable";
import CheckOutTable from "../Tables/CheckOutTable";
import AttendanceGraphs from "@/app/utils/basecomponents/AttendanceGraphs";


const Listattendance = ({ attendance }) => {
  const [checkins, setCheckIns] = useState([]);
  const [checkouts, setCheckOuts] = useState([]);
  const [activeTab, setActiveTab] = useState("checkin");

  useEffect(() => {
    if (attendance && attendance.length > 0) {
      const checkins = attendance.map((item) => ({
        id: item.id,
        date:item.date,
        ...item.checkin,
      }));
      const checkouts = attendance.map((item) => ({
        id: item.id,
        date:item.date,
        ...item.checkout,
      }));


      setCheckIns(checkins);
      setCheckOuts(checkouts);
    }
  }, [attendance]);

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setActiveTab("checkin")}
          className={`px-6 py-2 font-semibold rounded-l-2xl transition-all duration-300 ${
            activeTab === "checkin"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          }`}
        >
          Check In
        </button>
        <button
          onClick={() => setActiveTab("checkout")}
          className={`px-6 py-2 font-semibold rounded-r-2xl transition-all duration-300 ${
            activeTab === "checkout"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          }`}
        >
          Check Out
        </button>
      </div>

      
      {activeTab === "checkin" ? (
        <CheckInTable data={checkins} />
      
      ) : (
        <CheckOutTable data={checkouts} />

      )}

      <AttendanceGraphs data={attendance} activeTab={activeTab} />
    </div>
  );
};

export default Listattendance;
