"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import axios from "axios";
import { useParams } from "next/navigation";
import { Clienttable } from "../Tables/Clienttable";
import Clientdialog from "../dialog/Clientdialog";
import { useDispatch, useSelector } from "react-redux";
import { getallclients } from "@/features/Slice/ClientSlice";


const ListClients = () => {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { clients } = useSelector((state) => state.Client);  

  useEffect(() => {
    const fetchclients = async () => {
      try {
        const res = await axios.get(`/api/get-all-clients/${id}`);
       
        dispatch(getallclients(res.data?.clients || []));
      } catch (error) {
        console.error("Error fetching employees:", error);
        setEmployees([]); 
      } finally {
        setLoading(false);
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
        <Clienttable clients={clients} slug={id}/>
        </>
      )}
    </Card>
  );
};

export default ListClients;
