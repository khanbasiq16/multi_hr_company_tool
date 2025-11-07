"use client"
import Superbreadcrumb from '@/app/utils/superadmin/components/breadcrumbs/Superbreadcrumb'
import Listallattendance from '@/app/utils/superadmin/components/Listelements/Listallattendance'
import SuperAdminlayout from '@/app/utils/superadmin/layout/SuperAdmin'
import React from 'react'

const page = () => {
  return (
    <>
    <SuperAdminlayout>
        <section className="w-full">
            <Superbreadcrumb path={"Attendance"}/>
            
            <Listallattendance />
        </section>
    </SuperAdminlayout>
    </>
  )
}

export default page