"use client"
import Employeebreadcrumb from '@/app/utils/employees/components/breadcrumbs/Employeebreadcrumb'
import Invoicedetails from '@/app/utils/employees/components/Details/Invoicedetails'
import Employeelayout from '@/app/utils/employees/layout/Employeelayout'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
 const {slug , id , invoiceid } = useParams()


  const [client, setClient] = useState(null);
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        const invoiceRes = await axios.get(`/api/get-invoice/${invoiceid}`);

        if (invoiceRes.data?.success) {
          const invoiceData = invoiceRes.data?.invoice;
          setInvoice(invoiceData);

          const clientRes = await axios.get(`/api/get-client/${invoiceData?.clientId}`);
          if (clientRes.data?.success) {

            setClient(clientRes.data?.client);
          }
        }
      } catch (error) {
        console.error("Error fetching invoice or client data:", error);
      }
    };

    if (invoiceid) fetchInvoiceDetails();
  }, [invoiceid]);


  return (
    <>
    <Employeelayout>
        <section className="w-full">
       <Employeebreadcrumb slug={slug} path={id} path2={"Invoice details"} />
        <Invoicedetails invoice={invoice} client={client} setInvoice={setInvoice} />
        </section>
    </Employeelayout>
    </>
  )
}

export default page