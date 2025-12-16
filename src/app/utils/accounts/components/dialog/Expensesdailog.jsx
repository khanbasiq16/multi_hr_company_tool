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

const ExpensesDialog = () => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [formData, setFormData] = useState({
        expenseName: "",
        expenseType: "Variable",
        description: "",
        notifyBeforeDays: "",
    });

    // handle input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // handle expense type
    const handleExpenseType = (value) => {
        setFormData({
            ...formData,
            expenseType: value,
            notifyBeforeDays: value === "Fixed" ? formData.notifyBeforeDays : "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axios.post("/api/expenses/create", formData);
            toast.success("Expense added successfully!");
            setOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.error || "Something went wrong");
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
                    <DialogTitle>Add New Expense</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">

                        {/* Expense Name */}
                        <div className="col-span-2">
                            <Label>Expense Name</Label>
                            <Input
                                name="expenseName"
                                placeholder="e.g. Office Rent, Internet Bill"
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
                                    <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Fixed">Fixed</SelectItem>
                                    <SelectItem value="Variable">Variable</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Notification Days (ONLY for Fixed) */}
                        {formData.expenseType === "Fixed" && (
                            <div>
                                <Label>Notify Before (Days)</Label>
                                <Input
                                    type="number"
                                    name="notifyBeforeDays"
                                    placeholder="e.g. 5"
                                    value={formData.notifyBeforeDays}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        {/* Description */}
                        <div className="col-span-2">
                            <Label>Description</Label>
                            <Textarea
                                name="description"
                                placeholder="Optional description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            className="bg-[#5965AB] text-white"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Add Expense"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ExpensesDialog;
