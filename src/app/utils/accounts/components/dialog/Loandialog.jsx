"use client";
import React, { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { bankdetails } from "@/features/Slice/BankSlice";

const Loandialog = ({ bank, setBank }) => {

    const { banks } = useSelector((state) => state.Banks);
    const { user } = useSelector((state) => state.User);

    const [open, setOpen] = useState(false);
    const [toBank, setToBank] = useState("");
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    // Remove current bank from list
    const filteredBanks = banks?.filter((b) => b.bankid !== bank?.bankid);

    useEffect(() => {
        if (open) {
            setToBank("");
            setAmount("");
            setNote("");
        }
    }, [open]);

    const getcurrentip = async () => {
        const res = await fetch("https://api.ipify.org?format=json");
        return (await res.json()).ip;
    };

    const handleLoan = async (e) => {
        e.preventDefault();

        if (!toBank) return toast.error("Please select a bank to request loan from!");

        try {
            setLoading(true);

            const res = await axios.post("/api/acounts/banks/loan", {
                fromBank: bank?.bankid,
                toBank: toBank,
                amount,
                note,
                userId: user?.accountId,
                ip: await getcurrentip(),
            });

            if (res.data.success) {
                toast.success("Loan Request Sent Successfully");
                setBank(res.data.bank);
                setOpen(false);
            }

        } catch (error) {
            toast.error(error.response?.data?.error || "Loan Request Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#5965AB] hover:bg-[#4e589c] text-white font-semibold px-5 rounded-md shadow">
                    Request Loan
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-[600px] rounded-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-800">
                        Request Loan
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleLoan} className="grid grid-cols-1 gap-5 pt-4">

                    {/* FROM ACCOUNT */}
                    <div>
                        <Label className="font-medium mb-2">From Account (Your Bank Account)</Label>
                        <div className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-700 font-semibold">
                            {bank?.banktitle}
                        </div>
                    </div>

                    {/* TO ACCOUNT (SELECT) */}
                    <div>
                        <Label className="font-medium mb-2">Request Loan From</Label>
                        <Select value={toBank} onValueChange={setToBank} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select bank to request loan" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredBanks?.map((b) => (
                                    <SelectItem key={b.bankid} value={b.bankid}>
                                        {b.banktitle}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* LOAN AMOUNT */}
                    <div>
                        <Label className="font-medium">Loan Amount</Label>
                        <div className="flex mt-1">
                            <span className="px-4 bg-gray-200 text-gray-700 rounded-l-md flex items-center border">
                                {bank?.currency?.symbol}
                            </span>
                            <Input
                                type="number"
                                placeholder="Enter Amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                className="rounded-l-none border-l-0"
                            />
                        </div>
                    </div>

                    {/* REASON */}
                    <div>
                        <Label className="font-medium mb-2">Note (Optional)</Label>
                        <Textarea
                            placeholder="Reason for the loan..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full min-h-[90px] border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#5965AB] resize-none"
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-[#5965AB] hover:bg-[#4e589c] text-white px-6 py-2 rounded-md font-semibold"
                        >
                            {loading ? "Processing..." : "Submit Loan Request"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default Loandialog;
