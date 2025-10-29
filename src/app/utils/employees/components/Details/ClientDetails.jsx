"use client";
import React from "react";
import EditClient from "../dialog/EditClient";

const ClientDetails = ({ client , setClient}) => {
  if (!client) return null;

  return (
    <div className="mx-auto bg-white shadow-sm rounded-2xl p-8 border border-gray-200">
      <div className="space-y-6">

        
       <div className="flex items-center justify-between border-b pb-4">
      <div className="flex flex-col items-start">
        <h2 className="text-2xl font-semibold text-gray-800">
          {client.clientName}
        </h2>
        <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
          ID: {client.id}
        </span>
      </div>

      {/* Right Section — Edit Button */}
      <EditClient client={client} setClient={setClient} />
    </div>

       
        <div className="grid grid-cols-2 gap-6 text-gray-700">

         
          <div className="space-y-3">
            <Info label="Email" value={client.clientEmail} />
            <Info label="Phone" value={client.clientPhone} />
            <Info label="Address" value={client.clientAddress} />
            <Info label="Package" value={client.packageDetails} />
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            <Info label="Company Name" value={client.companyName} />
            <Info label="Company ID" value={client.companyId} />
            <Info label="Projects" value={client.projectsDetails} />
            <a
              href={client.clientWebsite}
              target="_blank"
              className="text-sm text-blue-600 underline"
            >
              {client.clientWebsite.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '')}
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="col-span-2 mt-4 border-t pt-4">
          <p className="text-sm text-gray-500">
            Created At:{" "}
            {new Date(client.createdAt).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

// Reusable Field Component
const Info = ({ label, value }) => (
  <p>
    <span className="font-medium text-gray-800">{label}:</span>{" "}
    <span className="text-gray-600">{value || "N/A"}</span>
  </p>
);

export default ClientDetails;
