"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Contractfeilds from "@/app/utils/basecomponents/Contractfeilds";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Page = () => {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [fields, setFields] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clientinfo, setclientinfo] = useState();
  const [updateloading, setUpdateLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchContract = async () => {
      try {
        if (!id) return;

        const res = await axios.get(`/api/get-contract/${id}`);
        if (res.data.success) {
          const c = res.data.contract;
          setContract(c);

          setclientinfo(c?.clientinfo || {});

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

      const res = await axios.post(`/api/update-contract/${id}`, {
        fields,
      });

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
      <h1 className="text-2xl  font-semibold mb-6 text-gray-800">
        Edit Contract — {contract.contractName}
      </h1>

      <div className="w-full flex justify-center">
        <Contractfeilds
          fields={fields}
          company={company}
          clientinfo={clientinfo}
          onUpdate={handleFieldUpdate}
        />
      </div>
      <div className="flex justify-end mt-8 gap-2">
        <button
          onClick={handleupdateform}
          disabled={updateloading}
          className={`px-4 py-2 rounded text-white transition-colors ${updateloading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#5965AB] hover:bg-[#5f6ebe]"
            }`}
        >
          {updateloading ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={() => router.push(`/view-contract-details/${id}`)}
          className={`px-4 py-2 rounded text-white bg-[#5965AB] hover:bg-[#5f6ebe] transition-colors `}
        >
          Preview Contract
        </button>
      </div>
    </div>
  );
};

export default Page;
