// "use client";
// import React, { useState, useEffect, useMemo } from "react";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Input
// } from "@/components/ui/input";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import axios from "axios";
// import { Building2, MapPin, Phone } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { createcompany } from "@/features/Slice/CompanySlice";
// import Companydailog from "../dialog/Companydailog";
// import { useDispatch, useSelector } from "react-redux";
// import { Badge } from "@/components/ui/badge";

// const Listcompanies = () => {
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");

//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { companies } = useSelector((state) => state.Company);

//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         const res = await axios.get("/api/get-all-companies");
//         dispatch(createcompany(res.data?.companies || []));
//       } catch (error) {
//         console.error("Error fetching companies:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCompanies();
//   }, [dispatch]);

//   // 🔍 Filtered list (search + status)
//   const filteredCompanies = useMemo(() => {
//     return companies.filter((company) => {
//       const matchesSearch = company.name
//         ?.toLowerCase()
//         .includes(search.toLowerCase());

//       const matchesStatus =
//         filterStatus === "all"
//           ? true
//           : company.status?.toLowerCase() === filterStatus.toLowerCase();

//       return matchesSearch && matchesStatus;
//     });
//   }, [companies, search, filterStatus]);

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md flex flex-col h-[64vh] overflow-auto">
//       {/* Header Controls */}
//       <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
//         {/* Search Bar */}
//         <Input
//           placeholder="Search by company name..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full sm:w-56"
//         />

//         {/* Filter Dropdown */}
//         <Select
//           value={filterStatus}
//           onValueChange={(value) => setFilterStatus(value)}
//         >
//           <SelectTrigger className="w-full sm:w-48">
//             <SelectValue placeholder="Filter by status" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All</SelectItem>
//             <SelectItem value="active">Active</SelectItem>
//             <SelectItem value="deactive">Deactive</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Content */}
//       {loading ? (
//         <p className="text-center text-gray-500">Loading companies...</p>
//       ) : filteredCompanies.length === 0 ? (
//         <div className="flex h-full justify-center items-center">
//           <Companydailog />
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {filteredCompanies.map((company, index) => (
//             <Card
//               key={index}
//               className="relative rounded-xl shadow-md hover:shadow-lg transition border border-gray-200"
//             >
//               {/* 🔹 Status Badge */}
//               <Badge
//                 className={`absolute top-3 right-3 capitalize ${
//                   company.status?.toLowerCase() === "active"
//                     ? "bg-green-100 text-green-700"
//                     : "bg-red-100 text-red-700"
//                 }`}
//               >
//                 {company.status || "unknown"}
//               </Badge>

//               {/* Header */}
//               <CardHeader className="flex flex-row items-center gap-3">
//                 <div className="bg-blue-100 p-3 rounded-full flex items-center justify-center">
//                   <Building2 className="w-6 h-6 text-blue-600" />
//                 </div>
//                 <CardTitle className="truncate text-lg">
//                   {company.name}
//                 </CardTitle>
//               </CardHeader>

//               {/* Content */}
//               <CardContent className="space-y-2">
//                 <div className="flex items-center text-gray-600 text-sm">
//                   <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
//                   <span
//                     className="truncate block max-w-[200px]"
//                     title={company.companyAddress}
//                   >
//                     {company.companyAddress?.replace(/\n/g, ", ") ||
//                       "Location not specified"}
//                   </span>
//                 </div>

//                 <div className="flex items-center text-gray-600 text-sm">
//                   <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
//                   <span className="truncate block max-w-[200px]">
//                     {company.companyPhoneNumber || "No phone available"}
//                   </span>
//                 </div>
//               </CardContent>

//               {/* Footer */}
//               <CardFooter>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="w-full"
//                   onClick={() =>
//                     router.push(`/admin/company/${company.companyslug}`)
//                   }
//                 >
//                   View Details
//                 </Button>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Listcompanies;

"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import axios from "axios";
import { Building2, Eye, Loader2, MapPin, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { createcompany } from "@/features/Slice/CompanySlice";
import Companydailog from "../dialog/Companydailog";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

const Listcompanies = () => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [statusLoading, setStatusLoading] = useState({});

  const router = useRouter();
  const dispatch = useDispatch();
  const { companies } = useSelector((state) => state.Company);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("/api/get-all-companies");
        dispatch(createcompany(res.data?.companies || []));
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, [dispatch]);

  const handleToggleStatus = async (companyId, currentStatus) => {
    setStatusLoading((prev) => ({ ...prev, [companyId]: true }));

    try {
      const newStatus =
        currentStatus?.toLowerCase() === "active" ? "deactive" : "active";

      const res = await axios.put(`/api/update-company-status/${companyId}`, {
        status: newStatus,
      });

      toast.success(
        `Company ${
          newStatus === "active" ? "Activated" : "Deactivated"
        } successfully!`
      );

      dispatch(createcompany(res.data?.companies || []));
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update company status");
    } finally {
      // Stop loader for this company
      setStatusLoading((prev) => ({ ...prev, [companyId]: false }));
    }
  };

  // 🔍 Filtered list (search + status)
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch = company.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        filterStatus === "all"
          ? true
          : company.status?.toLowerCase() === filterStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [companies, search, filterStatus]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col  overflow-auto">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <Input
          placeholder="Search by company name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-56"
        />

        <Select
          value={filterStatus}
          onValueChange={(value) => setFilterStatus(value)}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="deactive">Deactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-center text-gray-500">Loading companies...</p>
      ) : filteredCompanies.length === 0 ? (
        <div className="flex h-full justify-center items-center">
          <Companydailog />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-y-auto gap-4">
          {filteredCompanies.map((company, index) => (
            <Card
              key={index}
              className="relative rounded-xl shadow-md hover:shadow-lg transition border border-gray-200"
            >
              {/* 🔹 Status Badge */}
              <Badge
                className={`absolute top-3 right-3 capitalize ${
                  company.status?.toLowerCase() === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {company.status || "unknown"}
              </Badge>

              <CardHeader className="flex flex-row items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="truncate text-lg">
                  {company.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span
                    className="truncate block max-w-[200px]"
                    title={company.companyAddress}
                  >
                    {company.companyAddress?.replace(/\n/g, ", ") ||
                      "Location not specified"}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 text-sm">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate block max-w-[200px]">
                    {company.companyPhoneNumber || "No phone available"}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-2">
                {/* View Details */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center gap-2"
                  onClick={() =>
                    router.push(`/admin/company/${company.companyslug}`)
                  }
                  disabled={company.status?.toLowerCase() === "deactive"}
                  title={
                    company.status?.toLowerCase() === "deactive"
                      ? "Company is deactivated"
                      : "View company details"
                  }
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Button>

                <Button
                  size="sm"
                  className={`w-full flex items-center justify-center gap-2 ${
                    company.status?.toLowerCase() === "active"
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white`}
                  onClick={() => handleToggleStatus(company.id, company.status)}
                  disabled={statusLoading[company.id]} // disable button while updating
                >
                  {statusLoading[company.id] ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : company.status?.toLowerCase() === "active" ? (
                    "Deactivate"
                  ) : (
                    "Activate"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Listcompanies;
