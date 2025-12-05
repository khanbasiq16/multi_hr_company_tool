// "use client";
// import React, { useEffect, useEffectEvent, useState } from "react";
// import SuperAdminlayout from "../utils/superadmin/layout/SuperAdmin";
// import axios from "axios";
// import { Building2, Users, ClipboardList, Layers, UserCog, FileText } from "lucide-react";
// import { useDispatch } from "react-redux";
// import { getallzones } from "@/features/Slice/TimeZoneSlice";

// const Page = () => {
//   const [counts, setCounts] = useState({
//     companies: 0,
//     employees: 0,
//     departments: 0,
//     clients: 0,
//     invoices: 0,
//     expenses: 0,
//   });


//   const [recentEmployee, setrecentEmployee] = useState([])
//   const [loadingzone, setLoadingZones] = useState(false)
//   const dispatch = useDispatch()


//     useEffect(() => {
//     const fetchTimeZones = async () => {
//       try {
//         setLoadingZones(true);
//         const res = await fetch("https://timeapi.io/api/TimeZone/AvailableTimeZones");
//         if (!res.ok) throw new Error("Failed to fetch timezones");
//         const data = await res.json();

//         dispatch(getallzones(data))
//       } catch (error) {
//         getallzones([
//           "Asia/Karachi",
//           "Asia/Dubai",
//           "Asia/Kolkata",
//           "Europe/London",
//           "America/New_York",
//           "America/Los_Angeles",
//           "Australia/Sydney",
//         ]);
//       } finally {
//         setLoadingZones(false);
//       }
//     };
//     fetchTimeZones();
//   }, []);



//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [
//           companiesRes,
//           departmentsRes,
//           clientsRes,
//           invoicesRes,
//           expensesRes,
//           employeesRes,
//         ] = await Promise.all([
//           axios.get("/api/get-all-companies"),
//           axios.get("/api/get-all-department"),
//           axios.get("/api/all-clients"),
//           axios.get("/api/all-invoices"),
//           axios.get("/api/get-all-expense"),
//           axios.get("/api/get-all-employees"),
//         ]);


//         setCounts({
//           companies: companiesRes.data?.companies.length || 0,
//           employees: employeesRes.data?.employees.length || 0,
//           departments: departmentsRes.data?.departments.length || 0,
//           clients: clientsRes.data?.clients.length || 0,
//           invoices: invoicesRes.data?.invoices.length || 0,
//           expenses: expensesRes.data?.expenses.length || 0,
//         });

//         setrecentEmployee(employeesRes?.data?.employees)





//       } catch (error) {
//         console.error("API Fetch Error:", error);
//       }
//     };

//     fetchData();
//   }, []);





//   const stats = [
//     { title: "Companies", count: counts.companies, icon: <Building2 size={34} /> },
//     { title: "Employees", count: counts.employees, icon: <Users size={34} /> },
//     { title: "Departments", count: counts.departments, icon: <Layers size={34} /> },
//     { title: "Clients", count: counts.clients, icon: <UserCog size={34} /> },
//     { title: "Invoices", count: counts.invoices, icon: <ClipboardList size={34} /> },
//     { title: "Expenses", count: counts.expenses, icon: <FileText size={34} /> },
//   ];

//   return (
//     <SuperAdminlayout>
//       <section className="w-full p-6">

//         {/* Top Grid Section with Dynamic Counts */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
//           {stats.map((item, index) => (
//             <div
//               key={index}
//               className="rounded-2xl p-6 bg-white border shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-between"
//             >
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-700">{item.title}</h2>
//                 <p className="text-3xl font-bold text-gray-900 mt-2">{item.count}</p>
//               </div>
//               <div className="text-gray-500">{item.icon}</div>
//             </div>
//           ))}
//         </div>

//         {/* Recent Employees Table */}
//         <div className="bg-white shadow-xl rounded-2xl p-6 border">
//           <h2 className="text-2xl font-bold text-gray-800 mb-5">
//             Recent Employees
//           </h2>
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-gray-100 text-left">
//                 <th className="p-3 border-b text-sm font-semibold">Name</th>
//                 <th className="p-3 border-b text-sm font-semibold">Status</th>
//                 <th className="p-3 border-b text-sm font-semibold">Joining Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {recentEmployee.map((emp, index) => (
//                 <tr key={index} className="hover:bg-gray-50">
//                   <td className="p-3 border-b">{emp.employeeName}</td>
//                   <td className="p-3 border-b">{emp.status}</td>
//                   <td className="p-3 border-b">{emp.dateOfJoining}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </section>
//     </SuperAdminlayout>
//   );
// };

// export default Page;


// "use client";
// import React, { useEffect, useState } from "react";
// import SuperAdminlayout from "../utils/superadmin/layout/SuperAdmin";
// import axios from "axios";
// import { Building2, Users, ClipboardList, Layers, UserCog, FileText } from "lucide-react";
// import { useDispatch } from "react-redux";
// import { getallzones } from "@/features/Slice/TimeZoneSlice";

// const Page = () => {
//   const [counts, setCounts] = useState({
//     companies: 0,
//     employees: 0,
//     departments: 0,
//     clients: 0,
//     invoices: 0,
//     expenses: 0,
//   });

//   const [recentEmployee, setrecentEmployee] = useState([]);
//   const [loadingzone, setLoadingZones] = useState(false);
//   const dispatch = useDispatch();

//   // Fetch Time Zones
//   useEffect(() => {
//     const fetchTimeZones = async () => {
//       try {
//         setLoadingZones(true);
//         const res = await fetch("https://timeapi.io/api/TimeZone/AvailableTimeZones");
//         if (!res.ok) throw new Error("Failed to fetch timezones");
//         const data = await res.json();
//         dispatch(getallzones(data));
//       } catch (error) {
//         dispatch(
//           getallzones([
//             "Asia/Karachi",
//             "Asia/Dubai",
//             "Asia/Kolkata",
//             "Europe/London",
//             "America/New_York",
//             "America/Los_Angeles",
//             "Australia/Sydney",
//           ])
//         );
//       } finally {
//         setLoadingZones(false);
//       }
//     };
//     fetchTimeZones();
//   }, []);

//   // Fetch Dashboard Counts
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [
//           companiesRes,
//           departmentsRes,
//           clientsRes,
//           invoicesRes,
//           expensesRes,
//           employeesRes,
//         ] = await Promise.all([
//           axios.get("/api/get-all-companies"),
//           axios.get("/api/get-all-department"),
//           axios.get("/api/all-clients"),
//           axios.get("/api/all-invoices"),
//           axios.get("/api/get-all-expense"),
//           axios.get("/api/get-all-employees"),
//         ]);

//         setCounts({
//           companies: companiesRes.data?.companies.length || 0,
//           employees: employeesRes.data?.employees.length || 0,
//           departments: departmentsRes.data?.departments.length || 0,
//           clients: clientsRes.data?.clients.length || 0,
//           invoices: invoicesRes.data?.invoices.length || 0,
//           expenses: expensesRes.data?.expenses.length || 0,
//         });

//         setrecentEmployee(employeesRes?.data?.employees);
//       } catch (error) {
//         console.error("API Fetch Error:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   // Dashboard Stat Cards Data
//   const stats = [
//     { title: "Companies", count: counts.companies, icon: <Building2 size={34} /> },
//     { title: "Employees", count: counts.employees, icon: <Users size={34} /> },
//     { title: "Departments", count: counts.departments, icon: <Layers size={34} /> },
//     { title: "Clients", count: counts.clients, icon: <UserCog size={34} /> },
//     { title: "Invoices", count: counts.invoices, icon: <ClipboardList size={34} /> },
//     { title: "Expenses", count: counts.expenses, icon: <FileText size={34} /> },
//   ];

//   return (
//     <SuperAdminlayout>
//       <section className="w-full p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">

//         {/* 🔹 Top Heading */}
//         <div className="flex items-center justify-between mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Super Admin Dashboard</h1>
//         </div>

//         {/* 🔥 Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
//           {stats.map((item, index) => (
//             <div
//               key={index}
//               className="rounded-2xl p-6 bg-white dark:bg-gray-800 shadow-sm 
//               border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-[1.02] 
//               transition-all cursor-pointer flex items-center justify-between"
//             >
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300">{item.title}</h2>
//                 <p className="text-4xl font-bold text-gray-800 dark:text-white mt-2">{item.count}</p>
//               </div>
//               <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-700 dark:text-white">
//                 {item.icon}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* 🔻 Recent Employees Section */}
//         <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-7 border border-gray-200 dark:border-gray-700">

//           <div className="flex items-center justify-between mb-5">
//             <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Recent Employees</h2>
//           </div>

//           {/* Modern Table */}
//           <div className="overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
//             <table className="w-full">
//               <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm uppercase">
//                 <tr>
//                   <th className="px-5 py-3 text-left">Name</th>
//                   <th className="px-5 py-3 text-left">Status</th>
//                   <th className="px-5 py-3 text-left">Joining Date</th>
//                 </tr>
//               </thead>

//               <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//                 {recentEmployee.map((emp, index) => (
//                   <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
//                     <td className="px-5 py-3 text-gray-800 dark:text-gray-200 font-medium">{emp.employeeName}</td>
//                     <td className="px-5 py-3">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-semibold ${emp.status === "Active" ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
//                           }`}
//                       >
//                         {emp.status}
//                       </span>
//                     </td>
//                     <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{emp.dateOfJoining}</td>
//                   </tr>
//                 ))}
//               </tbody>

//             </table>
//           </div>
//         </div>
//       </section>
//     </SuperAdminlayout>
//   );
// };

// export default Page;


"use client";
import React, { useEffect, useState } from "react";
import SuperAdminlayout from "../utils/superadmin/layout/SuperAdmin";
import axios from "axios";
import { Building2, Users, ClipboardList, Layers, UserCog, FileText, ArrowUpRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { getallzones } from "@/features/Slice/TimeZoneSlice";

// 📊 Charts
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Page = () => {
  const [counts, setCounts] = useState({
    companies: 0,
    employees: 0,
    departments: 0,
    clients: 0,
    invoices: 0,
    expenses: 0,
  });

  const [recentEmployee, setrecentEmployee] = useState([]);

  const dispatch = useDispatch();
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFE", "#FF6384"];
  useEffect(() => {
    (async () => {
      try {
        const t = await fetch("https://timeapi.io/api/TimeZone/AvailableTimeZones");
        dispatch(getallzones(await t.json()));
      } catch {
        dispatch(getallzones(["Asia/Karachi", "Europe/London", "America/New_York"]));
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [a, b, c, d, e, f] = await Promise.all([
          axios.get("/api/get-all-companies"),
          axios.get("/api/get-all-department"),
          axios.get("/api/all-clients"),
          axios.get("/api/all-invoices"),
          axios.get("/api/get-all-expense"),
          axios.get("/api/get-all-employees"),
        ]);

        setCounts({
          companies: a.data.companies.length,
          employees: f.data.employees.length,
          departments: b.data.departments.length,
          clients: c.data.clients.length,
          invoices: d.data.invoices.length,
          expenses: e.data.expenses.length,
        });

        setrecentEmployee(f.data.employees);
      } catch (e) { console.log(e) }
    })();
  }, []);

  const stats = [
    { title: "Companies", count: counts.companies, growth: Math.floor(Math.random() * 41) - 20, icon: <Building2 size={34} /> },
    { title: "Employees", count: counts.employees, growth: Math.floor(Math.random() * 41) - 20, icon: <Users size={34} /> },
    { title: "Departments", count: counts.departments, growth: Math.floor(Math.random() * 41) - 20, icon: <Layers size={34} /> },
    { title: "Clients", count: counts.clients, growth: Math.floor(Math.random() * 41) - 20, icon: <UserCog size={34} /> },
    { title: "Invoices", count: counts.invoices, growth: Math.floor(Math.random() * 41) - 20, icon: <ClipboardList size={34} /> },
    { title: "Expenses", count: counts.expenses, growth: Math.floor(Math.random() * 41) - 20, icon: <FileText size={34} /> },
  ];


  // 📊 Chart Data
  const chart = [
    { name: "Companies", value: counts.companies },
    { name: "Employees", value: counts.employees },
    { name: "Clients", value: counts.clients },
    { name: "Invoices", value: counts.invoices },
  ];

  return (
    <SuperAdminlayout>
      <section className=" w-full  p-6">

        {/* 🔥 Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Super Admin Control Panel</h1>

          <div className="flex items-center gap-2">
            {/* <Bell size={20} className="text-gray-600 dark:text-gray-300" /> */}
            <span className="text-gray-600 dark:text-gray-300 text-sm">Home {">"} Dashboard</span>
          </div>
        </div>

        {/* 🔹 Modern Stats Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 mb-10">
          {stats.map((s, i) => {
            const isNegative = s.growth < 0;   // 👈 yaha handle kar diya! minus number ayega to negative true

            return (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">{s.icon}</div>

                  <ArrowUpRight
                    size={20}
                    className={`text-green-500`}
                  />
                </div>

                <h3 className="text-gray-600 dark:text-gray-300 text-sm">{s.title}</h3>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{s.value}</h2>

                <p className={`text-sm font-medium mt-1 text-green-500 `}>


                  {s.count} ↑
                </p>
              </div>
            );
          })}
        </div>


        {/* 📊 Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

          {/* Line Chart */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-xl border border-gray-300 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Business Growth</h2>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chart}>
                <Line dataKey="value" strokeWidth={3} />
                <XAxis dataKey="name" /><YAxis /><Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-xl border border-gray-300 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Business Overview</h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart width={200} height={200}>
                <Pie
                  data={chart}
                  innerRadius={45}
                  outerRadius={90}
                  dataKey="value"
                >
                  {chart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* 🔻 Recent Employees */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 border border-gray-300 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-white">Recent Employees</h2>

          <table className="w-full text-sm">
            <thead className="text-left bg-gray-200 dark:bg-gray-800">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Joining</th>
              </tr>
            </thead>
            <tbody>
              {recentEmployee.map((e, i) => (
                <tr key={i} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-200">{e.employeeName}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${e.status === "active" ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
                      }`}>{e.status.toLowerCase()
                        .split(/[\s-_]+/)      // spaces, dash or underscore se split
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join('')}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{e.dateOfJoining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </section>
    </SuperAdminlayout>
  );
};

export default Page;
