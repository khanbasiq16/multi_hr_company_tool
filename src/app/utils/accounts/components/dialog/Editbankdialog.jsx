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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Pencil } from "lucide-react";
import { createallBanks } from "@/features/Slice/BankSlice";
import { useRouter } from "next/navigation";

const EditBankDialog = ({ open, setOpen, bankData, setBank }) => {

    const { companies } = useSelector((state) => state.Company);
    const { user } = useSelector((state) => state.User);
    const { curency } = useSelector((state) => state.Curency);
    const router = useRouter();

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

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
            symbol: "$",
        },
        notes: "",
    });

    useEffect(() => {
        if (bankData) {
            setFormData({
                bankTitle: bankData.banktitle || "",
                accountHolderName: bankData.accountHolderName || "",
                accountType: bankData.accountType || "Current",
                branchCode: bankData.branchCode || "",
                iban: bankData.iban || "",
                balance: bankData.balance || "",
                linkedCompany: bankData.linkedCompany || "",
                currency: bankData.currency || { code: "USD", symbol: "$" },
                notes: bankData.notes || "",
            });
        }
    }, [bankData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
            setLoading(true);

            const res = await axios.post(`/api/acounts/banks/update-bank/${bankData.bankid}`, {
                ...formData,
            });

            if (res.data.success) {
                setBank(res.data.bank);
                toast.success(res.data.message);
                setOpen(false);

                router.push(`/accounts/${user?.accountuserName.toLowerCase().replace(/\s+/g, "-")}/bank/${res?.data?.bank?.bankslug}`);
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
                <Button className="bg-[#5965AB] text-white"> <Pencil className="mr-2" /> Edit Bank</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle> Edit Bank</DialogTitle>
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
                            {loading ? "Saving..." : "Update Bank"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditBankDialog;
