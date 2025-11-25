"use client"
import Superbreadcrumb from '@/app/utils/superadmin/components/breadcrumbs/Superbreadcrumb'
import ListTemplates from '@/app/utils/superadmin/components/Listelements/ListTemplates'
import SuperAdminlayout from '@/app/utils/superadmin/layout/SuperAdmin'
import { createtemplate } from '@/features/Slice/TemplateSlice'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

const page = () => {
  const dispatch = useDispatch()

  const [loading , setLoading] = useState(false)
  

   useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get("/api/templates/get");
        if (res.data.success) {
          console.log(res?.data?.templates);
          dispatch(createtemplate(res?.data?.templates || []));
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <>
    <SuperAdminlayout>
        <section className="w-full p-6">

        <Superbreadcrumb path={"Templates"}/>
        <ListTemplates loading={loading}/>

        </section>
    </SuperAdminlayout>
    </>
  )
}

export default page