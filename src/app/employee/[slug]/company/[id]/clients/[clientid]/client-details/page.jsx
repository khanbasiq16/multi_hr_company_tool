"use client";
import Employeebreadcrumb from "@/app/utils/employees/components/breadcrumbs/Employeebreadcrumb";
import ClientDetails from "@/app/utils/employees/components/Details/ClientDetails";
import Employeelayout from "@/app/utils/employees/layout/Employeelayout";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const { slug, id, clientid } = useParams();

  const [client, setClient] = useState(null);

  useEffect(() => {
    const getemployee = async () => {
      try {
        const res = await axios.get(`/api/get-client/${clientid}`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setClient(res.data.client);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    getemployee();
  }, []);

  return (
    <>
      <Employeelayout>
        <section className="w-full">
          <Employeebreadcrumb slug={slug} path={id} path2={"Client details"} />
           <ClientDetails client={client} setClient={setClient} />
        </section>
      </Employeelayout>
    </>
  );
};

export default page;
