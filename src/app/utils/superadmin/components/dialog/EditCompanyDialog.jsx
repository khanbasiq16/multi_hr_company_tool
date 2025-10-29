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
} from "@/components/ui/dialog";
import { Eye, EyeClosed, EyeOff } from "lucide-react";

const EditCompanyDialog = ({ company, open, setOpen }) => {
 
    const [formData, setFormData] = useState({
    name: "",
    companyAddress: "",
    companyPhoneNumber: "",
    companyFacebook: "",
    companyLinkedin: "",
    companyInstagram: "",
    companyWebsite: "",
    companyEmail: "",
    companyEmailPassword: "",
    companyEmailHost: "",
    companySmtpHost: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);


  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        companyAddress: company.companyAddress || "",
        companyPhoneNumber: company.companyPhoneNumber || "",
        companyFacebook: company.companyFacebook || "",
        companyLinkedin: company.companyLinkedin || "",
        companyInstagram: company.companyInstagram || "",
        companyWebsite: company.companyWebsite || "",
        companyEmail: company.companyemail || "",
        companyEmailPassword: company.companyemailpassword || "",
        companyEmailHost: company.companyemailhost || "",
        companySmtpHost: company.companysmtphost || "",
      });


      setPreview(company.companyLogo || null);
    }
  }, [company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);

    if (f) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); 
      };
      reader.readAsDataURL(f);
    }
  };

const formHandler = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value ?? "");
    });

    if (file) {
      data.append("file", file);
    }

    console.log("FormData:", data);

    const res = await axios.post(`/api/companies/${company.companyId}`, data);

    if (res.data.success) {
      toast.success("Company updated successfully");
      setOpen(false);
      setFile(null);
      setPreview(null);
      setFormData({}); 
    } else {
      toast.error(res.data.message || "Failed to update company");
    }

  } catch (err) {
    console.error(err);
    toast.error("Failed to update company");
  } finally {
    setLoading(false);
  }
};


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={formHandler}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 p-2 h-84 overflow-y-auto"
        >
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">
                Company Name <span className="text-red-500">*</span>
              </Label>
              <Input
                className="mt-2"
                id="name"
                name="name"
                placeholder="Enter company name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="companyAddress">
                Company Address <span className="text-red-500">*</span>
              </Label>
              <Input
                className="mt-2"
                id="companyAddress"
                name="companyAddress"
                placeholder="Enter company address"
                value={formData.companyAddress}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="companyPhoneNumber">
                Company Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                className="mt-2"
                id="companyPhoneNumber"
                name="companyPhoneNumber"
                placeholder="Enter phone number"
                value={formData.companyPhoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="companyFacebook">Company Facebook Account</Label>
              <Input
                className="mt-2"
                id="companyFacebook"
                name="companyFacebook"
                placeholder="https://www.facebook.com/"
                value={formData.companyFacebook}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="companyLinkedin">Company Linkedin Account</Label>
              <Input
                className="mt-2"
                id="companyLinkedin"
                name="companyLinkedin"
                placeholder="https://www.linkedin.com/"
                value={formData.companyLinkedin}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="companyInstagram">Company Instagram Account</Label>
              <Input
                className="mt-2"
                id="companyInstagram"
                name="companyInstagram"
                placeholder="https://www.instagram.com/"
                value={formData.companyInstagram}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">
                Company Logo <span className="text-red-500">*</span>
              </Label>
              <Input
                type="file"
                className="mt-2"
                id="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {preview && (
                <img
                  src={preview}
                  alt="Company Logo"
                  className="mt-2 w-32 h-32 object-cover rounded-md border"
                />
              )}
            </div>

            <div>
              <Label htmlFor="companyWebsite">
                Company Website <span className="text-red-500">*</span>
              </Label>
              <Input
                className="mt-2"
                id="companyWebsite"
                name="companyWebsite"
                placeholder="https://example.com/"
                value={formData.companyWebsite}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="companyEmail">Company Email</Label>
              <Input
                className="mt-2"
                id="companyEmail"
                name="companyEmail"
                placeholder="Enter Email"
                value={formData.companyEmail}
                onChange={handleChange}
                type={"email"}
              />
            </div>

            <div>
              <Label htmlFor="companyEmailPassword">
                Company Email Password
              </Label>

              <div className="relative mt-2">
                <input
                  id="companyEmailPassword"
                  name="companyEmailPassword"
                  placeholder="Enter Password"
                  value={formData.companyEmailPassword}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-md border px-3 py-2 pr-12" 
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-2 flex items-center px-2 text-sm select-none"
                >
                  {showPassword ? <EyeOff/> : <Eye/>}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="companyEmailHost">Company Email HOST</Label>
              <Input
                className="mt-2"
                id="companyEmailHost"
                name="companyEmailHost"
                placeholder="Enter Email Host"
                value={formData.companyEmailHost}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="companySmtpHost">Company SMTP PORT</Label>
              <Input
                className="mt-2"
                id="companySmtpHost"
                name="companySmtpHost"
                placeholder="Enter SMTP PORT"
                value={formData.companySmtpHost}
                onChange={handleChange}
              />
            </div>
          </div>

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

export default EditCompanyDialog;
