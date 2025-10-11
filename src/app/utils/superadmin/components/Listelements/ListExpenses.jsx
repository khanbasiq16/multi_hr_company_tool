
"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Building2, MapPin, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { createcompany } from "@/features/Slice/CompanySlice";
import Companydailog from "../dialog/Companydailog";
import { useDispatch, useSelector } from "react-redux";
import { getallexpense } from "@/features/Slice/ExpenseSlice";
import Expensedailog from "../dialog/Expensedailog";
import Expensetable from "../Tables/ExpenseTable";


const ListExpenses = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  const dispatch = useDispatch();
  const { expenses } = useSelector((state) => state.Expense);


  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await axios.get("/api/get-all-expense");

        dispatch(getallexpense(res.data?.expenses || []));
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
      ) : expenses.length === 0 ? (
        <div className="flex h-full justify-center items-center">
          <Expensedailog />
        </div>
      ) : (
        <>
        <Expensetable expenses={expenses}/>
        </>
      )}
    </Card>
  )
}

export default ListExpenses