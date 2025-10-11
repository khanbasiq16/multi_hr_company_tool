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
import { getallexpense } from "@/features/Slice/ExpenseSlice";
import { useDispatch } from "react-redux";

const Expensedailog = () => {
    const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatach = useDispatch();

   const formHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("expenseName", e.target.expenseName.value);
      formData.append("price", e.target.price.value);
      formData.append("description", e.target.description.value);
      formData.append("attachment", e.target.attachment.files[0]);

      const res = await axios.post("/api/create-expense", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Expense Created Successfully");
        e.target.reset();
        dispatach(getallexpense(res.data?.expenses));
        
      } else {
        toast.error("Failed to create expense");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error creating expense");
    } finally {
      setLoading(false);
    }
  };

  return (
   <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#5965AB] text-white">+ Add Expense</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Employee Expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={formHandler} className="space-y-4 mt-4 p-2 max-h-[75vh] overflow-y-auto">
          <div>
            <Label htmlFor="expenseName">Expense Name</Label>
            <Input id="expenseName" name="expenseName" placeholder="Enter expense name" required />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input id="price" name="price" type="number" placeholder="Enter price" required />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter description"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none"
            />
          </div>

          <div>
            <Label htmlFor="attachment">Attachment (PDF / Image)</Label>
            <Input
              id="attachment"
              name="attachment"
              type="file"
              accept="image/*,.pdf"
              required
            />
          </div>

          <DialogFooter className="flex justify-end">
            <Button
              type="submit"
              className="bg-[#5965AB] text-white font-semibold px-6 py-2"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default Expensedailog