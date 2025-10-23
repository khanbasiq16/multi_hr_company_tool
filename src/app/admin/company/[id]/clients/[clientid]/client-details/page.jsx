"use client"
import Superbreadcrumb from '@/app/utils/superadmin/components/breadcrumbs/Superbreadcrumb'
import ClientDetails from '@/app/utils/superadmin/components/Details/ClientDetails'
import SuperAdminlayout from '@/app/utils/superadmin/layout/SuperAdmin'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {

    const {clientid} = useParams()
    const [client, setClient] = useState(null)


    useEffect(() => {

    const getemployee = async () => {
      try {
        const res = await axios.get(`/api/get-client/${clientid}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials:true,
        });
        setClient(res.data.client)

      } catch (error) {
        console.error("Error fetching employees:", error);
      }   
    }

    getemployee();
  }, [])
  
    
  return (
    <>
    <SuperAdminlayout>
  <div className='w-full'>

       <Superbreadcrumb path={"Client"} path2={`${client?.clientName}`}/> 
       <ClientDetails client={client} setClient={setClient} />
      </div>
    </SuperAdminlayout>
    
    </>
  )
}

export default page