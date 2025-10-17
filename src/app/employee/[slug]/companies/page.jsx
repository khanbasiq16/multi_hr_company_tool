"use client";
import Employeebreadcrumb from "@/app/utils/employees/components/breadcrumbs/Employeebreadcrumb";
import Employeelayout from "@/app/utils/employees/layout/Employeelayout";
import { useParams } from "next/navigation";
import React from "react";

const page = () => {
  const { slug } = useParams();

  return (
    <>
      <Employeelayout>
        <section className="w-full">
          <Employeebreadcrumb slug={slug} path={"Companies"} />
        </section>
      </Employeelayout>
    </>
  );
};

export default page;
