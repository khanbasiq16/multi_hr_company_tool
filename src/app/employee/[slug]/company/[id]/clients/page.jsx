"use client";
import Employeecompbreadcrumb from "@/app/utils/employees/components/breadcrumbs/Employeecompbreadcrumb";
import Listclients from "@/app/utils/employees/components/Listelements/Listclients";
import Employeelayout from "@/app/utils/employees/layout/Employeelayout";
import { useParams } from "next/navigation";
import React from "react";

const page = () => {

   const {slug , id } = useParams() 


  return (
    <>
      <Employeelayout>
      <section className="w-full p-6">
          <Employeecompbreadcrumb slug={slug} path={id} path2={"Clients"} />
          <Listclients/>
        </section>
      </Employeelayout>
    </>
  );
};

export default page;
