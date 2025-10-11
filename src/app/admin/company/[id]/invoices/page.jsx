"use client"
import Companybreadcumbs from '@/app/utils/superadmin/components/breadcrumbs/Companybreadcumbs'
import ListInvoices from '@/app/utils/superadmin/components/Listelements/ListInvoices'
import SuperAdminlayout from '@/app/utils/superadmin/layout/SuperAdmin'
import { getallinvoice } from '@/features/Slice/InvoiceSlice'
import axios from 'axios'
import React, { use, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const page = () => {

    const dispatach = useDispatch();


      const [loading, setLoading] = useState(true);
    //   const { invoice } = useSelector((state) => state.User);
    
      useEffect(() => {
        const fetchclients = async () => {
          try {
            const res = await axios.get(`/api/get-all-invoice`);

            dispatach(getallinvoice(res.data?.invoices || []));

          } catch (error) {
            console.error("Error fetching employees:", error);
            setExpense([]); 
          } finally {
            setLoading(false);
          }
        };
    
        fetchclients();
      }, []);

  return (
    <>
    <SuperAdminlayout>
         <section className="w-full">
            <Companybreadcumbs path={"Invoices"}/>
            <ListInvoices/>
            </section>
    </SuperAdminlayout>
    </>
  )
}

export default page