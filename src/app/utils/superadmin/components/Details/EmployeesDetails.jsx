"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import AssignCompanydIalog from "../dialog/AssignCompanydIalog";
import Listattendance from "../Listelements/LIstattendance";

const EmployeesDetails = ({ employee, assigncompanies  , setemployee}) => {
  if (!employee) return null;

  const [open, setOpen] = useState(false);

  const assignedCompanies =
    assigncompanies?.filter((comp) => employee.companyIds?.includes(comp.id)) ||
    [];

  return (
    <>
    <div className="mx-auto bg-white shadow-sm rounded-2xl p-8 border border-gray-200">
      <div className=" space-y-6">
        {/* Header */}
        <div className="flex flex-col items-start justify-between border-b pb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            {employee.employeeName}
          </h2>
          <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
            ID: {employee.employeeId}
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-6 text-gray-700">
          {/* Column 1 */}
          <div className="space-y-3">
            <Info label="Email" value={employee.employeeemail} />
            <Info label="Phone" value={employee.employeePhone} />
            <Info label="CNIC" value={employee.employeeCNIC} />
            <Info label="Address" value={employee.employeeAddress} />
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            <Info label="Department" value={employee.department} />
            <Info label="Status" value={employee.status} />
            <Info label="Salary" value={employee.employeeSalary} />
            <Info label="Date of Joining" value={employee.dateOfJoining} />
            {employee.salesTarget && (
              <Info label="Sales Target" value={employee.salesTarget} />
            )}
            <Info
              label="Working Hours"
              value={`${employee.totalWorkingHours} hrs`}
            />
          </div>

          {/* Company Details */}
          <div className="col-span-2 border-t pt-4 mt-4">
            <p className="font-medium text-gray-800 mb-2">
              Assigned Companies:
            </p>

            {assignedCompanies.length > 0 ? (
              <div className="space-y-3">
                {assignedCompanies.map((comp, i) => (
                  <div
                    key={i}
                    className="p-3 bg-gray-50 rounded-lg border flex flex-col"
                  >
                    <span className="text-sm font-semibold">
                      {comp.companyName}
                    </span>
                    <span className="text-xs text-gray-500">
                      Name: {comp.name}
                    </span>
                    <a
                      href={comp.companyWebsite}
                      target="_blank"
                      className="text-xs text-blue-600 underline"
                    >
                      {comp.companyWebsite}
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No company assigned</p>
            )}
          </div>

        

          <div className="col-span-2 mt-2 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Joining Date:{" "}
              {new Date(employee.createdAt).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>

            <Button
              className="bg-[#5965AB] text-white  font-semibold px-6 py-2"
              onClick={() => setOpen(true)}
            >
              Assign Company
            </Button>
          </div>
        </div>

        <AssignCompanydIalog
          open={open}
          setOpen={setOpen}
          assigncompanies={assigncompanies}
          employeeId={employee.employeeId}
        />
      </div>


    </div>
        <div className="col-span-2 border-t p-4 mt-4 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <p className="font-medium text-gray-800 mb-2">Attendance:</p>
            
            
            <Listattendance attendance={employee.Attendance} setemployee={setemployee} />
          </div>


</>
  );
};

// Reusable field
const Info = ({ label, value }) => (
  <p>
    <span className="font-medium text-gray-800">{label}:</span>{" "}
    <span className="text-gray-600">{value || "N/A"}</span>
  </p>
);

export default EmployeesDetails;
