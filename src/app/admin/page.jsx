"use client";
import React, { useEffect, useEffectEvent, useState } from "react";
import SuperAdminlayout from "../utils/superadmin/layout/SuperAdmin";
import axios from "axios";
import { Building2, Users, ClipboardList, Layers, UserCog, FileText } from "lucide-react";
import { useDispatch } from "react-redux";
import { getallzones } from "@/features/Slice/TimeZoneSlice";

const Page = () => {
  const [counts, setCounts] = useState({
    companies: 0,
    employees: 0,
    departments: 0,
    clients: 0,
    invoices: 0,
    expenses: 0,
  });


  const [recentEmployee, setrecentEmployee] = useState([])
  const [loadingzone, setLoadingZones] = useState(false)
  const dispatch = useDispatch()


    useEffect(() => {
    const fetchTimeZones = async () => {
      try {
        setLoadingZones(true);
        const res = await fetch("https://timeapi.io/api/TimeZone/AvailableTimeZones");
        if (!res.ok) throw new Error("Failed to fetch timezones");
        const data = await res.json();
       
        dispatch(getallzones(data))
      } catch (error) {
        getallzones([
          "Asia/Karachi",
          "Asia/Dubai",
          "Asia/Kolkata",
          "Europe/London",
          "America/New_York",
          "America/Los_Angeles",
          "Australia/Sydney",
        ]);
      } finally {
        setLoadingZones(false);
      }
    };
    fetchTimeZones();
  }, []);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          companiesRes,
          departmentsRes,
          clientsRes,
          invoicesRes,
          expensesRes,
          employeesRes,
        ] = await Promise.all([
          axios.get("/api/get-all-companies"),
          axios.get("/api/get-all-department"),
          axios.get("/api/all-clients"),
          axios.get("/api/all-invoices"),
          axios.get("/api/get-all-expense"),
          axios.get("/api/get-all-employees"),
        ]);


        setCounts({
          companies: companiesRes.data?.companies.length || 0,
          employees: employeesRes.data?.employees.length || 0,
          departments: departmentsRes.data?.departments.length || 0,
          clients: clientsRes.data?.clients.length || 0,
          invoices: invoicesRes.data?.invoices.length || 0,
          expenses: expensesRes.data?.expenses.length || 0,
        });

        setrecentEmployee(employeesRes?.data?.employees)



       

      } catch (error) {
        console.error("API Fetch Error:", error);
      }
    };

    fetchData();
  }, []);


 
  

  const stats = [
    { title: "Companies", count: counts.companies, icon: <Building2 size={34} /> },
    { title: "Employees", count: counts.employees, icon: <Users size={34} /> },
    { title: "Departments", count: counts.departments, icon: <Layers size={34} /> },
    { title: "Clients", count: counts.clients, icon: <UserCog size={34} /> },
    { title: "Invoices", count: counts.invoices, icon: <ClipboardList size={34} /> },
    { title: "Expenses", count: counts.expenses, icon: <FileText size={34} /> },
  ];

  return (
    <SuperAdminlayout>
      <section className="w-full p-6">
        
        {/* Top Grid Section with Dynamic Counts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {stats.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl p-6 bg-white border shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-700">{item.title}</h2>
                <p className="text-3xl font-bold text-gray-900 mt-2">{item.count}</p>
              </div>
              <div className="text-gray-500">{item.icon}</div>
            </div>
          ))}
        </div>

        {/* Recent Employees Table */}
        <div className="bg-white shadow-xl rounded-2xl p-6 border">
          <h2 className="text-2xl font-bold text-gray-800 mb-5">
            Recent Employees
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border-b text-sm font-semibold">Name</th>
                <th className="p-3 border-b text-sm font-semibold">Status</th>
                <th className="p-3 border-b text-sm font-semibold">Joining Date</th>
              </tr>
            </thead>
            <tbody>
              {recentEmployee.map((emp, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{emp.employeeName}</td>
                  <td className="p-3 border-b">{emp.status}</td>
                  <td className="p-3 border-b">{emp.dateOfJoining}</td>
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
