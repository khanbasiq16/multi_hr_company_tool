"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("invoiceId");
  const amount = searchParams.get("amount");

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        if (!invoiceId) return;
        const res = await axios.get(`/api/get-invoice/${invoiceId}`);
        setInvoice(res.data?.invoice);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [invoiceId]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg">
        Loading invoice data...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500 text-lg">
        Failed to fetch invoice data.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          ✅ Payment Successful!
        </h1>

        <p className="text-gray-700 mb-6">
          Thank you! Your payment has been processed successfully.
        </p>

        <div className="bg-gray-50 p-4 rounded-md shadow-inner text-left space-y-2">
          <p>
            <span className="font-semibold">Invoice Number:</span>{" "}
            {invoice.invoiceNumber || "N/A"}
          </p>
      
          <p>
            <span className="font-semibold">Amount Paid:</span> ${amount}
          </p>
          <p>
            <span className="font-semibold">Status:</span> {invoice.status || "Paid"}
          </p>
          <p>
            <span className="font-semibold">Date\:</span>{" "}
            {invoice.invoiceDate || "N/A"}
          </p>
        </div>

       
      </div>
    </div>
  );
};

export default SuccessPage;
