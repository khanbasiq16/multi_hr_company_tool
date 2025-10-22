"use client"
import Employeecompbreadcrumb from '@/app/utils/employees/components/breadcrumbs/Employeecompbreadcrumb'
import Listinvoices from '@/app/utils/employees/components/Listelements/Listinvoices'
import Employeelayout from '@/app/utils/employees/layout/Employeelayout'
import { useParams } from 'next/navigation'
import React from 'react'

const page = () => {
    const {slug , id } = useParams()


  return (
    <>
    
    <Employeelayout>

         <section className="w-full">
          <Employeecompbreadcrumb slug={slug} path={id} path2={"Invoices"} />

          <Listinvoices />

          </section>
    </Employeelayout>
    </>
  )
}

export default page