"use client";

import axios from "axios";
import toast from "react-hot-toast";
import React, { useState } from 'react'
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
import { useDispatch } from "react-redux";
import { createcompany } from "@/features/Slice/CompanySlice";

const Companydailog = () => {

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile)); 
    } else {
      setPreview(null);
    }
  };

  const formHandler = async (e) => {
    e.preventDefault();
    setLoading(true);



    try {

      if(!e.target.name.value || !e.target.companyPhoneNumber.value || !e.target.companyAddress.value || !e.target.companywebsite.value){
        toast.error("All fields is required");
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append("name", e.target.name.value);
      formData.append("companyAddress", e.target.companyAddress.value);
      formData.append("companyPhoneNumber", e.target.companyPhoneNumber.value);
      formData.append("companywebsite", e.target.companywebsite.value);
      if (file) formData.append("file", file);

      const res = await axios.post("/api/create-company", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data;

      if (data.success) {
        toast.success("Company Created Successfully");
        e.target.reset();
        setFile(null);
        setPreview(null);
        dispatch(createcompany(data.companies));

        
      } else {
        alert("❌ " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error creating company");
    } finally {
      setLoading(false);
      setOpen(false); 
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#5965AB] text-white">+ Create Company</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Company</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={formHandler}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 p-2 h-84 overflow-y-auto"
        >
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Company Name</Label>
              <Input className="mt-2" id="name" name="name" placeholder="Enter company name" required />
            </div>

            <div>
              <Label htmlFor="companyAddress">Company Address</Label>
              <Input className="mt-2" id="companyAddress" name="companyAddress" placeholder="Enter company address" required/>
            </div>

            <div>
              <Label htmlFor="companyPhoneNumber">Company Phone</Label>
              <Input className="mt-2" id="companyPhoneNumber" name="companyPhoneNumber" placeholder="Enter phone number" required/>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">Company Logo</Label>
              <Input
                type="file"
                className="mt-2"
                id="file"
                accept="image/*"
                onChange={handleFileChange}
              />

              {/* ✅ Image Preview */}
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-2 w-24 h-24 object-cover rounded-md border"
                />
              )}
            </div>


            
            <div>
              <Label htmlFor="companyWebsite">Company Website</Label>
              <Input className="mt-2" id="companyWebsite" name="companywebsite" placeholder="https://example.com/" required/>
            </div>

          
          </div>

          <DialogFooter className="col-span-2 flex justify-end gap-3 mt-4">
            <Button type="submit" className="bg-[#5965AB] text-white" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default Companydailog