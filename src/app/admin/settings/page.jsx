// "use client";
// import DepartmentDialog from "@/app/utils/superadmin/components/dialog/DepartmentDialog";
// import EditDepartment from "@/app/utils/superadmin/components/dialog/EditDepartment";
// import Ipwhitelistdialog from "@/app/utils/superadmin/components/dialog/Ipwhitelistdialog";
// import SuperAdminlayout from "@/app/utils/superadmin/layout/SuperAdmin";
// import { Button } from "@/components/ui/button";
// import { createcompany } from "@/features/Slice/CompanySlice";
// import { createdepartment } from "@/features/Slice/DepartmentSlice";
// import { createemployees } from "@/features/Slice/EmployeeSlice";
// import { getallipwhitelist } from "@/features/Slice/IpwhiteSlice";
// import axios from "axios";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// const page = () => {
//   const [departdialog, setDepartdialog] = useState(false);
//   const [ipdialog, setIpdialog] = useState(false);
//   const [opendepartdialog, setOpendepartdialog] = useState(false);
//   const [selectedDept, setSelectedDept] = useState(null);
//   const dispatch = useDispatch();
//   const { department } = useSelector((state) => state.Department);
//   const { ipwhitelist } = useSelector((state) => state.Ipwhitelist);
//   const { employees } = useSelector((state) => state.Employee);
//   const { companies } = useSelector((state) => state.Company);

//   useEffect(() => {
//     const getAllDepartment = async () => {
//       try {
//         const res = await axios.get("/api/get-all-department");
//         dispatch(createdepartment(res.data.departments));
//       } catch (error) {
//         console.error("API Error:", error);
//       }
//     };

//     getAllDepartment();
//   }, []);

//   useEffect(() => {
//     const getAllEmployement = async () => {
//       try {
//         const res = await axios.get("/api/get-all-employees");
//         dispatch(createemployees(res.data.employees));
//       } catch (error) {
//         console.error("API Error:", error);
//       }
//     };

//     getAllEmployement();
//   }, []);


//   useEffect(() => {
//     const getAllEmployement = async () => {
//       try {
//         const res = await axios.get("/api/get-all-companies");
//         dispatch(createcompany(res.data.companies));
//       } catch (error) {
//         console.error("API Error:", error);
//       }
//     };

//     getAllEmployement();
//   }, []);



//   useEffect(() => {
//     const getAllnetworks = async () => {
//       try {
//         const res = await axios.get("/api/get-ipwhitelist");
//         dispatch(getallipwhitelist(res.data.whitelist));
//       } catch (error) {
//         console.error("API Error:", error);
//       }
//     };

//     getAllnetworks();
//   }, []);

//   const handleDeptClick = (dept) => {
//     setSelectedDept(dept);
//     setOpendepartdialog(true);
//   };

//   return (
//     <SuperAdminlayout>
//       <div className="p-6 space-y-6">
//         {/* ✅ Top Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           <div className="bg-white shadow rounded-lg p-5">
//             <h3 className="text-gray-600 text-sm">Total Employees</h3>
//             <p className="text-2xl font-bold mt-2">{employees?.length}</p>
//           </div>

//           <div className="bg-white shadow rounded-lg p-5">
//             <h3 className="text-gray-600 text-sm">Departments</h3>
//             <p className="text-2xl font-bold mt-2">{department?.length}</p>
//           </div>

//           <div className="bg-white shadow rounded-lg p-5">
//             <h3 className="text-gray-600 text-sm">Companies</h3>
//             <p className="text-2xl font-bold mt-2">{companies?.length}</p>
//           </div>

//           <div className="bg-white shadow rounded-lg p-5">
//             <h3 className="text-gray-600 text-sm">Networks</h3>
//             <p className="text-2xl font-bold mt-2">{ipwhitelist?.length}</p>
//           </div>
//         </div>

//         {/* ✅ Recent Notifications & Departments */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div className="bg-white shadow rounded-lg p-6">
//             <div className="w-full flex  justify-between">
//               <h2 className="text-lg font-semibold mb-4">Ip White List</h2>

//               <Ipwhitelistdialog open={ipdialog} setOpen={setIpdialog} />
//             </div>
//             <ul className="space-y-3 h-52 overflow-y-auto">
//               {ipwhitelist && ipwhitelist.length > 0 ? (
//                 ipwhitelist.map((item, index) => (
//                   <li
//                     key={index}
//                     className="p-3 bg-gray-50 rounded border flex justify-between items-center"
//                   >
//                     <div>
//                       <strong>{item.networkName}</strong>
//                       <p className="text-sm text-gray-600">{item.ip}</p>
//                     </div>
//                   </li>
//                 ))
//               ) : (
//                 <p className="text-gray-500">No IPs found</p>
//               )}
//             </ul>
//           </div>

//           <div className="bg-white shadow rounded-lg p-6">
//             <div className="w-full flex  justify-between">
//               <h2 className="text-lg font-semibold mb-4">Departments</h2>

//               <DepartmentDialog open={departdialog} setOpen={setDepartdialog} />
//             </div>
//             <ul className="space-y-3 ">
//               {department?.map((dept) => (
//                 <li key={dept.departmentId}>
//                   <div
//                     onClick={() => handleDeptClick(dept)}
//                     className="block p-3 bg-gray-50 rounded border hover:bg-gray-100"
//                   >
//                     {dept.departmentName}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         <EditDepartment
//         open={opendepartdialog}
//         setOpen={setOpendepartdialog}
//         department={selectedDept}
//         />

//         {/* ✅ Table Section */}
//         <div className="bg-white shadow rounded-lg p-6">
//           <h2 className="text-lg font-semibold mb-4">Recent Employees</h2>
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="border-b">
//                 <th className="p-3">Name</th>
//                 <th className="p-3">Department</th>
//                 <th className="p-3">Company</th>
//                 <th className="p-3">Status</th>
//               </tr>
//             </thead>
//             <tbody>

//              {employees?.map((emp) => (
//     <tr key={emp.employeeId} className="border-b hover:bg-gray-50 transition">
//       <td className="p-3">{emp.employeeName}</td>
//       <td className="p-3">{emp.department}</td>
//       <td className="p-3">{emp.employeeAddress}</td>
//       <td className="p-3">
//         <span
//           className={`px-3 py-1 text-sm font-medium rounded-full ${
//             emp.status.toLowerCase() === "active"
//               ? "bg-green-100 text-green-700"
//               : "bg-red-100 text-red-700"
//           }`}
//         >
//           {emp.status}
//         </span>
//       </td>
//     </tr>
//   ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </SuperAdminlayout>
//   );
// };

// export default page;

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import SuperAdminlayout from "@/app/utils/superadmin/layout/SuperAdmin";
import DepartmentDialog from "@/app/utils/superadmin/components/dialog/DepartmentDialog";
import EditDepartment from "@/app/utils/superadmin/components/dialog/EditDepartment";
import Ipwhitelistdialog from "@/app/utils/superadmin/components/dialog/Ipwhitelistdialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { createcompany } from "@/features/Slice/CompanySlice";
import { createdepartment } from "@/features/Slice/DepartmentSlice";
import { createemployees } from "@/features/Slice/EmployeeSlice";
import { getallipwhitelist } from "@/features/Slice/IpwhiteSlice";

const Page = () => {
  const [departdialog, setDepartdialog] = useState(false);
  const [ipdialog, setIpdialog] = useState(false);
  const [opendepartdialog, setOpendepartdialog] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [signupAccess, setSignupAccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { department } = useSelector((state) => state.Department);
  const { ipwhitelist } = useSelector((state) => state.Ipwhitelist);
  const { employees } = useSelector((state) => state.Employee);
  const { companies } = useSelector((state) => state.Company);

  // ✅ Fetch departments
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

  // ✅ Fetch employees
  useEffect(() => {
    const getAllEmployees = async () => {
      try {
        const res = await axios.get("/api/get-all-employees");
        dispatch(createemployees(res.data.employees));
      } catch (error) {
        console.error("API Error:", error);
      }
    };
    getAllEmployees();
  }, []);

  // ✅ Fetch companies
  useEffect(() => {
    const getAllCompanies = async () => {
      try {
        const res = await axios.get("/api/get-all-companies");
        dispatch(createcompany(res.data.companies));
      } catch (error) {
        console.error("API Error:", error);
      }
    };
    getAllCompanies();
  }, []);

  // ✅ Fetch IP Whitelist
  useEffect(() => {
    const getAllNetworks = async () => {
      try {
        const res = await axios.get("/api/get-ipwhitelist");
        dispatch(getallipwhitelist(res.data.whitelist));
      } catch (error) {
        console.error("API Error:", error);
      }
    };
    getAllNetworks();
  }, []);

  // ✅ Fetch signup access state
  useEffect(() => {
    const fetchSignupAccess = async () => {
      try {
        const res = await axios.get("/api/get-signup-access");
        setSignupAccess(res.data.signupAccess);
      } catch (err) {
        console.error("Error fetching signup access:", err);
      }
    };
    fetchSignupAccess();
  }, []);

  // ✅ Toggle signup access
  const handleToggleSignup = async () => {
    setLoading(true);
    try {
      await axios.post("/api/update-signup-access", {
        signupAccess: !signupAccess,
      });
      setSignupAccess(!signupAccess);
      toast.success(
        `Signup Page ${!signupAccess ? "Enabled" : "Disabled"} Successfully!`
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update signup setting");
    } finally {
      setLoading(false);
    }
  };

  const handleDeptClick = (dept) => {
    setSelectedDept(dept);
    setOpendepartdialog(true);
  };

  return (
    <SuperAdminlayout>
      <div className="p-6 space-y-6">
        {/* 🔘 Toggle for Admin Signup Page */}
        <div className="flex items-center gap-3 bg-white shadow p-3 rounded-lg w-fit">
          <Label className="text-sm font-medium">Admin Signup Page</Label>
          <Switch
            checked={signupAccess}
            onCheckedChange={handleToggleSignup}
            disabled={loading}
          />
          {loading && <span className="text-xs text-gray-500">Updating...</span>}
        </div>

        {/* ✅ Top Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow rounded-lg p-5">
            <h3 className="text-gray-600 text-sm">Total Employees</h3>
            <p className="text-2xl font-bold mt-2">{employees?.length}</p>
          </div>

          <div className="bg-white shadow rounded-lg p-5">
            <h3 className="text-gray-600 text-sm">Departments</h3>
            <p className="text-2xl font-bold mt-2">{department?.length}</p>
          </div>

          <div className="bg-white shadow rounded-lg p-5">
            <h3 className="text-gray-600 text-sm">Companies</h3>
            <p className="text-2xl font-bold mt-2">{companies?.length}</p>
          </div>

          <div className="bg-white shadow rounded-lg p-5">
            <h3 className="text-gray-600 text-sm">Networks</h3>
            <p className="text-2xl font-bold mt-2">{ipwhitelist?.length}</p>
          </div>
        </div>

        {/* ✅ IP White List & Departments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="w-full flex justify-between">
              <h2 className="text-lg font-semibold mb-4">IP White List</h2>
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
            <div className="w-full flex justify-between">
              <h2 className="text-lg font-semibold mb-4">Departments</h2>
              <DepartmentDialog open={departdialog} setOpen={setDepartdialog} />
            </div>
            <ul className="space-y-3">
              {department?.map((dept) => (
                <li key={dept.departmentId}>
                  <div
                    onClick={() => handleDeptClick(dept)}
                    className="block p-3 bg-gray-50 rounded border hover:bg-gray-100 cursor-pointer"
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

        {/* ✅ Employees Table */}
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
              {employees?.map((emp) => (
                <tr
                  key={emp.employeeId}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">{emp.employeeName}</td>
                  <td className="p-3">{emp.department}</td>
                  <td className="p-3">{emp.employeeAddress}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        emp.status.toLowerCase() === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SuperAdminlayout>
  );
};

export default Page;
