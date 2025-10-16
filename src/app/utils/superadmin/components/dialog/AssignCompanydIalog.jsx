"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import axios from "axios";

const AssignCompanyDialog = ({
  open,
  setOpen,
  assigncompanies,
  employeeId,
}) => {
  const { companies } = useSelector((state) => state.Company);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log(employeeId)
  
  useEffect(() => {
    if (open && Array.isArray(assigncompanies)) {
      const ids = assigncompanies.map((c) => c.id || c._id);
      setSelected(ids);
    }
  }, [assigncompanies, open]);

  const toggleCompany = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

 const handleSubmit = async () => {
  try {
    setLoading(true);

    const res = await axios.post("/api/assign-companies", {
      employeeId,
      companyIds: selected,
    });

    if (res.data.success) {
      toast.success(res.data.message);
      setLoading(false);
      window.location.reload();
    } else {
      setLoading(false);
    }
  } catch (error) {
    console.error("Error updating companies:", error);
    setLoading(false);
  }
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Companies</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-72 overflow-y-auto">
          {companies?.length > 0 ? (
            companies.map((comp) => {
              const compId = comp.id || comp._id;
              return (
                <div key={compId} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selected.includes(compId)}
                    onCheckedChange={() => toggleCompany(compId)}
                  />
                  <span>{comp.companyName || comp.name}</span>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500">No companies found</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{loading ? "...Assign Company" : "Submit"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignCompanyDialog;
