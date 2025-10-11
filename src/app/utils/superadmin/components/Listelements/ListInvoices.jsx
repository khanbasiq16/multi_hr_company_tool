"use client"
import { Card } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import Invoicedialog from '../dialog/Invoicedialog'
import InvoiceTable from '../Tables/InvoiceTable'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { getallinvoice } from '@/features/Slice/InvoiceSlice'

const ListInvoices = () => {
     const [loading, setLoading] = useState(true);
  const router = useRouter()
  const dispatch = useDispatch();
  const { invoices } = useSelector((state) => state.Invoice);


  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await axios.get("/api/get-all-invoice");

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
        <p className="text-center text-gray-500">Loading expenses...</p>
      ) : invoices.length === 0 ? (
        <div className="flex h-full justify-center items-center">
          <Invoicedialog />
        </div>
      ) : (
        <>
        <InvoiceTable expenses={expenses}/>
        </>
      )}
    </Card>
  )
}

export default ListInvoices