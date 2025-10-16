"use client";
import DepartmentDialog from "@/app/utils/superadmin/components/dialog/DepartmentDialog";
import EditDepartment from "@/app/utils/superadmin/components/dialog/EditDepartment";
import Ipwhitelistdialog from "@/app/utils/superadmin/components/dialog/Ipwhitelistdialog";
import SuperAdminlayout from "@/app/utils/superadmin/layout/SuperAdmin";
import { Button } from "@/components/ui/button";
import { createdepartment } from "@/features/Slice/DepartmentSlice";
import { getallipwhitelist } from "@/features/Slice/IpwhiteSlice";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const page = () => {
  const [departdialog, setDepartdialog] = useState(false);
  const [ipdialog, setIpdialog] = useState(false);
  const [opendepartdialog, setOpendepartdialog] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const dispatch = useDispatch();
  const { department } = useSelector((state) => state.Department);
  const { ipwhitelist } = useSelector((state) => state.Ipwhitelist);

  useEffect(() => {
    const getAllDepartment = async () => {
      try {
        const res = await axios.get("/api/get-all-department");
        dispatch(createdepartment(res.data.departments));
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    getAllDepartment();
  }, []);

  useEffect(() => {
    const getAllnetworks = async () => {
      try {
        const res = await axios.get("/api/get-ipwhitelist");
        dispatch(getallipwhitelist(res.data.whitelist));
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    getAllnetworks();
  }, []);

  const handleDeptClick = (dept) => {
    setSelectedDept(dept);
    setOpendepartdialog(true);
  };

  return (
    <SuperAdminlayout>
      <div className="p-6 space-y-6">
        {/* ✅ Top Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow rounded-lg p-5">
            <h3 className="text-gray-600 text-sm">Total Employees</h3>
            <p className="text-2xl font-bold mt-2">120</p>
          </div>

          <div className="bg-white shadow rounded-lg p-5">
            <h3 className="text-gray-600 text-sm">Departments</h3>
            <p className="text-2xl font-bold mt-2">{department?.length}</p>
          </div>

          <div className="bg-white shadow rounded-lg p-5">
            <h3 className="text-gray-600 text-sm">Companies</h3>
            <p className="text-2xl font-bold mt-2">15</p>
          </div>

          <div className="bg-white shadow rounded-lg p-5">
            <h3 className="text-gray-600 text-sm">Networks</h3>
            <p className="text-2xl font-bold mt-2">{ipwhitelist?.length}</p>
          </div>
        </div>

        {/* ✅ Recent Notifications & Departments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="w-full flex  justify-between">
              <h2 className="text-lg font-semibold mb-4">Ip White List</h2>

              <Ipwhitelistdialog open={ipdialog} setOpen={setIpdialog} />
            </div>
            <ul className="space-y-3 h-52 overflow-y-auto">
              {ipwhitelist && ipwhitelist.length > 0 ? (
                ipwhitelist.map((item, index) => (
                  <li
                    key={index}
                    className="p-3 bg-gray-50 rounded border flex justify-between items-center"
                  >
                    <div>
                      <strong>{item.networkName}</strong>
                      <p className="text-sm text-gray-600">{item.ip}</p>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No IPs found</p>
              )}
            </ul>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="w-full flex  justify-between">
              <h2 className="text-lg font-semibold mb-4">Departments</h2>

              <DepartmentDialog open={departdialog} setOpen={setDepartdialog} />
            </div>
            <ul className="space-y-3 ">
              {department?.map((dept) => (
                <li key={dept.departmentId}>
                  <div
                    onClick={() => handleDeptClick(dept)}
                    className="block p-3 bg-gray-50 rounded border hover:bg-gray-100"
                  >
                    {dept.departmentName}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <EditDepartment
        open={opendepartdialog}
        setOpen={setOpendepartdialog}
        department={selectedDept}
        />

        {/* ✅ Table Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Employees</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-3">Name</th>
                <th className="p-3">Department</th>
                <th className="p-3">Company</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3">John Doe</td>
                <td className="p-3">IT</td>
                <td className="p-3">TechCorp</td>
                <td className="p-3">Active</td>
              </tr>
              <tr className="border-b">
                <td className="p-3">Sarah Khan</td>
                <td className="p-3">HR</td>
                <td className="p-3">BizSoft</td>
                <td className="p-3">Active</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </SuperAdminlayout>
  );
};

export default page;
