"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import ContractDialog from "../dialog/ContractsDialog";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Building2,
  FileText,
  CheckCircle2,
  Clock,
  Edit,
  Send,
} from "lucide-react";
import { createcontracts } from "@/features/Slice/ContractsSlice";
import axios from "axios";

const Listcontracts = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { contracts } = useSelector((state) => state.Contracts);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await axios.get(`/api/get-contracts/${id}`);
        if (res.data.success) {
          console.log(res.data.contracts)
          dispatch(createcontracts(res.data?.contracts || []));
        }
      } catch (error) {
        console.error("Error fetching contracts:", error);
        console.log()
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [id]);

  const formatCompanyName = (name) => {
    if (!name) return "";
    return name
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl shadow-md h-[64vh] overflow-auto">
      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Loading Contracts...
        </p>
      ) : contracts.length === 0 ? (
        <div className="flex h-full justify-center items-center">
          <ContractDialog />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 ">
          {contracts?.map((contract) => (
            <div
              key={contract.id}
              className="relative group bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300  overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center gap-3 p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-lg">
                  {contract.contractName}
                </h3>
              </div>

              {/* Company + Status */}
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      {formatCompanyName(contract.companyid) ||
                        "Unknown Company"}
                    </span>
                  </p>
                </div>

                <span
                  className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium shadow-sm ${
                    contract.status === "active"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300"
                  }`}
                >
                  {contract.status === "active" ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <Clock className="w-3 h-3" />
                  )}
                  {contract.status === "active" ? "Active" : "Pending"}
                </span>
              </div>

              {/* Footer Buttons */}
              <div className="   border p-4 space-y-2 ">
                <Button
                  variant="outline"
                  className="flex items-center w-full justify-center border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-all rounded-lg font-medium"
                  onClick={() =>
                    router.push(`/view-contract-details/${contract.id}`)
                  }
                >
                  <Eye className="w-4 h-4" />
                  View
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center   w-full justify-center border-amber-500 text-amber-600 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/30 transition-all rounded-lg font-medium"
                  onClick={() => router.push(`/edit-contract/${contract.id}`)}
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center  w-full justify-center border-green-500 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/30 transition-all rounded-lg font-medium"
                  onClick={() =>
                    alert(`Sending contract: ${contract.contractName}`)
                  }
                >
                  <Send className="w-4 h-4" />
                  Send
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Listcontracts;
