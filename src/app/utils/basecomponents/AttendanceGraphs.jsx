"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const AttendanceGraphs = ({ data, activeTab = "checkin" }) => {
  if (!data || data.length === 0) return null;

  const colorMap = {
    "On Time": "#22c55e",
    Late: "#eab308",
    "Half Day": "#3b82f6",
    "Short Day": "#a855f7",
    "Early Check Out": "#3b82f6",
    "Late Check Out": "#a855f7",
    "On Time Check Out": "#22c55e",
    Absent: "#ef4444",
  };

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Prepare chart data
  const chartData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;

    const dayData = data.find((att) => {
      const [d, m, y] = att.date.split("/").map(Number);
      return d === day && m === currentMonth + 1 && y === currentYear;
    });

    const status =
      dayData && activeTab === "checkin"
        ? dayData.checkin?.status
        : dayData
          ? dayData.checkout?.status
          : null;

    return {
      date: day,
      status,
      count: status ? 1 : 0,
      color: status ? colorMap[status] : "#e5e7eb",
    };
  });

  const uniqueStatuses = [
    ...new Set(
      data
        .map((att) =>
          activeTab === "checkin" ? att.checkin?.status : att.checkout?.status
        )
        .filter(Boolean)
    ),
  ];


  return (
    <div className="space-y-4">


      {/* Status Badges */}
      <div className="flex flex-wrap gap-2">
        {uniqueStatuses.map((status) => (
          <span
            key={status}
            className="px-3 py-1 rounded-full text-white text-sm"
            style={{ backgroundColor: colorMap[status] }}
          >
            {status}
          </span>
        ))}
      </div>

      <div>
        <h3 className="text-md font-semibold mb-2">
          Daily Attendance ({activeTab === "checkin" ? "Check-In" : "Check-Out"}
          )
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} maxBarSize={30}>
            <XAxis dataKey="date" />
            <YAxis domain={[0, 1]} ticks={[0, 0.25, 0.5, 0.75, 1]} />
            <Tooltip
              formatter={(value, name, props) => {
                return props.payload.status
                  ? [props.payload.status, "Status"]
                  : ["No Data", "Status"];
              }}
              labelFormatter={(label, payload) => {
                const dataItem = payload?.[0]?.payload;
                if (dataItem && dataItem.status) {
                  return `Date: ${String(dataItem.date).padStart(
                    2,
                    "0"
                  )}/${String(new Date().getMonth() + 1).padStart(
                    2,
                    "0"
                  )}/${new Date().getFullYear()}`;
                }
                return `Date: ${String(label).padStart(2, "0")}/${String(
                  new Date().getMonth() + 1
                ).padStart(2, "0")}/${new Date().getFullYear()}`;
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendanceGraphs;
