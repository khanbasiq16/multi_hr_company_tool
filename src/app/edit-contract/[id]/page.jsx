"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Contractfeilds from "@/app/utils/basecomponents/Contractfeilds";

const Page = () => {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [fields, setFields] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        if (!id) return;

        const res = await axios.get(`/api/get-contract/${id}`);
        if (res.data.success) {
          const c = res.data.contract;
          setContract(c);
          setCompany(c?.template?.company || {});
          setFields(c?.template?.fields || []);
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
      <h1 className="text-2xl  font-semibold mb-6 text-gray-800">
        Edit Contract — {contract.contractName}
      </h1>

      <div className="w-full flex justify-center">
      <Contractfeilds fields={fields} company={company} onUpdate={handleFieldUpdate} />
      </div>
      <div className="flex justify-end mt-8">
        <button
          onClick={() => console.log("Updated Fields:", fields)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Page;
