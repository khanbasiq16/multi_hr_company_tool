"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { getallclients } from "@/features/Slice/ClientSlice";
import { useDispatch } from "react-redux";
import { Pencil } from "lucide-react";

const EditClient = ({ client  , setClient}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

 
  const { id } = useParams();

  const capitalizedCompanyName = id
    ? id.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "";

  // ✅ Pre-fill client data
  const [formData, setFormData] = useState({
    clientName: client?.clientName || "",
    clientAddress: client?.clientAddress || "",
    clientEmail: client?.clientEmail || "",
    clientPhone: client?.clientPhone || "",
    projectsDetails: client?.projectsDetails || "",
    packageDetails: client?.packageDetails || "",
    clientWebsite: client?.clientWebsite || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const formHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`/api/update-client/${client?.id}`, {
        companyName: id,
        ...formData,
      });

      const data = res.data;

      if (data.success) {
        toast.success("Client Updated Successfully ✅");
        setClient(data.client)
        setOpen(false);
      } else {
        toast.error(data.error || "Failed to update client ❌");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating client ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#5965AB] text-white"><Pencil /> Edit Client</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Edit Client Details</DialogTitle>
          {capitalizedCompanyName && (
            <p className="text-sm text-gray-500 mt-1">
              Company:{" "}
              <span className="font-semibold">{capitalizedCompanyName}</span>
            </p>
          )}
        </DialogHeader>

        <form
          onSubmit={formHandler}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 max-h-[80vh] overflow-y-auto p-2"
        >
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="clientAddress">Address</Label>
              <Input
                id="clientAddress"
                name="clientAddress"
                value={formData.clientAddress}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="clientEmail">Email</Label>
              <Input
                id="clientEmail"
                name="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="clientWebsite">Website</Label>
              <Input
                id="clientWebsite"
                name="clientWebsite"
                value={formData.clientWebsite}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="clientPhone">Phone Number</Label>
              <Input
                id="clientPhone"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Full-width Fields */}
          <div className="col-span-2 space-y-4">
            <div>
              <Label htmlFor="projectsDetails">Projects Details</Label>
              <textarea
                id="projectsDetails"
                name="projectsDetails"
                value={formData.projectsDetails}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none"
              />
            </div>

            <div>
              <Label htmlFor="packageDetails">Package Details</Label>
              <textarea
                id="packageDetails"
                name="packageDetails"
                value={formData.packageDetails}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <DialogFooter className="col-span-2 flex justify-end mt-2">
            <Button
              type="submit"
              className="bg-[#5965AB] text-white font-semibold px-6 py-2"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClient;
