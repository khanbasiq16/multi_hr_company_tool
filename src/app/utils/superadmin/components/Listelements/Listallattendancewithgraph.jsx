"use client";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const Listallattendancewithgraph = ({ data, activeTab , selectedMonth}) => {
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

  // ===== Pie Chart Data (percentage + count) =====
  const statusCounts = data.reduce((acc, att) => {
    const status = activeTab === "checkin" ? att.checkin.status : att.checkout.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(statusCounts).map((status) => ({
    name: status,
    value: statusCounts[status],
    color: colorMap[status] || "#9ca3af",
  }));

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-1 gap-6">
      <div>
        <h3 className="text-md font-semibold mb-2 text-gray-700 dark:text-gray-300">
          Attendance Percentage {selectedMonth ? `for ${new Date(selectedMonth + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}` : '' }
        </h3>
       <div className="w-full h-72 focus:outline-none">
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={pieData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label={(entry) => {
          const percentage = ((entry.value / data.length) * 100).toFixed(1);
          return `${entry.name} – ${entry.value} day(s) (${percentage}%)`;
        }}
        
        tabIndex={-1}
      >
        {pieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip
        formatter={(value) => {
          const percentage = ((value / data.length) * 100).toFixed(2);
          return `${value} day(s) (${percentage}%)`;
        }}
      />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</div>

      </div>
    </div>
  );
};

export default Listallattendancewithgraph;
