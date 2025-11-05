"use client"
import { createcontracts } from '@/features/Slice/ContractsSlice';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';

const Listcontracts = () => {
    const dispatch = useDispatch()
    const{id} = useParams()


    useEffect(() => {
        const fetchEmployees = async () => {
          try {
            setLoading(true)
            const res = await axios.get(`/api/get-contracts/${id}`);
            dispatch(createcontracts(res.data?.employees || []));
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
    <div>Listcontracts</div>
  )
}

export default Listcontracts