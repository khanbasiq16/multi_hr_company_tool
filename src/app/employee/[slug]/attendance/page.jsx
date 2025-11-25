"use client";

import Employeebreadcrumb from "@/app/utils/employees/components/breadcrumbs/Employeebreadcrumb";
import Employeelayout from "@/app/utils/employees/layout/Employeelayout";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Listattendance from "@/app/utils/employees/components/Listelements/Listattendance";

const Page = () => {
  const { slug } = useParams();
  const { user } = useSelector((state) => state.User);

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!user?.employeeId) return;

      setLoading(true);
      try {
        const res = await axios.get(`/api/get-employee/${user.employeeId}`);
        setAttendance(res?.data?.employee?.Attendance); 
        console.log("✅ Employee Data:", res.data.data);
      } catch (error) {
        console.error("❌ Error fetching employee:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [user?.employeeId]);

  return (
    <Employeelayout>
      <section className="w-full p-6">

      <Employeebreadcrumb slug={slug} path="Show all Attendance" />

      <Listattendance attendance={attendance} />

      </section>
  
    </Employeelayout>
  );
};

export default Page;
