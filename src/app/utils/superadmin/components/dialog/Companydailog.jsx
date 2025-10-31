
"use client";

import axios from "axios";
import toast from "react-hot-toast";
import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { createcompany } from "@/features/Slice/CompanySlice";

const CompanyDialog = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [timeZones, setTimeZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");
  const dispatch = useDispatch();

  const {timeZone} = useSelector((state)=>state.TimeZone)

  // ✅ File preview
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
      const formData = new FormData(e.target);
      if (file) formData.append("file", file);
      if (selectedZone) formData.append("timezone", selectedZone);

      const res = await axios.post("/api/create-company", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = res.data;

      if (data.success) {
        toast.success("Company Created Successfully");
        e.target.reset();
        setFile(null);
        setPreview(null);
        setSelectedZone("");
        dispatch(createcompany(data.companies));
      } else {
        toast.error(data.message || "Failed to create company");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
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
              <Label htmlFor="name">Company Name *</Label>
              <Input className="mt-2" id="name" name="name" 
              placeholder="ABC Name"
              required />
            </div>

            <div>
              <Label htmlFor="companyAddress">Company Address *</Label>
              <Input
                className="mt-2"
                id="companyAddress"
                name="companyAddress"
                placeholder="ABC Street 123"
                required
              />
            </div>

            <div>
              <Label htmlFor="companyPhoneNumber">Company Phone *</Label>
              <Input
                className="mt-2"
                id="companyPhoneNumber"
                name="companyPhoneNumber"
                placeholder="+92 xxx-xxxx-xxx"
                required
              />
            </div>

            <div>
              <Label htmlFor="companyFacebook">Company Facebook</Label>
              <Input
                className="mt-2"
                id="companyFacebook"
                name="companyFacebook"
                placeholder="https://www.facebook.com/"
              />
            </div>

            <div>
              <Label htmlFor="companyLinkedin">Company Linkedin</Label>
              <Input
                className="mt-2"
                id="companyLinkedin"
                name="companyLinkedin"
                placeholder="https://www.linkedin.com/"
              />
            </div>

            <div>
              <Label htmlFor="companyInstagram">Company Instagram</Label>
              <Input
                className="mt-2"
                id="companyInstagram"
                name="companyInstagram"
                placeholder="https://www.instagram.com/"
              />
            </div>

            <div>
              <Label>Company Time Zone</Label>
             
                <Select
                  onValueChange={(val) => setSelectedZone(val)}
                  value={selectedZone}
                >
                  <SelectTrigger className="mt-2 w-full">
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {timeZone.map((zone) => (
                      <SelectItem key={zone} value={zone}>
                        {zone.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">Company Logo *</Label>
              <Input
                type="file"
                className="mt-2"
                id="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-2 w-24 h-24 object-cover rounded-md border"
                />
              )}
            </div>

            <div>
              <Label htmlFor="companyWebsite">Company Website *</Label>
              <Input
                className="mt-2"
                id="companyWebsite"
                name="companywebsite"
                placeholder="https://example.com/"
                required
              />
            </div>

            <div>
              <Label htmlFor="companyEmail">Company Email</Label>
              <Input
                className="mt-2"
                id="companyEmail"
                name="companyemail"
                type="email"
              />
            </div>

            <div>
              <Label htmlFor="companyEmailPassword">Company Email Password</Label>
              <Input
                className="mt-2"
                id="companyEmailPassword"
                name="companyemailpassword"
                type="password"
              />
            </div>

            <div>
              <Label htmlFor="companyEmailHost">Company Email HOST</Label>
              <Input
                className="mt-2"
                id="companyEmailHost"
                name="companyemailhost"
              />
            </div>

            <div>
              <Label htmlFor="companySmtpHost">Company SMTP PORT</Label>
              <Input
                className="mt-2"
                id="companySmtpHost"
                name="companysmtphost"
              />
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="col-span-2 flex justify-end gap-3 mt-4">
            <Button
              type="submit"
              className="bg-[#5965AB] text-white"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyDialog;
