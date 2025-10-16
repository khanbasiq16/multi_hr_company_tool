"use client";
import DepartmentDialog from "@/app/utils/superadmin/components/dialog/DepartmentDialog";
import SuperAdminlayout from "@/app/utils/superadmin/layout/SuperAdmin";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const page = () => {

    const [open, setOpen] = useState(false)


    const Adddepartment = () => { 
    setOpen(true); 
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
            <p className="text-2xl font-bold mt-2">8</p>
          </div>

          <div className="bg-white shadow rounded-lg p-5">
            <h3 className="text-gray-600 text-sm">Companies</h3>
            <p className="text-2xl font-bold mt-2">15</p>
          </div>

          <div className="bg-white shadow rounded-lg p-5">
            <h3 className="text-gray-600 text-sm">Notifications</h3>
            <p className="text-2xl font-bold mt-2">23</p>
          </div>
        </div>

        {/* ✅ Recent Notifications & Departments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Notifications</h2>
            <ul className="space-y-3">
              <li className="p-3 bg-gray-50 rounded border">New employee added</li>
              <li className="p-3 bg-gray-50 rounded border">Meeting scheduled</li>
              <li className="p-3 bg-gray-50 rounded border">System update</li>
            </ul>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="w-full flex  justify-between">
            <h2 className="text-lg font-semibold mb-4">Departments</h2>
            <Button
            onClick={Adddepartment}
            >Add Department</Button>
            </div>
            <ul className="space-y-3">
              <li className="p-3 bg-gray-50 rounded border">HR Department</li>
              <li className="p-3 bg-gray-50 rounded border">IT Department</li>
              <li className="p-3 bg-gray-50 rounded border">Finance Department</li>
            </ul>
          </div>
        </div>

        {open &&
        <DepartmentDialog/>
        }

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
