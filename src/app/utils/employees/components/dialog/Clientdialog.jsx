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
import { useDispatch, useSelector } from "react-redux";


const Clientdialog = () => {
    const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const {user} = useSelector((state)=>state.User)

  const dispatch = useDispatch();

  const { id } = useParams();
  const capitalizedCompanyName = id
    ? id.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "";

  const formHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("companyName", id);
      formData.append("clientName", e.target.clientName.value);
      formData.append("clientAddress", e.target.clientAddress.value);
      formData.append("clientEmail", e.target.clientEmail.value);
      formData.append("clientPhone", e.target.clientPhone.value);
      formData.append("projectsDetails", e.target.projectsDetails.value);
      formData.append("packageDetails", e.target.packageDetails.value);
      formData.append("clientWebsite", e.target.clientWebsite.value);
      formData.append("employeeid", user.employeeId);

      const res = await axios.post("/api/employee/create-client", formData, {
        headers: { "Content-Type": "application/json" },
      });

      const data = res.data;

      if (data.success) {
        toast.success("Client Created Successfully");
        e.target.reset();

        dispatch(getallclients(data?.allclients));
        setOpen(false);
      } else {
        toast.error(data.error || "Failed to create client");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error creating client");
    } finally {
      setLoading(false);
    }
  };


  return (
        <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#5965AB] text-white">
          + Create Client
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create New Client</DialogTitle>
          {capitalizedCompanyName && (
            <p className="text-sm text-gray-500 mt-1">
              Company: <span className="font-semibold">{capitalizedCompanyName}</span>
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
      <Input id="clientName" name="clientName" placeholder="Enter client name" required />
    </div>

    <div>
      <Label htmlFor="clientAddress">Address</Label>
      <Input id="clientAddress" name="clientAddress" placeholder="Enter address" required />
    </div>

    <div>
      <Label htmlFor="clientEmail">Email</Label>
      <Input id="clientEmail" name="clientEmail" type="email" placeholder="Enter email" required />
    </div>

  
  </div>

  {/* Right Column */}
  <div className="space-y-4">
    <div>
      <Label htmlFor="clientWebsite">Website</Label>
      <Input id="clientWebsite" name="clientWebsite" placeholder="Enter client website" />
    </div>

      <div>
      <Label htmlFor="clientPhone">Phone Number</Label>
      <Input id="clientPhone" name="clientPhone" placeholder="Enter phone number" required />
    </div>
  </div>

  {/* Full-width description fields */}
  <div className="col-span-2 space-y-4">
    <div>
      <Label htmlFor="projectsDetails">Projects Details</Label>
      <textarea
        id="projectsDetails"
        name="projectsDetails"
        placeholder="Enter project details"
        rows={4}
        className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none"
      />
    </div>

    <div>
      <Label htmlFor="packageDetails">Package Details</Label>
      <textarea
        id="packageDetails"
        name="packageDetails"
        placeholder="Enter package details"
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
      {loading ? "Saving..." : "Save"}
    </Button>
  </DialogFooter>
</form>

      </DialogContent>
    </Dialog>
  )
}

export default Clientdialog