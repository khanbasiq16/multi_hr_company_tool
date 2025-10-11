"use client"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createemployees } from '@/features/Slice/EmployeeSlice';
import { Card } from '@/components/ui/card';
import { EmployeeTable } from '../Tables/EmployeeTable';
import Employeedailog from '../dialog/Employeedailog';
import axios from 'axios';

const ListEmployees = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const { employees } = useSelector((state) => state.Employee);



    console.log(employees)

     useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`/api/get-all-employees`);
        dispatch(createemployees(res.data?.employees || []));
      } catch (error) {
        console.error("Error fetching employees:", error);
        setEmployees([]); // ✅ corrected
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);


  return (
     <Card className="p-6 rounded-xl shadow-md flex flex-col h-[64vh] overflow-auto">
      {loading ? (
        <p className="text-center text-gray-500">Loading employees...</p>
      ) : employees.length === 0 ? (
        <div className="flex h-full justify-center items-center">
          <Employeedailog />
        </div>
      ) : (
        <>

        <EmployeeTable employees={employees}/>
        </>
      )}
    </Card>
  )
}

export default ListEmployees