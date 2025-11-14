"use client";
import ViewContractdetails from '@/app/utils/basecomponents/ViewContractdetails';
import axios from 'axios';
import { useRouter , useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {

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

        if (loading) {
    return <div className="p-4 text-gray-500">Loading contract...</div>;
  }

  if (!contract) {
    return <div className="p-4 text-red-500">No contract found.</div>;
  }


  return (
    <div className="p-4 bg-white">

       <div className="flex justify-center w-full  items-center mt-4 mb-8 gap-2">
      <h1 className="text-4xl  font-bold text-gray-800">
        {contract.contractName}
      </h1>

   
      </div>

      <div className="w-full flex justify-center mb-5">
        <ViewContractdetails
          fields={fields}
          company={company}
          onUpdate={handleFieldUpdate}
        />
      </div>


       <div className="flex justify-center w-full items-center mt-4 mb-8 gap-2">
<button
          onClick={() => router.back()}
          className={`px-4 py-2 rounded text-white transition-colors ${
            updateloading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#5965AB] hover:bg-[#5f6ebe]"
          }`}
        >
          Contract Signed
        </button>

       </div>
     
    </div>
  )
}

export default page