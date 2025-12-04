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
import { useDispatch } from "react-redux";
import { createAccountants } from "@/features/Slice/AccountantSlice";

const AccountDialog = () => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const dispatch = useDispatch();

    const formHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("accountuserName", e.target.accountuserName.value);
            formData.append("accountEmail", e.target.accountEmail.value);
            formData.append("accountPhone", e.target.accountPhone.value);
            formData.append("accountAddress", e.target.accountAddress.value);

            const res = await axios.post("/api/acounts/create-acountant", formData, {
                headers: { "Content-Type": "application/json" },
            });

            const data = res.data;

            if (data.success) {
                toast.success("Account Created Successfully");
                e.target.reset();

                dispatch(createAccountants(data?.allAccounts));
                setOpen(false);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#5965AB] text-white">+ Create Accountant User</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Create Account</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={formHandler}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 max-h-[80vh] overflow-y-auto p-2"
                >
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="accountName">Accountant Name</Label>
                            <Input id="accountuserName" name="accountuserName" placeholder="Enter account name" required />
                        </div>

                        <div>
                            <Label htmlFor="accountEmail">Email</Label>
                            <Input id="accountEmail" name="accountEmail" type="email" placeholder="Enter email" required />
                        </div>

                        <div>
                            <Label htmlFor="accountAddress">Address</Label>
                            <Input id="accountAddress" name="accountAddress" placeholder="Enter address" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="accountPhone">Phone Number</Label>
                            <Input id="accountPhone" name="accountPhone" placeholder="Enter phone number" />
                        </div>


                    </div>

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
    );
};

export default AccountDialog;
