"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowRightLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch } from "react-redux";

const TransferDialog = ({ bank, setBank }) => {

    const { user } = useSelector((state) => state.User);
    const { banks } = useSelector((state) => state.Banks);

    const dispatch = useDispatch();

    // From bank auto set hoga (no need select dropdown)
    const [fromBank, setFromBank] = useState(bank?.bankid);
    const [toBank, setToBank] = useState("");
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [ open , setOpen] = useState(false);



    const filteredBanks = banks?.filter((b) => b.bankid !== bank?.bankid);

    useEffect(() => {
        if (open) {
            setFromBank(bank?.bankid);
            setToBank("");
            setAmount("");
            setNote("");
        }
    }, [open, bank]);

    const getcurrentip = async () => {
        const res = await fetch("https://api.ipify.org?format=json");
        return (await res.json()).ip;
    };

    const handleTransfer = async (e) => {
        e.preventDefault();

        if (fromBank === toBank) return toast.error("Sender & Receiver bank cannot be same");

        try {
            setLoading(true);

            if (amount > bank?.balance) return toast.error("Insufficient balance");

            const res = await axios.post("/api/acounts/banks/transfer", {
                fromBank,
                toBank,
                amount,
                userId: user?.accountId,
                ip: await getcurrentip(),
                note,
            });

            if (res.data.success) {
                toast.success(res?.data?.message);
                setBank(res?.data?.bank);
                setOpen(false);
            }

        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.error || "Transfer Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#5965AB] hover:bg-[#4e589c] text-white font-semibold px-5 rounded-md shadow">
                    <ArrowRightLeft className="w-5 h-5 mr-1" /> Transfer Amount
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-[600px] rounded-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-800">Transfer Amount</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleTransfer} className="grid grid-cols-1 gap-5 pt-4">


                    <div>
                        <Label className="font-medium mb-2">From Account</Label>
                        <div className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-700 font-semibold">
                            {bank?.banktitle}
                        </div>
                    </div>


                    <div>
                        <Label className="font-medium mb-2">To Account</Label>
                        <Select onValueChange={setToBank} value={toBank} required>
                            <SelectTrigger><SelectValue placeholder="Select receiver bank" /></SelectTrigger>
                            <SelectContent>
                                {filteredBanks?.map((b) => (
                                    <SelectItem key={b.bankid} value={b.bankid}>
                                        {b.banktitle}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* AMOUNT */}
                    <div>
                        <Label className="font-medium">Amount</Label>
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


                    <div>
                        <Label className="font-medium mb-2">Note (Optional)</Label>
                        <Textarea
                            placeholder="Write note..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full min-h-[90px] border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#5965AB] resize-none"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="bg-[#5965AB] hover:bg-[#4e589c] text-white px-6 py-2 rounded-md font-semibold">
                            {loading ? "Processing..." : "Transfer Now"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default TransferDialog;
