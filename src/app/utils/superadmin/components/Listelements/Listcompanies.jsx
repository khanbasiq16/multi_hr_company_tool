
"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Building2, MapPin, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { createcompany } from "@/features/Slice/CompanySlice";
import Companydailog from "../dialog/Companydailog";
import { useDispatch, useSelector } from "react-redux";


const Listcompanies = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  const dispatch = useDispatch();
  const { companies } = useSelector((state) => state.Company);


  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("/api/get-all-companies");

        
        
        dispatch(createcompany(res.data?.companies || []));
      } catch (error) {
        console.error("Error fetching companies:", error);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col h-[64vh] overflow-auto">

      {/* Loading State */}
      {loading ? (
        <p className="text-center text-gray-500">Loading companies...</p>
      ) : companies.length === 0 ? (
        <div className="flex h-full justify-center items-center">
          <Companydailog />
        </div>
      ) : (
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {companies.map((company, index) => (
    <Card
      key={index}
      className="rounded-xl shadow-md hover:shadow-lg transition border border-gray-200"
    >
      {/* Header with Icon + Name */}
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="bg-blue-100 p-3 rounded-full flex items-center justify-center">
          <Building2 className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="font-semibold text-lg truncate">{company.name}</h2>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-2">
        {/* Address */}
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

        {/* Phone */}
        <div className="flex items-center text-gray-600 text-sm">
          <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate block max-w-[200px]">
            {company.companyPhoneNumber || "No phone available"}
          </span>
        </div>
      </CardContent>

      {/* Footer Button */}
      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => router.push(`/admin/company/${company.companyslug}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  ))}
</div>
      )}
    </div>
  )
}

export default Listcompanies