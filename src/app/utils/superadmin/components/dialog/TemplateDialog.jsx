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
import { useDispatch } from "react-redux";
import { createtemplate } from "@/features/Slice/TemplateSlice";

const TemplateDialog = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("Employee");
  const [company, setCompany] = useState("");
  const [allCompanies, setAllCompanies] = useState([]);
  const dispatch = useDispatch()


  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("/api/get-all-companies");
        if (res.data.success) {

          console.log(res.data.companies)
          setAllCompanies(res.data.companies);
          setCompany(res.data.companies[0].name)
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  // 🔹 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = { role, company };

      const res = await axios.post("/api/templates/create", formData);

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(createtemplate(res.data.templates))

        setOpen(false);
        setRole("");
        setCompany("");

      } else {
        toast.error("Failed to create template");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error creating template");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#5965AB] text-white">+ Create Template</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Design Template</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 p-2">
          {/* Role Select */}
          <div className="flex flex-col space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Select Template Type
            </Label>
            <Select value={role} onValueChange={setRole} required>
              <SelectTrigger className="w-full h-11 border border-gray-300 rounded-lg focus:ring-2 ">
                <SelectValue placeholder="Select role..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Employee">Employee Letters</SelectItem>
                <SelectItem value="Admin">Contracts</SelectItem>
              </SelectContent>
            </Select>
          </div>


          {role === "Admin" && (
            <div className="flex flex-col space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Select Company
              </Label>
              <Select value={company} onValueChange={setCompany} required>
                <SelectTrigger className="w-full h-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5965AB]">
                  <SelectValue placeholder="Select company..." />
                </SelectTrigger>
                <SelectContent>
                  {allCompanies.length > 0 ? (
                    allCompanies.map((c, i) => (
                      <SelectItem key={i} value={c.companyId}>
                        {c.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="no-company">
                      No companies found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button
              type="submit"
              className="bg-[#5965AB] text-white"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Template"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateDialog;
