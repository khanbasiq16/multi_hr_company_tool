"use client"
import { Card } from '@/components/ui/card';
import { getallclients } from '@/features/Slice/ClientSlice';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Clientdialog from '../dialog/Clientdialog';
import { Clienttable } from '../Tables/Clienttable';

const Listclients = () => {

    const dispatch = useDispatch()
    const {slug,  id} = useParams()
    const {user} = useSelector((state)=>state.User)
      const { clients } = useSelector((state) => state.Client); 

    const [loading, setloading] = useState(false)


     useEffect(() => {
        const fetchclients = async () => {
          try {
            setloading(true)
            const res = await axios.get(`/api/get-clients/${id}/${user.employeeId}`);

           
            dispatch(getallclients(res.data?.clients || []));
          } catch (error) {
            console.error("Error fetching employees:", error);
            setEmployees([]); 
          } finally {
            setloading(false);
          }
        };
    
        fetchclients();
      }, [id]);
    
  return (
     <Card className="p-6 rounded-xl shadow-md flex flex-col h-[64vh] overflow-auto">
      {loading ? (
        <p className="text-center text-gray-500">Loading Clients...</p>
      ) : clients.length === 0 ? (
        <div className="flex h-full justify-center items-center">
          <Clientdialog />
        </div>
      ) : (
        <>
        <Clienttable clients={clients} slug={slug} companyslug={id}/>
        </>
      )}
    </Card>
  )
}

export default Listclients