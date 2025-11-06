"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";

import SuperAdminlayout from "@/app/utils/superadmin/layout/SuperAdmin";
import Companybreadcumbs from "@/app/utils/superadmin/components/breadcrumbs/Companybreadcumbs";
import Listcontracts from "@/app/utils/superadmin/components/Listelements/Listcontracts";
import { createtemplate } from "@/features/Slice/TemplateSlice";
import { createcontracts } from "@/features/Slice/ContractsSlice";


const Page = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  


  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get(`/api/templates/${id}`);
        if (res.data.success) {
          dispatch(createtemplate(res.data.templates || []));
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
      } 
    };

    if (id) fetchTemplates();
  }, [id, dispatch]);


 
  return (
    <SuperAdminlayout>
      <Companybreadcumbs path="Contracts" />
      <Listcontracts  />
    </SuperAdminlayout>
  );
};

export default Page;
