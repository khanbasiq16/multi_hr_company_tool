"use client";
import React, { useState } from "react";
import axios from "axios";
import { Check, Copy } from "lucide-react";
import EmailDialog from "../dialog/EmailDailog";

const Invoicedetails = ({ invoice, client }) => {
  if (!invoice || !client) {
    return <p>Loading...</p>;
  }

  // ✅ Copy Invoice Link
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(invoice.invoiceLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ Send Email API
  const [openDialog, setOpenDialog] = useState(false);

  const handleSendEmail = async (data) => {
    console.log("Email Data:", data);

    try {
    const res = await axios.post("/api/send-invoice-email", {
      to: data.toEmail,
      subject: data.subject,
      message: data.message,
      invoiceLink: invoice.invoiceLink,
    }); 

    if(res.data?.success){  
        toast.success(res.data?.message || "Email sent successfully");
        setOpenDialog(false);
    }
    } 
        catch (error) {
        console.error("Error sending email:", error);``
        
    }

   
  };

  return (
    <div className="mx-auto bg-white shadow-lg rounded-xl p-8 border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Invoice #{invoice.invoiceNumber}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Date: {invoice.invoiceDate}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-700 mb-1">
            {invoice.companyName}
          </p>
          <span
            className={`text-sm font-medium px-4 mt-6 py-1 rounded-full ${
              invoice.status === "Paid"
                ? "bg-green-100 text-green-600"
                : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {invoice.status}
          </span>
        </div>
      </div>

      {/* Client + Company Info */}
      <div className="grid grid-cols-2 gap-6 mb-10">
        {/* Bill To */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Bill To</h3>
          <div className="text-gray-700 space-y-1">
            <p className="font-medium">{client.clientName}</p>
            <p>{client.clientEmail}</p>
            <p>{client.clientPhone}</p>
            <p>{client.clientAddress}</p>
            <a
              href={client.clientWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {client.clientWebsite}
            </a>
          </div>
        </div>

        {/* Invoice Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Invoice Details
          </h3>
          <div className="text-gray-700 space-y-1">
            <p>Description: {invoice.Description}</p>
            <p>Total Amount: ${invoice.totalAmount}</p>
            <p>Package: {client.packageDetails}</p>
            <p>Projects: {client.projectsDetails}</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 border-t pt-6">
        <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg overflow-hidden w-full max-w-md">
          <input
            type="text"
            value={invoice.invoiceLink}
            readOnly
            className="flex-1 px-3 py-2 text-sm bg-transparent text-gray-700 focus:outline-none"
          />
          <button
            onClick={handleCopyLink}
            className="px-3 py-2 hover:bg-gray-200 transition flex items-center justify-center"
          >
            {copied ? (
              <Check className="text-green-600" size={18} />
            ) : (
              <Copy size={18} />
            )}
          </button>
        </div>

        <button
          onClick={() => setOpenDialog(true)}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Send Invoice
        </button>

        <EmailDialog
          open={openDialog}
          setOpen={setOpenDialog}
          onSubmit={handleSendEmail}
          client={client}
        />
      </div>
    </div>
  );
};

export default Invoicedetails;
