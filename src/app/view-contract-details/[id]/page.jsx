"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Contractfeilds from "@/app/utils/basecomponents/Contractfeilds";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ViewContractdetails from "@/app/utils/basecomponents/ViewContractdetails";
import CopyUrlButton from "@/app/utils/superadmin/components/basecomponent/CopyUrlButton";
import { Loader2 } from "lucide-react";

const Page = () => {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [fields, setFields] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateloading, setUpdateLoading] = useState(false);
  const [contracturl, setcontracturl] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchContract = async () => {
      try {
        if (!id) return;

        const res = await axios.get(`/api/get-contract/${id}`);
        if (res.data.success) {
          const c = res.data.contract;
          setContract(c);

          setcontracturl(c?.contractURL || "");

          setCompany(c?.company || {});
          setFields(c?.fields || []);
        } else {
          console.error("Error:", res.data.error);
        }
      } catch (error) {
        console.error("Failed to fetch contract:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [id]);

  // ✅ Handle field update
  const handleFieldUpdate = (fieldId, updates) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    );
  };

  const handleupdateform = async () => {
    try {
      console.log("Updated Fields:", fields);

      setUpdateLoading(true);

      const res = await axios.post(`/api/generate-contracts/${id}` , {
        headers: {
          "Content-Type": "application/json",
        },
        companyslug: company.companyslug
      });

      if(res.data.success){ 
        console.log("Contract URL:", res.data.contractURL);
        setcontracturl(res.data.contractURL);
      }



      if (res.data.success) {
        toast.success(res.data.message || "Contract updated successfully");
        setUpdateLoading(false);
      }


    } catch (error) {
      console.error("Error updating contract:", error);
      alert("⚠️ Failed to update contract.");
    }
  };

  if (loading) {
    return <div className="p-4 text-gray-500">Loading contract...</div>;
  }

  if (!contract) {
    return <div className="p-4 text-red-500">No contract found.</div>;
  }

  return (
    <div className="p-4 bg-white">

       <div className="flex justify-between  items-center mt-4 mb-8 gap-2">
      <h1 className="text-2xl  font-semibold text-gray-800">
        {contract.contractName}
      </h1>

      <div className="flex justify-end  gap-2">
        {contracturl && (
        <CopyUrlButton url={contracturl} />
      )}

   
      {!contracturl && (
        <button
          onClick={handleupdateform}
          disabled={updateloading}
          className={`px-4 py-2 rounded text-white transition-colors ${
            updateloading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#5965AB] hover:bg-[#5f6ebe]"
          }`}
        >
       {updateloading ? (
  <span className="flex items-center gap-2">
    <Loader2 className="w-4 h-4 animate-spin" />
    Saving...
  </span>
) : (
  "Generate Contract Link"
)}
        </button>
      )}
        <button
          onClick={() => router.back()}
          className={`px-4 py-2 rounded text-white transition-colors bg-[#5965AB] hover:bg-[#5f6ebe] `}
        >
          Back to Main Panel
        </button>
       </div>
      </div>

      <div className="w-full flex justify-center mb-5">
        <ViewContractdetails
          fields={fields}
          company={company}
          onUpdate={handleFieldUpdate}
        />
      </div>
     
    </div>
  );
};

export default Page;
