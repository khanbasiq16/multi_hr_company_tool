'use client'
import Companybreadcumbs from '@/app/utils/superadmin/components/breadcrumbs/Companybreadcumbs';
import Invoicedetails from '@/app/utils/superadmin/components/Details/Invoicedetails';
import SuperAdminlayout from '@/app/utils/superadmin/layout/SuperAdmin';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Page = () => {
  const { invoiceid } = useParams();
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
    <SuperAdminlayout>
      <section className="w-full">
        <Companybreadcumbs path={"Invoice Details"} />
        <Invoicedetails invoice={invoice} client={client} />
       </section>
       
    </SuperAdminlayout>
  );
};

export default Page;
