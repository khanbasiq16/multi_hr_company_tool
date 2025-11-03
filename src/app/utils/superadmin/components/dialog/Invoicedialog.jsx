// "use client";
// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useParams } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { getallinvoice } from "@/features/Slice/InvoiceSlice";

// const Invoicedialog = () => {
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [clients, setClients] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filteredClients, setFilteredClients] = useState([]);
//   const [selectedClient, setSelectedClient] = useState(null);
//   const [invoiceNumber, setInvoiceNumber] = useState("");
//   const [currentDate, setCurrentDate] = useState("");
//   const dispatch = useDispatch();

//     const {user} = useSelector((state)=>state.User)

//   // const { user } = useSelector((state) => state.User);
//   const { id } = useParams();

//   const companySlug = id;

//   const capitalizedCompanyName = id
//     ? id.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
//     : "";

//   useEffect(() => {
//     if (open) {
//       const randomNum = Math.floor(100 + Math.random() * 900);
//       setInvoiceNumber(`INV-${randomNum}`);
//       setCurrentDate(new Date().toLocaleDateString("en-GB"));
//     }
//   }, [open]);

//   useEffect(() => {
//     const fetchClients = async () => {
//       try {
//         const res = await axios.get(`/api/get-all-clients/${id}`);
//         setClients(res.data.clients || []);
//       } catch {
//         toast.error("Failed to fetch clients");
//       }
//     };
//     fetchClients();
//   }, [id]);

//   useEffect(() => {
//     if (search.trim() === "") setFilteredClients([]);
//     else {
//       setFilteredClients(
//         clients.filter((c) =>
//           c.clientName.toLowerCase().includes(search.toLowerCase())
//         )
//       );
//     }
//   }, [search, clients]);

//   const handleInvoiceSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedClient) {
//       toast.error("Please select a client first");
//       return;
//     }

//     setLoading(true);
//     try {
//       const data = Object.fromEntries(new FormData(e.target));
//       data.companySlug = companySlug;
//       data.clientId = selectedClient.id;
//       data.invoiceNumber = invoiceNumber;
//       data.invoiceDate = currentDate;
//       data.Description = data.invoiceDescription || "";
//       data.totalAmount = Number(data.invoiceAmount);
//       data.createdBy = user?.name;
//       data.status = "Draft";
//       data.user_id = user?.uid;
//       data.type = "admin";

//       const res = await axios.post("/api/create-invoice", data, {
//         headers: { "Content-Type": "application/json" },
//       });

//       if (res.data.success) {
//         toast.success("Invoice Created Successfully!");
//         e.target.reset();

//         setSelectedClient(null);
//         setSearch("");


//         dispatch(getallinvoice(res.data.assignedInvoices));
//       } else toast.error(res.data.error || "Failed to create invoice");
//     } catch (error) {
//       toast.error("Error creating invoice");
//     } finally {
//       setLoading(false);
//       setOpen(false);
//     }
//   };

//   return (
//     <>
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>
//           <Button className="bg-[#5965AB] text-white px-6 py-2 rounded-md font-semibold shadow-lg hover:bg-[#4f58a0] transition transform hover:scale-[1.01]">
//             + Generate New Invoice
//           </Button>
//         </DialogTrigger>

//         <DialogContent className="sm:max-w-[700px] p-0 rounded-xl bg-white shadow-3xl border border-gray-100">
//           <DialogHeader className="p-6 border-b border-gray-100">
//             <DialogTitle className="text-2xl font-bold text-[#5965AB]">
//               Create New Invoice
//             </DialogTitle>
//             <p className="text-sm text-gray-500 mt-1">
//               Select a client and enter the total amount to generate a draft
//               invoice.
//             </p>
//           </DialogHeader>

//           <form
//             onSubmit={handleInvoiceSubmit}
//             className="space-y-6 p-6 max-h-[70vh] overflow-y-auto"
//           >
//             {/* 🔹 Invoice Header Section */}
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 bg-indigo-50/50 p-4 rounded-xl border border-indigo-200">
//               <div className="flex flex-col">
//                 <Label className="text-xs font-semibold text-gray-600">
//                   INVOICE NO.
//                 </Label>
//                 <span className="text-xl font-extrabold text-[#5965AB] mt-1">
//                   #{invoiceNumber}
//                 </span>
//               </div>
//               <div className="flex flex-col">
//                 <Label className="text-xs font-semibold text-gray-600">
//                   DATE
//                 </Label>
//                 <span className="text-base font-medium text-gray-800 mt-1">
//                   {currentDate}
//                 </span>
//               </div>
//               {capitalizedCompanyName && (
//                 <div className="flex flex-col">
//                   <Label className="text-xs font-semibold text-gray-600">
//                     COMPANY
//                   </Label>
//                   <span className="text-base font-medium text-gray-800 mt-1">
//                     {capitalizedCompanyName}
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* 🔹 Client Search */}
//             <div className="relative">
//               <Label className="text-sm font-semibold text-gray-700 block mb-1">
//                 Select Client
//               </Label>
//               <Input
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setSelectedClient(null);
//                 }}
//                 placeholder="Search client name..."
//                 className="rounded-md border-gray-300 shadow-sm "
//               />
//               {filteredClients.length > 0 && (
//                 <div className="absolute z-50 bg-white border border-gray-200 w-full mt-1 rounded-xl shadow-xl max-h-48 overflow-y-auto">
//                  {filteredClients.map((c) => (
//   <div
//     key={c.id}
//      onClick={() => {
//       setSearch(c.clientName);
//       setSelectedClient(c);
//       setFilteredClients([]);
//     }}
//     className="px-4 py-3 hover:bg-indigo-50 cursor-pointer text-gray-800 transition duration-150"
//   >
//     {c.clientName}
//     <span className="text-xs text-gray-500 ml-2">
//       ({c.clientEmail})
//     </span>
//   </div>
// ))}
//                 </div>
//               )}
//             </div>

//             {/* 🔹 Client Details */}
//             {selectedClient && (
//               <div className="p-4 bg-white border border-gray-300 rounded-xl shadow-md space-y-1">
//                 <p className="text-sm font-bold text-gray-800">
//                   Client: {selectedClient.clientName}
//                 </p>
//                 <p className="text-xs text-gray-600">
//                   <span className="font-medium">Email:</span>{" "}
//                   {selectedClient.clientEmail}
//                 </p>
//                 <p className="text-xs text-gray-600">
//                   <span className="font-medium">Address:</span>{" "}
//                   {selectedClient.clientAddress}
//                 </p>
//               </div>
//             )}

//             {/* 🔹 Description */}
//             <div>
//               <Label className="text-sm font-semibold text-gray-700">
//                 Description
//               </Label>
//               <textarea
//                 name="invoiceDescription"
//                 rows={3}
//                 placeholder="Enter a detailed description of the services rendered (e.g., Monthly Retainership, Project X Development, etc.)"
//                 className="w-full border border-gray-300 rounded-xl px-4 py-3 mt-2 outline-none resize-none  text-sm shadow-sm"
//               />
//             </div>

//             {/* 🔹 Amount Section */}
//             <div className="bg-green-50/70 border-2 border-green-200 p-6 rounded-xl text-center shadow-inner">
//               <Label className="text-lg font-bold text-green-700 block mb-2">
//                 TOTAL AMOUNT
//               </Label>
//               <div className="relative">
//                 <Input
//                   name="invoiceAmount"
//                   type="number"
//                   step="0.01"
//                   placeholder="0.00$"
//                   required
//                   className="text-4xl w-3/4 mx-auto font-extrabold text-gray-900 text-center border-none bg-transparent   pl-8"
//                 />
//               </div>
//             </div>

//             <DialogFooter className="pt-4">
//               <Button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-[#5965AB] hover:bg-[#4f58a0] text-white py-3 text-lg font-semibold rounded-xl shadow-lg transition duration-300"
//               >
//                 {loading ? "Generating..." : "Generate Invoice (Save as Draft)"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default Invoicedialog;

"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { getallinvoice } from "@/features/Slice/InvoiceSlice";

const Invoicedialog = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchInputRef = useRef(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.User);
  const { id } = useParams();
  const companySlug = id;

  const capitalizedCompanyName = id
    ? id.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "";

  // 🔹 Generate invoice number and date
  useEffect(() => {
    if (open) {
      const randomNum = Math.floor(100 + Math.random() * 900);
      setInvoiceNumber(`INV-${randomNum}`);
      setCurrentDate(new Date().toLocaleDateString("en-GB"));
      setSearch("");
      setSelectedClient(null);
      setFilteredClients([]);
      setHighlightedIndex(-1);
    }
  }, [open]);

  // 🔹 Fetch clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(`/api/get-all-clients/${id}`);
        setClients(res.data.clients || []);
      } catch {
        toast.error("Failed to fetch clients");
      }
    };
    fetchClients();
  }, [id]);

  // 🔹 Filter clients on search
  useEffect(() => {
    setHighlightedIndex(-1);
    if (search.trim() === "") {
      setFilteredClients([]);
    } else {
      const matched = clients.filter((c) =>
        c.clientName.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredClients(matched);
    }
  }, [search, clients]);

  // 🔹 Select client (shared for keyboard + mouse)
  const selectClient = useCallback((client) => {
    setSearch(client.clientName);
    setSelectedClient(client);
    setFilteredClients([]);
    setHighlightedIndex(-1);
  }, []);

  // 🔹 Keyboard navigation (Arrow + Enter)
  const handleKeyDown = (e) => {
    if (filteredClients.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredClients.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredClients.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        selectClient(filteredClients[highlightedIndex]);
        searchInputRef.current.blur();
      }
    } else if (e.key === "Escape") {
      setFilteredClients([]);
    }
  };

  // 🔹 Handle invoice creation
  const handleInvoiceSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClient) {
      toast.error("Please select a client first");
      return;
    }

    setLoading(true);
    try {
      const data = Object.fromEntries(new FormData(e.target));
      data.companySlug = companySlug;
      data.clientId = selectedClient.id;
      data.invoiceNumber = invoiceNumber;
      data.invoiceDate = currentDate;
      data.Description = data.invoiceDescription || "";
      data.totalAmount = Number(data.invoiceAmount);
      data.createdBy = user?.name;
      data.status = "Draft";
      data.user_id = user?.uid;
      data.type = "admin";

      const res = await axios.post("/api/create-invoice", data, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.success) {
        toast.success("Invoice Created Successfully!");
        e.target.reset();
        setSelectedClient(null);
        setSearch("");
        dispatch(getallinvoice(res.data.assignedInvoices));
      } else toast.error(res.data.error || "Failed to create invoice");
    } catch {
      toast.error("Error creating invoice");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#5965AB] text-white px-6 py-2 rounded-md font-semibold shadow-lg hover:bg-[#4f58a0] transition transform hover:scale-[1.01]">
          + Generate New Invoice
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px] p-0 rounded-xl bg-white shadow-3xl border border-gray-100">
        <DialogHeader className="p-6 border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold text-[#5965AB]">
            Create New Invoice
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Select a client and enter the total amount to generate a draft
            invoice.
          </p>
        </DialogHeader>

        <form
          onSubmit={handleInvoiceSubmit}
          className="space-y-6 p-6 max-h-[70vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 bg-indigo-50/50 p-4 rounded-xl border border-indigo-200">
            <div className="flex flex-col">
              <Label className="text-xs font-semibold text-gray-600">
                INVOICE NO.
              </Label>
              <span className="text-xl font-extrabold text-[#5965AB] mt-1">
                #{invoiceNumber}
              </span>
            </div>
            <div className="flex flex-col">
              <Label className="text-xs font-semibold text-gray-600">
                DATE
              </Label>
              <span className="text-base font-medium text-gray-800 mt-1">
                {currentDate}
              </span>
            </div>
            {capitalizedCompanyName && (
              <div className="flex flex-col">
                <Label className="text-xs font-semibold text-gray-600">
                  COMPANY
                </Label>
                <span className="text-base font-medium text-gray-800 mt-1">
                  {capitalizedCompanyName}
                </span>
              </div>
            )}
          </div>

          {/* Client Search */}
          <div className="relative">
            <Label className="text-sm font-semibold text-gray-700 block mb-1">
              Select Client
            </Label>
            <Input
              ref={searchInputRef}
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);
                if (selectedClient && selectedClient.clientName !== value) {
                  setSelectedClient(null);
                }
              }}
              onKeyDown={handleKeyDown}
              onBlur={() => setTimeout(() => setFilteredClients([]), 100)}
              placeholder="Search client name..."
              className="rounded-md border-gray-300 shadow-sm"
            />

            {filteredClients.length > 0 && (
              <div className="absolute z-50 bg-white border border-gray-200 w-full mt-1 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                {filteredClients.map((c, index) => (
                  <div
                    key={c.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectClient(c);
                       setFilteredClients([]); 
      searchInputRef.current.blur(); 
                    }}
                    className={`px-4 py-3 cursor-pointer text-gray-800 transition duration-150 ${
                      index === highlightedIndex
                        ? "bg-indigo-100"
                        : "hover:bg-indigo-50"
                    }`}
                  >
                    {c.clientName}
                    <span className="text-xs text-gray-500 ml-2">
                      ({c.clientEmail})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Client Info */}
          {selectedClient && (
            <div className="p-4 bg-white border border-gray-300 rounded-xl shadow-md space-y-1">
              <p className="text-sm font-bold text-gray-800">
                Client: {selectedClient.clientName}
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Email:</span>{" "}
                {selectedClient.clientEmail}
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Address:</span>{" "}
                {selectedClient.clientAddress}
              </p>
            </div>
          )}

          {/* Description */}
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              Description
            </Label>
            <textarea
              name="invoiceDescription"
              rows={3}
              placeholder="Enter description..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 mt-2 outline-none resize-none text-sm shadow-sm"
            />
          </div>

          {/* Amount */}
          <div className="bg-green-50/70 border-2 border-green-200 p-6 rounded-xl text-center shadow-inner">
            <Label className="text-lg font-bold text-green-700 block mb-2">
              TOTAL AMOUNT
            </Label>
            <Input
              name="invoiceAmount"
              type="number"
              step="0.01"
              placeholder="0.00$"
              required
              className="text-4xl w-3/4 mx-auto font-extrabold text-gray-900 text-center border-none bg-transparent"
            />
          </div>

          {/* Submit */}
          <DialogFooter className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5965AB] hover:bg-[#4f58a0] text-white py-3 text-lg font-semibold rounded-xl shadow-lg transition duration-300"
            >
              {loading ? "Generating..." : "Generate Invoice (Save as Draft)"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Invoicedialog;
