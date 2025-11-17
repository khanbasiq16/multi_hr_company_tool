// "use client";
// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Cell,
// } from "recharts";

// const AttendanceGraphs = ({ data, activeTab = "checkin" }) => {
//   if (!data || data.length === 0) return null;

//   const colorMap = {
//     "On Time": "#22c55e", // green
//     Late: "#eab308", // yellow
//     "Half Day": "#3b82f6", // blue
//     "Short Day": "#a855f7", // purple
//     "Early Check Out": "#3b82f6", // blue
//     "Late Check Out": "#a855f7", // purple
//     "On Time Check Out": "#22c55e", // green
//     Absent: "#ef4444", // red
//   };


//   const filteredData = data
//     .map((att) => {
//       const status =
//         activeTab === "checkin" ? att.checkin?.status : att.checkout?.status;
//       if (!status) return null; // skip if no checkin/checkout data
//       return {
//         date: att.date,
//         status,
//         count: 1,
//         color: colorMap[status] || "#9ca3af",
//       };
//     })
//     .filter(Boolean); 

//   if (filteredData.length === 0)
//     return <p>No data available for {activeTab}</p>;

//   const statusCounts = filteredData.reduce((acc, item) => {
//     acc[item.status] = (acc[item.status] || 0) + 1;
//     return acc;
//   }, {});

//   // ===== Unique statuses for badge list =====
//   const uniqueStatuses = [...new Set(filteredData.map((item) => item.status))];

//   return (
//     <div className="space-y-4">
//       {/* Status Badge List */}
//       <div className="flex flex-wrap gap-2"></div>

//       {/* Bar Chart */}
//       <div>
//         <h3 className="text-md font-semibold flex gap-2 mb-2">
//           Daily Attendance ({activeTab === "checkin" ? "Check-In" : "Check-Out"}
//           ){" "}
//           {uniqueStatuses.map((status) => (
//             <span
//               key={status}
//               className="px-3 py-1 rounded-full text-white text-sm"
//               style={{ backgroundColor: colorMap[status] }}
//             >
//               {status}
//             </span>
//           ))}
//         </h3>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={filteredData}>
//             <XAxis dataKey="date" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="count">
//               {filteredData.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={entry.color} />
//               ))}
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default AttendanceGraphs;
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
    "On Time": "#22c55e", // green
    Late: "#eab308", // yellow
    "Half Day": "#3b82f6", // blue
    "Short Day": "#a855f7", // purple
    "Early Check Out": "#3b82f6", // blue
    "Late Check Out": "#a855f7", // purple
    "On Time Check Out": "#22c55e", // green
    Absent: "#ef4444", // red
  };

  const today = new Date();
  const currentMonth = today.getMonth(); // 0-11
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
      color: status ? colorMap[status] : "#e5e7eb", // gray for empty days
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

      {/* Bar Chart */}
      <div>
        <h3 className="text-md font-semibold mb-2">
          Daily Attendance ({activeTab === "checkin" ? "Check-In" : "Check-Out"})
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value, name, props) => {
                return props.payload.status
                  ? [props.payload.status, "Status"]
                  : ["No Data", "Status"];
              }}
            />
            <Bar dataKey="count">
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
