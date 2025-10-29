"use client";
import Employeelayout from "@/app/utils/employees/layout/Employeelayout";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const getCompany = async () => {
      try {
        const res = await axios.get(`/api/get-company/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setCompany(res.data.company);
      } catch (error) {
        console.error("Error fetching company:", error);
      }
    };

    getCompany();
  }, [id]);

  if (!company) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-medium">
        Loading company details...
      </div>
    );
  }

  return (
    <Employeelayout>
      <div className="max-w-5xl mx-auto p-8">
        <div className="flex items-center gap-6 bg-white shadow-lg rounded-2xl p-6 mb-8 border border-gray-100">
          <img
            src={company.companyLogo}
            alt="Company Logo"
            className="w-24 h-24 object-contain rounded-xl shadow-md border"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{company.name}</h1>
            <span
              className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-semibold ${
                company.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {company.status
                ? company.status.charAt(0).toUpperCase() +
                  company.status.slice(1)
                : ""}
            </span>
          </div>

        
        </div>

   

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <VIPCard title="Company Slug" value={company.companyslug} />
          <VIPCard title="ID" value={company.companyId} />
          <VIPCard title="Website" value={company.companyWebsite} isLink />
          <VIPCard title="Phone Number" value={company.companyPhoneNumber} />
          <VIPCard title="Address" value={company.companyAddress} />
          <VIPCard title="Email Address" value={company.companyemail} />
          <VIPCard title="Timezone" value={company.timezone} />
          <VIPCard
            title="Created At"
            value={new Date(company.createdAt).toLocaleString()}
          />
          
        </div>

          <div className=" shadow-lg rounded-xl p-5 mt-4 border border-gray-100">
            <Label className={"text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider"}>Social Links</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          <VIPCard
            title="Facebook Account"
            value={company.companyFacebook}
            isLink
          />
          <VIPCard
            title="Instagram Account"
            value={company.companyInstagram}
            isLink
          />

          <VIPCard
            title="Linkedin Account"
            value={company.companyLinkedin}
            isLink
          />
        </div>
          </div>

        <div className="mt-10 space-y-6">
          <VIPArray title="Assigned Invoices" data={company.assignedInvoices} />
          <VIPArray title="Assign Employee" data={company.AssignEmployee} />
          <VIPArray title="Assign Templates" data={company.ContactTemplates} />
          <VIPArray title="Assign Clients" data={company.CreateClients} />
          <VIPArray title="Assign Contracts" data={company.Createcontracts} />
        </div>
      </div>
    </Employeelayout>
  );
};

export default Page;

const VIPCard = ({ title, value, isLink }) => (
  <div className="bg-white shadow-lg rounded-xl p-5 border border-gray-100">
    <h3 className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">
      {title}
    </h3>
    {isLink ? (
      <a
        href={value}
        target="_blank"
        className="text-blue-600 underline text-lg"
      >
        {value.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '')}
      </a>
    ) : (
      <p className="text-gray-800 text-lg font-medium break-words">
        {value || "N/A"}
      </p>
    )}
  </div>
);

const VIPArray = ({ title, data }) => (
  <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
    <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
    {data && data.length > 0 ? (
      <ul className="space-y-2 max-h-56 overflow-y-auto pr-2">
        {data.map((item, idx) => (
          <li
            key={idx}
            className="bg-gray-100 rounded-lg px-4 py-2 text-gray-700 text-sm"
          >
            {item}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 italic">No data available</p>
    )}
  </div>
);
