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
import toast from "react-hot-toast";
import axios from "axios";
import { PlusIcon } from "lucide-react";
import { useSelector } from "react-redux";

const AddBalanceDialog = ({ open, setOpen, bank, setBank }) => {

    const { user } = useSelector((state) => state.User);

    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState("");

    const getcurrentip = async () => {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const { ip } = await ipResponse.json();

        return ip;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const ip = await getcurrentip();

            const res = await axios.post("/api/acounts/banks/add-balance", {
                amount,
                bankId: bank?.bankid,
                userid: user?.accountId,
                ip,
            });

            if (res.data.success) {
                toast.success(`${amount} ${bank?.currency?.symbol} has been credited to ${bank?.banktitle}`);
                setBank(res?.data?.bank);
                setOpen(false);
                setAmount("");
            }

        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#5965AB] hover:bg-[#4e589c] text-white font-semibold px-5 rounded-md shadow">
                    <PlusIcon className="w-5 h-5 mr-1" /> Add Balance
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-[600px] rounded-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-800">
                        Add Balance
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid grid-cols-1  gap-5 pt-4">


                    <div>
                        <Label className="font-medium">Amount</Label>
                        <div className="flex mt-1">
                            <span className="px-4 bg-gray-200 text-gray-700 rounded-l-md flex items-center border">
                                {bank?.currency?.symbol}
                            </span>

                            <Input
                                name="amount"
                                type="number"
                                placeholder="Enter Amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="rounded-l-none border-l-0  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <DialogFooter className="col-span-2">
                        <Button className="bg-[#5965AB] hover:bg-[#4e589c] text-white px-6 py-2 rounded-md font-semibold"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Add Balance"}
                        </Button>
                    </DialogFooter>

                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddBalanceDialog;
