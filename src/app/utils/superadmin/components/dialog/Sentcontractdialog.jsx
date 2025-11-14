"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import axios from "axios";
import { Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getallclients } from "@/features/Slice/ClientSlice";

const SendContractDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [clientInfo, setClientInfo] = useState(null);

  const { id } = useParams();
  const dispatch = useDispatch();
  const { clients } = useSelector((state) => state.Client);

  useEffect(() => {
    const fetchclients = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/get-all-clients/${id}`);

        if (res.data.success) {
          dispatch(getallclients(res.data.clients || []));
        }
      } catch (error) {
        dispatch(getallclients([]));
      } finally {
        setLoading(false);
      }
    };

    fetchclients();
  }, [id, dispatch]);

  const handleClientSelect = (value) => {
    setSelectedClient(value);
    const found = clients.find((c) => c.id === value);
    setClientInfo(found || null);
  };

  const handleSendContract = async () => {
    if (!selectedClient) {
      return toast.error("Please select a client");
    }

    setLoading(true);

    try {
      const res = await axios.post("/api/contracts/send", {
        clientId: selectedClient,
      });

      if (res.data.success) {
        toast.success("Contract sent successfully");
        setOpen(false);
      } else {
        toast.error("Failed to send contract");
      }
    } catch (error) {
      toast.error("Error sending contract");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 w-full justify-center border-green-500 text-green-600 hover:bg-green-100/40 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/40 transition-all rounded-xl font-medium py-5"
        >
          <Send className="w-4 h-4" />
          Send Contract
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] rounded-2xl p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Send Contract
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select a client and review their details before sending the contract.
          </p>
        </DialogHeader>

        {/* Client Select */}
        <div className="flex flex-col mt-4 space-y-2">
          <Label className="text-sm font-medium">Select Client</Label>
          <Select value={selectedClient} onValueChange={handleClientSelect}>
            <SelectTrigger className="h-11 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm">
              <SelectValue placeholder="Choose client..." />
            </SelectTrigger>
            <SelectContent>
              {clients.length > 0 ? (
                clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.clientName}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled value="none">
                  No clients found
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* 🟦 Client Details Card */}
        {clientInfo && (
          <div className="mt-5 p-4 border rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Client Details
            </h3>

            <div className="mt-3 space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Name:</span> {clientInfo.clientName}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Email:</span> {clientInfo.clientEmail}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Phone:</span> {clientInfo.clientPhone}
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            className="bg-[#5965AB] hover:bg-[#46529A] transition-all text-white mt-6 py-5 rounded-xl w-full"
            onClick={handleSendContract}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Contract"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendContractDialog;
