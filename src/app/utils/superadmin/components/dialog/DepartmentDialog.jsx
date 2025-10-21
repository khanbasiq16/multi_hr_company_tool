"use client";

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
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
import { createdepartment } from "@/features/Slice/DepartmentSlice";

const DepartmentDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  const convertTo12HourFormat = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHour = (hours % 12) || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const formHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);

      if (
        !formData.get("departmentName") ||
        !formData.get("checkInTime") ||
        !formData.get("checkOutTime")
      ) {
        toast.error("Please fill all required fields");
        setLoading(false);
        return;
      }


      const formattedData = {
        departmentName: formData.get("departmentName"),
        description: formData.get("description"),
        checkInTime: convertTo12HourFormat(formData.get("checkInTime")),
        checkOutTime: convertTo12HourFormat(formData.get("checkOutTime")),
        graceTime: formData.get("graceTime")  
      };

      const res = await axios.post("/api/create-department", formattedData, {
        headers: { "Content-Type": "application/json" },
      });

      const data = res.data;

      if (data.success) {
        toast.success("✅ Department Created Successfully");
        dispatch(createdepartment(data.departments))
        e.target.reset();
        setOpen(false);
      } else {
        toast.error(data.error || "Failed to create department");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#5965AB] text-white">+ Create Department</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Department</DialogTitle>
        </DialogHeader>

        <form onSubmit={formHandler} className="space-y-4 mt-2 p-2">
          <div>
            <Label htmlFor="departmentName">
              Department Name <span className="text-red-500">*</span>
            </Label>
            <Input
              className="mt-2"
              id="departmentName"
              name="departmentName"
              placeholder="Enter department name"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              className="mt-2"
              id="description"
              name="description"
              placeholder="Enter description"
            />
          </div>

          <div>
            <Label htmlFor="checkInTime">
              Check In Time <span className="text-red-500">*</span>
            </Label>
            <Input
              type="time"
              className="mt-2"
              id="checkInTime"
              name="checkInTime"
              required
            />
          </div>

          <div>
            <Label htmlFor="checkOutTime">
              Check Out Time <span className="text-red-500">*</span>
            </Label>
            <Input
              type="time"
              className="mt-2"
              id="checkOutTime"
              name="checkOutTime"
              required
            />
          </div>

          <div>
            <Label htmlFor="graceTime">
              Grace Time  <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              className="mt-2"
              id="graceTime"
              name="graceTime"
              placeholder="Enter minutes"
            />
          </div>

          <DialogFooter>
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

export default DepartmentDialog;
