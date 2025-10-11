"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";


const Invoicedialog = () => {

      const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [currentDate, setCurrentDate] = useState("");
      const { user } = useSelector((state) => state.User);

  const { id } = useParams();
  const capitalizedCompanyName = id
    ? id.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "";

  useEffect(() => {
    if (open) {
      const randomNum = Math.floor(100 + Math.random() * 900); 
      setInvoiceNumber(`INV-${randomNum}`);
      setCurrentDate(new Date().toLocaleDateString("en-GB")); 
    }
  }, [open]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(`/api/get-all-clients/${id}`);
        setClients(res.data.clients || []);
      } catch (error) {
        toast.error("Failed to fetch clients");
      }
    };
    fetchClients();
  }, [id]);

  useEffect(() => {
    if (search.trim() === "") setFilteredClients([]);
    else {
      setFilteredClients(
        clients.filter((c) =>
          c.clientName.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, clients]);

  // 🔹 Handle submit
  const handleInvoiceSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClient) {
      toast.error("Please select a client first");
      return;
    }

    setLoading(true);
    try {
      const data = Object.fromEntries(new FormData(e.target));
      data.companyName = slug;
      data.clientId = selectedClient.id;
      data.invoiceNumber = invoiceNumber;
      data.invoiceDate = currentDate;
      data.totalAmount = Number(data.invoiceAmount);
      data.createdBy = user?.employeeName || "Unknown";
      data.status = "Draft";
      data.employee_id = user?.id || "Unknown";


      const res = await axios.post("/api/create-invoice", data, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.success) {
        toast.success("Invoice Created Successfully!");
        e.target.reset();
        setSelectedClient(null);
        setSearch("");
        setOpen(false);
      } else toast.error(res.data.error || "Failed to create invoice");
    } catch (error) {
      toast.error("Error creating invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
  
    <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button className="bg-[#5965AB] text-white px-5 py-2 rounded-lg font-medium shadow-sm hover:bg-[#4f58a0] transition">
      + Generate Invoice
    </Button>
  </DialogTrigger>

  <DialogContent className="sm:max-w-[850px] p-6 rounded-2xl shadow-2xl bg-gradient-to-b from-white to-gray-50 border border-gray-200">
   

    <form
      onSubmit={handleInvoiceSubmit}
      className="space-y-8 mt-6 max-h-[75vh] overflow-y-auto"
    >
      {/* 🔹 Invoice Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col">
          <Label className="text-sm font-semibold text-gray-600">
            Invoice Number
          </Label>
          <div className="text-2xl font-bold text-gray-800 tracking-wide mt-1">
            #{invoiceNumber}
          </div>
        </div>
        <div className="flex flex-col">
          <Label className="text-sm font-semibold text-gray-600">Date</Label>
          <span className="text-base text-gray-800 mt-1">{currentDate}</span>
        </div>
        {capitalizedCompanyName && (
          <div className="flex flex-col">
            <Label className="text-sm font-semibold text-gray-600">
              Company
            </Label>
            <span className="text-base text-gray-800 mt-1">
              {capitalizedCompanyName}
            </span>
          </div>
        )}
      </div>

      {/* 🔹 Client Search */}
      <div className="relative">
        <Label className="text-sm font-semibold text-gray-700">
          Select Client
        </Label>
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedClient(null);
          }}
          placeholder="Search client..."
          className="mt-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
        />
        {filteredClients.length > 0 && (
          <div className="absolute z-50 bg-white border w-full mt-1 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filteredClients.map((c) => (
              <div
                key={c._id}
                onClick={() => {
                  setSearch(c.clientName);
                  setSelectedClient(c);
                  setFilteredClients([]);
                }}
                className="px-3 py-2 hover:bg-indigo-50 cursor-pointer text-gray-700"
              >
                {c.clientName}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔹 Client Details */}
      {selectedClient && (
        <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm space-y-2">
          <p className="text-sm text-gray-600">
            <strong className="font-semibold text-gray-800">Name:</strong>{" "}
            {selectedClient.clientName}
          </p>
          <p className="text-sm text-gray-600">
            <strong className="font-semibold text-gray-800">Email:</strong>{" "}
            {selectedClient.clientEmail}
          </p>
          <p className="text-sm text-gray-600">
            <strong className="font-semibold text-gray-800">Phone:</strong>{" "}
            {selectedClient.clientPhone}
          </p>
          <p className="text-sm text-gray-600">
            <strong className="font-semibold text-gray-800">Address:</strong>{" "}
            {selectedClient.clientAddress}
          </p>
          {selectedClient.clientWebsite && (
            <p className="text-sm text-gray-600">
              <strong className="font-semibold text-gray-800">Website:</strong>{" "}
              <a
                href={selectedClient.clientWebsite}
                target="_blank"
                className="text-indigo-600 underline"
              >
                {selectedClient.clientWebsite}
              </a>
            </p>
          )}
        </div>
      )}

      {/* 🔹 Description */}
      <div>
        <Label className="text-sm font-semibold text-gray-700">
          Description
        </Label>
        <textarea
          name="invoiceDescription"
          rows={2}
          placeholder="Enter invoice description..."
          className="w-full border border-gray-300 outline-none rounded-lg px-3 py-2 mt-2 focus:outline-none"
        />
      </div>

      {/* 🔹 Amount Section */}
      <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl text-center">
        <Label className="text-lg font-semibold text-gray-700 block mb-2">
          Total Amount
        </Label>
        <Input
          name="invoiceAmount"
          type="number"
          placeholder="Enter total amount"
          required
          className="text-3xl font-bold text-gray-800 text-center border-none bg-transparent outline-none focus:outline-none"
        />
      </div>

      <DialogFooter>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2C3E50] hover:bg-[#1F2A38] text-white py-3 text-lg font-semibold rounded-lg shadow-md transition"
        >
          {loading ? "Generating..." : "Generate Invoice"}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
  </>
  )
}

export default Invoicedialog