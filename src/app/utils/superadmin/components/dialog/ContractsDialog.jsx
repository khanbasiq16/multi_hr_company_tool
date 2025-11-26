// "use client";

// import React, { useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useDispatch, useSelector } from "react-redux";
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
// import { useParams } from "next/navigation";
// import { createcontracts } from "@/features/Slice/ContractsSlice";

// const ContractDialog = () => {
//   const dispatch = useDispatch()
//   const [open, setOpen] = useState(false);
//   const [step, setStep] = useState(1); 
//   const [contractName, setContractName] = useState("");
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const {id} = useParams()
//   const {user} = useSelector((state) => state.User);
//   const { clients } = useSelector((state) => state.Client); 

//   const { templates } = useSelector((state) => state.Templates);

//   const handleSelect = (id) => {
//     setSelectedTemplate(id);
//   };

//   const handleNext = () => {
//     if (!contractName.trim()) {
//       toast.error("Please enter a contract name");
//       return;
//     }
//     setStep(2);
//   };

//   const handleBack = () => {
//     setStep(1);
//   };

//   const formHandler = async (e) => {
//     e.preventDefault();
//     if (!selectedTemplate) {
//       toast.error("Please select a template");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.post("/api/create-contract", {
//         userid: user?.uid,
//         contractName,
//         templateId:selectedTemplate,
//         companyid:id,
//         status:"active"
//       });

//       const data = res.data;
//       if (data.success) {
//         toast.success("Contract created successfully!");
//         setContractName("");
//         setSelectedTemplate(null);
//         dispatch(createcontracts(data?.contracts))

//         setOpen(false);
//         setStep(1);
//       } else {
//         toast.error(data.message || "Failed to create contract");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong while creating contract");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button className="bg-[#5965AB] text-white">+ Create Contract</Button>
//       </DialogTrigger>

//       <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>
//             {step === 1 ? "Contract Name" : "Select Template"}
//           </DialogTitle>
//         </DialogHeader>


//         {step === 1 && (
//           <div className="space-y-6 mt-2">
//             <div>
//               <Label htmlFor="contractName">Contract Name *</Label>
//               <Input
//                 className="mt-2"
//                 id="contractName"
//                 name="contractName"
//                 placeholder="Enter contract name"
//                 value={contractName}
//                 onChange={(e) => setContractName(e.target.value)}
//                 required
//               />
//             </div>

//             <DialogFooter className="flex justify-end gap-3 mt-6">
//               <Button onClick={handleNext} className="bg-[#5965AB] text-white">
//                 Next
//               </Button>
//             </DialogFooter>
//           </div>
//         )}


//         {step === 2 && (
//           <form onSubmit={formHandler} className="space-y-6 mt-2">
//             <div>
//               <Label className="block mb-3">Select Template *</Label>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                 {templates?.length > 0 ? (
//                   templates.map((template) => {
//                     const isSelected = selectedTemplate === template.id;
//                     return (
//                       <div
//                         key={template.id}
//                         onClick={() => handleSelect(template.id)}
//                         className={`group bg-white dark:bg-gray-900 p-5 border rounded-2xl transition-all cursor-pointer ${
//                           isSelected
//                             ? "border-blue-500 ring-2 ring-blue-300"
//                             : "border-gray-200 dark:border-gray-700 hover:border-blue-400"
//                         }`}
//                       >
//                         <div className="flex justify-center mb-4">
//                           <img
//                             src={
//                               template.company?.companyLogo 
//                             }
//                             alt={`${template.company?.name} logo`}
//                             className="w-16 h-16 object-contain transition-transform duration-300"
//                           />
//                         </div>

//                         <h3 className="font-semibold text-lg text-center text-gray-800 dark:text-gray-100 mb-2">
//                             {template.templateName || "Untitled Form"}
//                         </h3>

//                         <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-3">
//                           Company:{" "}
//                           <span className="font-medium text-gray-700 dark:text-gray-300">
//                             {template.company?.name}
//                           </span>
//                         </p>

//                         <div className="flex justify-center">
//                           <span className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded-full font-medium">
//                             {template.role === "Admin"
//                               ? "Contract"
//                               : "Employee Letter"}
//                           </span>
//                         </div>
//                       </div>
//                     );
//                   })
//                 ) : (
//                   <p className="text-center text-gray-500 col-span-full">
//                     No templates available.
//                   </p>
//                 )}
//               </div>
//             </div>

//             <DialogFooter className="flex justify-between gap-3 mt-6">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={handleBack}
//                 className="border-gray-300"
//               >
//                 Back
//               </Button>
//               <Button
//                 type="submit"
//                 className="bg-[#5965AB] text-white"
//                 disabled={loading}
//               >
//                 {loading ? "Saving..." : "Save"}
//               </Button>
//             </DialogFooter>
//           </form>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ContractDialog;


"use client";

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
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
import { useParams } from "next/navigation";
import { createcontracts } from "@/features/Slice/ContractsSlice";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ContractDialog = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [contractName, setContractName] = useState("");
  const [selectedClient, setSelectedClient] = useState(null); // NEW
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const { user } = useSelector((state) => state.User);
  const { clients } = useSelector((state) => state.Client);
  const { templates } = useSelector((state) => state.Templates);

  const handleSelectTemplate = (id) => {
    setSelectedTemplate(id);
  };

  const handleNext = () => {
    if (!contractName.trim()) {
      toast.error("Please enter a contract name");
      return;
    }
    if (!selectedClient) {
      toast.error("Please select a client");
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const formHandler = async (e) => {
    e.preventDefault();
    if (!selectedTemplate) {
      toast.error("Please select a template");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/create-contract", {
        userid: user?.uid,
        contractName,
        templateId: selectedTemplate,
        clientId: selectedClient,
        companyid: id,
        status: "active",
      });

      const data = res.data;
      if (data.success) {
        toast.success("Contract created successfully!");
        setContractName("");
        setSelectedClient(null);
        setSelectedTemplate(null);
        dispatch(createcontracts(data?.contracts));
        setOpen(false);
        setStep(1);
      } else {
        toast.error(data.message || "Failed to create contract");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while creating contract");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#5965AB] text-white">+ Create Contract</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Contract Name & Client" : "Select Template"}
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Contract Name + Client Selection */}
        {step === 1 && (
          <div className="space-y-6 mt-2">
            {/* Contract Name */}
            <div>
              <Label htmlFor="contractName">Contract Name *</Label>
              <Input
                className="mt-2"
                id="contractName"
                name="contractName"
                placeholder="Enter contract name"
                value={contractName}
                onChange={(e) => setContractName(e.target.value)}
                required
              />
            </div>

            {/* Client Selection */}
            <div>
              <Label htmlFor="clientSelect">Select Client *</Label>
              <Select
                value={selectedClient || ""}
                onValueChange={(value) => setSelectedClient(value)}
              >
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients?.length > 0 ? (
                    clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.clientName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      No clients available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="flex justify-end gap-3 mt-6">
              <Button
                onClick={handleNext}
                className="bg-[#5965AB] text-white"
              >
                Next
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* Step 2: Template Selection */}
        {step === 2 && (
          <form onSubmit={formHandler} className="space-y-6 mt-2">
            <div>
              <Label className="block mb-3">Select Template *</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {templates?.length > 0 ? (
                  templates.map((template) => {
                    const isSelected = selectedTemplate === template.id;
                    return (
                      <div
                        key={template.id}
                        onClick={() => handleSelectTemplate(template.id)}
                        className={`group bg-white dark:bg-gray-900 p-5 border rounded-2xl transition-all cursor-pointer ${isSelected
                            ? "border-blue-500 ring-2 ring-blue-300"
                            : "border-gray-200 dark:border-gray-700 hover:border-blue-400"
                          }`}
                      >
                        <div className="flex justify-center mb-4">
                          <img
                            src={template.company?.companyLogo}
                            alt={`${template.company?.name} logo`}
                            className="w-16 h-16 object-contain transition-transform duration-300"
                          />
                        </div>

                        <h3 className="font-semibold text-lg text-center text-gray-800 dark:text-gray-100 mb-2">
                          {template.templateName || "Untitled Form"}
                        </h3>

                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-3">
                          Company:{" "}
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {template.company?.name}
                          </span>
                        </p>

                        <div className="flex justify-center">
                          <span className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded-full font-medium">
                            {template.role === "Admin"
                              ? "Contract"
                              : "Employee Letter"}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-gray-500 col-span-full">
                    No templates available.
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="flex justify-between gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="border-gray-300"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="bg-[#5965AB] text-white"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContractDialog;
