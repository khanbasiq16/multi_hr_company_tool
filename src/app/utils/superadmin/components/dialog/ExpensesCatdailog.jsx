"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import axios from "axios";

const ExpensesCatdailog = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        expenseName: "",
        expenseType: "Variable",
        description: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleExpenseType = (value) => {
        setFormData({ ...formData, expenseType: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.expenseName || !formData.expenseType) {
            return toast.error("Expense name & type are required");
        }

        try {
            setLoading(true);

            const res = await axios.post("/api/acounts/expenses/create-category", {
                expenseCategoryName: formData.expenseName,
                expenseCategoryType: formData.expenseType,
                expenseCategoryDescription: formData.description,
            });



            if (res.data.success) {
                toast.success(res.data.message);

                setFormData({
                    expenseName: "",
                    expenseType: "Variable",
                    description: "",
                });
                setOpen(false);
            }



            // setOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#5965AB] text-white">
                    + Add Expense Category
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add Expense Category</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {/* Expense Name */}
                    <div>
                        <Label>Expense Category Name</Label>
                        <Input
                            name="expenseName"
                            placeholder="e.g. Office Rent"
                            value={formData.expenseName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Expense Type */}
                    <div>
                        <Label>Expense Type</Label>
                        <Select
                            value={formData.expenseType}
                            onValueChange={handleExpenseType}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Fixed">Fixed</SelectItem>
                                <SelectItem value="Variable">Variable</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Description */}
                    <div>
                        <Label>Description</Label>
                        <Textarea
                            name="description"
                            placeholder="Optional description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-[#5965AB] text-white"
                        >
                            {loading ? "Saving..." : "Add Expense"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ExpensesCatdailog;
