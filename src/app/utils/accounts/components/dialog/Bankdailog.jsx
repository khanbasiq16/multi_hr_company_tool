


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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { createallBanks } from "@/features/Slice/BankSlice";

const BankDialog = ({ open, setOpen }) => {

    const { companies } = useSelector((state) => state.Company);
    const { user } = useSelector((state) => state.User);
    const { curency } = useSelector((state) => state.Curency);

    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)



    const [formData, setFormData] = useState({
        bankTitle: "",
        accountHolderName: "",
        accountType: "Current",
        branchCode: "",
        iban: "",
        balance: "",
        linkedCompany: "",
        currency: {
            code: "USD",
            symbol: "$"
        },
        notes: "",
    });

    // handle normal input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    // ******** Currency onchange ********
    const handleCurrencySelect = (currencyCode) => {
        const selected = curency.find(c => c.currencyCode === currencyCode);

        setFormData({
            ...formData,
            currency: {
                code: selected.currencyCode,
                symbol: selected.currencySymbol,
                CurencyName: selected.currencyName
            }
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)



            const res = await axios.post("/api/acounts/banks/create", {
                ...formData,
                userid: user?.accountId
            });

            if (res.data.success) {
                dispatch(createallBanks(res.data.banks));
                toast.success("Bank account added successfully!");
                setOpen(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#5965AB] text-white">+ Create Bank</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Add New Bank</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">

                        <div>
                            <Label>Bank Title</Label>
                            <Input name="bankTitle" placeholder="Enter Bank Title" value={formData.bankTitle} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label>Account Holder Name</Label>
                            <Input name="accountHolderName" placeholder="Enter Account Holder Name" value={formData.accountHolderName} onChange={handleChange} required />
                        </div>

                        <div>
                            <Label>Account Type</Label>
                            <Input name="accountType" placeholder="Enter Account Type" value={formData.accountType} onChange={handleChange} required />
                        </div>

                        <div>
                            <Label>Branch Code</Label>
                            <Input name="branchCode" placeholder="Enter Branch Code" value={formData.branchCode} onChange={handleChange} required />
                        </div>

                        <div>
                            <Label>IBAN / Virtual Account #</Label>
                            <Input
                                name="iban"
                                value={formData.iban}
                                onChange={handleChange}
                                placeholder="Enter IBAN / Virtual Account #"
                                required
                            />
                        </div>

                        <div>
                            <Label>Currency</Label>
                            <Select
                                value={formData.currency.code}
                                onValueChange={handleCurrencySelect}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {curency?.map((item) => (
                                        <SelectItem key={item.curencyid} value={item.currencyCode}>
                                            {item.currencyCode}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Initial Balance</Label>
                            <div className="flex">
                                <span className="px-3 bg-gray-200 border border-r-0 rounded-l-md flex items-center">
                                    {formData.currency.symbol}
                                </span>

                                <Input name="balance" type="number"
                                    className="rounded-none rounded-r-md  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    placeholder="Enter Balance"
                                    value={formData.balance}
                                    onChange={handleChange} required />
                            </div>
                        </div>

                        <div>
                            <Label>Linked Company</Label>
                            <Select value={formData.linkedCompany}
                                onValueChange={(value) => setFormData({ ...formData, linkedCompany: value })}>
                                <SelectTrigger><SelectValue placeholder="Select Company" /></SelectTrigger>
                                <SelectContent>
                                    {companies?.length > 0 ?
                                        companies.map((c) => <SelectItem key={c.companyId} value={c.companyId}>{c.name}</SelectItem>)
                                        : <SelectItem disabled>No Companies Found</SelectItem>}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="col-span-2">
                            <Label>Notes</Label>
                            <Textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Optional remarks" />
                        </div>

                    </div>

                    <DialogFooter>
                        <Button type="submit" className="bg-[#5965AB] text-white" disabled={loading}>
                            {loading ? "Saving..." : "Add Bank"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default BankDialog;
