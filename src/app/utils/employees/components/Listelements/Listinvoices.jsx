"use client"
import { Card } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { getallinvoice } from '@/features/Slice/InvoiceSlice'
import Invoicedialog from '../dialog/Invoicedialog'
import InvoiceTable from '../Tables/InvoiceTable'

const Listinvoices = () => {
       const [loading, setLoading] = useState(true);
      const router = useRouter()
      const dispatch = useDispatch();
      const { invoices } = useSelector((state) => state.Invoice);
      const { user } = useSelector((state) => state.User);
    
      const {id , slug} = useParams()

      console.log(id , slug)
    
    
      useEffect(() => {
        const fetchExpense = async () => {
          try {
            setLoading(true);
            const res = await axios.get(`/api/get-invoices/${id}/${user.employeeId}`);
    
            dispatch(getallinvoice(res.data?.invoices || []));
          } catch (error) {
            console.error("Error fetching companies:", error);
            setCompanies([]);
          } finally {
            setLoading(false);
          }
        };
    
        fetchExpense();
      }, []);
        
  return (
    <Card className="p-6 rounded-xl shadow-md flex flex-col h-[64vh] overflow-auto">
      {loading ? (
        <p className="text-center text-gray-500">Loading Invoices...</p>
      ) : invoices.length === 0 ? (
        <div className="flex h-full justify-center items-center">
          <Invoicedialog />
        </div>
      ) : (
        <>
        <InvoiceTable invoices={invoices} slug={id} companyslug={slug}/>
        </>
      )}
    </Card>
  )
}

export default Listinvoices