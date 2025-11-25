"use client";
import Employeebreadcrumb from "@/app/utils/employees/components/breadcrumbs/Employeebreadcrumb";
import Listcompanies from "@/app/utils/employees/components/Listelements/Listcompanies";
import Employeelayout from "@/app/utils/employees/layout/Employeelayout";
import { useParams } from "next/navigation";
import React from "react";

const page = () => {
  const { slug } = useParams();



  return (
    <>
      <Employeelayout>
        <section className="w-full p-6">
          <Employeebreadcrumb slug={slug} path={"Companies"} />
          <Listcompanies />
        </section>
      </Employeelayout>
    </>
  );
};

export default page;
