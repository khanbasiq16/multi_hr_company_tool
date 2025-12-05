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
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { createAccountants } from "@/features/Slice/AccountantSlice";

import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";

import { Eye, EyeOff, RefreshCcw } from "lucide-react"; // ✅ Icons
import axios from "axios";

const AccountDialog = () => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    const dispatch = useDispatch();

    // Password validation
    const validatePassword = (value) => {
        if (value.length < 6) {
            setPasswordError("Password must be at least 6 characters");
        } else if (!/\d/.test(value)) {
            setPasswordError("Password must contain at least one number");
        } else {
            setPasswordError("");
        }
    };

    // Generate random password
    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
        let newPassword = "";
        for (let i = 0; i < 10; i++) {
            newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        setPassword(newPassword);
        validatePassword(newPassword);
        toast.success("Password generated!");
    };

    const formHandler = async (e) => {
        e.preventDefault();
        if (passwordError) {
            toast.error(passwordError);
            return;
        }

        setLoading(true);

        try {
            const formData = {
                accountuserName: e.target.accountuserName.value,
                accountuseremail: e.target.accountEmail.value,
                accountuserphone: e.target.accountPhone.value,
                accountuseraddress: e.target.accountAddress.value,
                accountuserpassword: password,
            };

            const res = await axios.post("/api/acounts/create-acountant", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const allAccounts = res.data.accounts;

            if (res.data.success) {
                setLoading(false);
                toast.success("Account created successfully!");
                dispatch(createAccountants(allAccounts));
            }
            e.target.reset();
            setPassword("");
            setOpen(false);
        } catch (error) {
            console.error("Error creating account:", error);
            let message = "Something went wrong";
            if (error.code === "auth/email-already-in-use") message = "Email is already in use";
            else if (error.code === "auth/invalid-email") message = "Invalid email";
            else if (error.code === "auth/weak-password") message = "Password is too weak";
            setLoading(false);
            toast.error(message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#5965AB] text-white hover:bg-[#4752a3] transition-colors duration-300">
                    + Create Accountant User
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Create Accountant User</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={formHandler}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 max-h-[80vh] overflow-y-auto p-2"
                >
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="accountuserName">Accountant Name <span className="text-red-500">*</span></Label>
                            <Input
                                id="accountuserName"
                                name="accountuserName"
                                className="rounded-md"
                                placeholder="Enter account name"
                                type="text"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="accountEmail">Email <span className="text-red-500">*</span></Label>
                            <Input
                                id="accountEmail"
                                name="accountEmail"
                                type="email"
                                placeholder="Enter email"
                                required
                                className="rounded-md"
                            />
                        </div>



                        <div>
                            <Label htmlFor="employeepassword">
                                Password <span className="text-red-500">*</span>
                            </Label>

                            <div className="relative mt-1">
                                <Input
                                    id="employeepassword"
                                    name="employeepassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        validatePassword(e.target.value);
                                    }}
                                    required
                                    className="w-full pr-28 rounded-md"
                                />

                                {/* Show/Hide */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-1/2 right-10 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>

                                {/* Generate */}
                                <button
                                    type="button"
                                    onClick={generatePassword}
                                    className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                                >
                                    <RefreshCcw size={20} />
                                </button>
                            </div>

                            {passwordError && (
                                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="accountAddress">Address <span className="text-red-500">*</span></Label>
                            <Input
                                id="accountAddress"
                                name="accountAddress"
                                placeholder="Enter address"
                                className="rounded-md"
                            />
                        </div>
                        <div>
                            <Label htmlFor="accountPhone">Phone Number <span className="text-red-500">*</span></Label>
                            <Input
                                id="accountPhone"
                                name="accountPhone"
                                placeholder="Enter phone number"
                                className="rounded-md"
                                type="number"
                            />
                        </div>
                    </div>

                    <DialogFooter className="col-span-2 flex justify-end mt-2">
                        <Button
                            type="submit"
                            className="bg-[#5965AB] text-white font-semibold px-6 py-2 hover:bg-[#4752a3] transition-colors duration-300"
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
