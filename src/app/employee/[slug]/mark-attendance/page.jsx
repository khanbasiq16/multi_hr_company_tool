"use client";
import Employeelayout from "@/app/utils/employees/layout/Employeelayout";
import React, { useEffect, useState } from "react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Checkin from "@/app/utils/employees/components/attendance/Checkin";
import CheckOut from "@/app/utils/employees/components/attendance/CheckOut";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

const Page = () => {
  const [selected, setSelected] = useState("checkin");
  const [isCheckedIn, setIsCheckedin] = useState(false);
  const [isCheckedout, setIsCheckedout] = useState(false);
  const [loading, setLoading] = useState(true);

  const { slug } = useParams();
  const { user } = useSelector((state) => state.User);





  useEffect(() => {
    const getEmployeeDetails = async () => {
      setLoading(true); // Start loader
      try {
        const response = await axios.get(
          `/api/attendance/get-attendance-status/${user?.employeeId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;

        setIsCheckedin(data.employee.isCheckedin);
        setIsCheckedout(data.employee.isCheckedout);


        setSelected(data.employee.isCheckedin ? "checkout" : "checkin");
      } catch (error) {
        console.error("❌ Error fetching attendance:", error);
        toast.error(
          error.response?.data?.error || "Failed to fetch attendance details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.employeeId) getEmployeeDetails();
  }, [user?.employeeId]);

  return (
    <Employeelayout>
      <div className="w-full px-4 mt-5 sm:mt-0 sm:px-6 py-4 flex flex-col sm:flex-row sm:justify-between gap-3 sm:items-center border-b">
        <h2 className="text-md font-semibold mb-3 sm:mb-0 text-gray-700 text-center sm:text-left leading-5">
          Employee {">"} {slug.replace(/-/g, " ")} {">"} mark attendance
        </h2>

        {!loading && (
          <div className="flex w-full sm:w-auto justify-center">
            <button
              onClick={() => setSelected("checkin")}
              className={`px-5 py-2 font-semibold rounded-l-2xl transition-all duration-300 
        ${selected === "checkin"
                  ? "bg-[#5965AB] text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
            >
              Check In
            </button>

            <button
              onClick={() => setSelected("checkout")}
              className={`px-5 py-2 font-semibold rounded-r-2xl transition-all duration-300 
        ${selected === "checkout"
                  ? "bg-[#5965AB] text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
            >
              Check Out
            </button>
          </div>
        )}
      </div>



      <div className="p-6 flex justify-center items-center min-h-[300px]">
        {loading ? (

          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 mt-3">Loading attendance status...</p>
          </div>
        ) : selected === "checkin" ? (
          <Checkin
            isCheckedIn={isCheckedIn}
            setIsCheckedin={setIsCheckedin}
            setIsCheckedout={setIsCheckedout}
          />
        ) : selected === "checkout" ? (
          <CheckOut
            isCheckedIn={isCheckedIn}
            isCheckedout={isCheckedout}
            setIsCheckedout={setIsCheckedout}
            setIsCheckedin={setIsCheckedin}
          />
        ) : (
          <p className="text-gray-500 text-center py-10">
            You have successfully checked in & checked out for today.
          </p>
        )}
      </div>

    </Employeelayout>
  );
};

export default Page;


