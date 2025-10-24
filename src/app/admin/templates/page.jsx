"use client"
import Superbreadcrumb from '@/app/utils/superadmin/components/breadcrumbs/Superbreadcrumb'
import ListTemplates from '@/app/utils/superadmin/components/Listelements/ListTemplates'
import SuperAdminlayout from '@/app/utils/superadmin/layout/SuperAdmin'
import React from 'react'

const page = () => {
  return (
    <>
    <SuperAdminlayout>
        <Superbreadcrumb path={"Templates"}/>
        <ListTemplates />

    </SuperAdminlayout>
    </>
  )
}

export default page