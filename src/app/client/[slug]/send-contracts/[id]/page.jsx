"use client";
import ViewContractdetails from "@/app/utils/basecomponents/ViewContractdetails";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const page = () => {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [fields, setFields] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contractloading, setcontractLoading] = useState(false);
  const [updateloading, setUpdateLoading] = useState(false);
  const [clientinfo, setClientinfo] = useState(null);
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
          setClientinfo(c?.clientinfo || {});

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
      setcontractLoading(true);
      const currentTime = new Date();
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // ⬅️ STEP 1: Get Public IP
      const getIP = async () => {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();
        return ipData.ip || null;
      };

      const getExactLocation = async (lat, lon) => {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );
        const data = await response.json();

        return {
          exactLocation: data.display_name || null,
          city:
            data.address.city ||
            data.address.town ||
            data.address.village ||
            null,
          area: data.address.suburb || null,
          country: data.address.country || null,
        };
      };

      // ⬅️ Fetch Public IP First
      const userIP = await getIP();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const locationData = await getExactLocation(latitude, longitude);

            const res = await axios.post("/api/contracts/contract-signed", {
              contractId: id,
              updatedFields: fields,
              status: "signed",
              time: currentTime,
              timezone,
              latitude,
              longitude,
              exactLocation: locationData.exactLocation,
              city: locationData.city,
              area: locationData.area,
              country: locationData.country,
              ip: userIP,
            });

            if (res.data.success) {
              toast.success("Contract signed!");
              setcontractLoading(false);

              setTimeout(() => {
                window.location.reload();
              }, 500);
            }
          },
          (error) => {
            console.error("Location Permission Denied:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported in this browser.");
      }
    } catch (error) {
      console.error("Error updating contract:", error);
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
          clientinfo={clientinfo}
        />
      </div>

      <div className="flex justify-center w-full items-center mt-4 mb-8 gap-2">
        {contract.status !== "signed" && (
          <button
            onClick={handleupdateform}
            className={`px-4 py-2 rounded text-white transition-colors ${contractloading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#5965AB] hover:bg-[#5f6ebe]"
              }`}
          >
            {
              contractloading ? "Signing Contract..." : "Contract Signed"
            }
          </button>
        )}
      </div>
    </div>
  );
};

export default page;
