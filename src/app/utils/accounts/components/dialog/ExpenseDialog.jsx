// "use client";

// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
//     DialogFooter,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import toast from "react-hot-toast";
// import axios from "axios";

// const ExpenseDialog = ({ expensesCategories = [], bankaccounts = [] }) => {
//     const [open, setOpen] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [previews, setPreviews] = useState([]);

//     const [formData, setFormData] = useState({
//         amount: "",
//         categoryId: "",
//         date: "",
//         description: "",
//         paymentMethod: "",
//         bankAccountId: "",
//         files: [],
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSelectChange = (name, value) => {
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//             ...(name === "paymentMethod" && value !== "Bank"
//                 ? { bankAccountId: "" }
//                 : {}),
//         }));
//     };

//     const handleFileChange = (e) => {
//         const files = Array.from(e.target.files);

//         setFormData((prev) => ({
//             ...prev,
//             files,
//         }));

//         const previewUrls = files.map((file) => URL.createObjectURL(file));
//         setPreviews(previewUrls);
//     };

//     const removeImage = (index) => {
//         setFormData((prev) => ({
//             ...prev,
//             files: prev.files.filter((_, i) => i !== index),
//         }));

//         setPreviews((prev) => prev.filter((_, i) => i !== index));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!formData.amount || !formData.categoryId || !formData.date) {
//             return toast.error("Amount, Category & Date are required");
//         }

//         if (formData.paymentMethod === "Bank" && !formData.bankAccountId) {
//             return toast.error("Please select a bank account");
//         }

//         try {
//             setLoading(true);

//             const data = new FormData();

//             Object.entries(formData).forEach(([key, value]) => {
//                 if (key === "files") {
//                     value.forEach((file) => data.append("files", file));
//                 } else {
//                     data.append(key, value);
//                 }
//             });

//             const res = await axios.post("/api/acounts/expenses/create", data, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });

//             if (res.data.success) {
//                 toast.success(res.data.message || "Expense added successfully");
//                 setFormData({
//                     amount: "",
//                     categoryId: "",
//                     date: "",
//                     description: "",
//                     paymentMethod: "",
//                     bankAccountId: "",
//                     files: [],
//                 });
//                 setPreviews([]);
//                 setOpen(false);
//             }

//         } catch (error) {
//             toast.error(error.response?.data?.error || "Something went wrong");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>
//                 <Button className="bg-[#5965AB] text-white">+ Add Expense</Button>
//             </DialogTrigger>

//             <DialogContent className="sm:max-w-[700px]">
//                 <DialogHeader>
//                     <DialogTitle>Add Expense</DialogTitle>
//                 </DialogHeader>

//                 <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 h-[64vh] overflow-y-auto">
//                     {/* Amount */}
//                     <div>
//                         <Label>Amount</Label>
//                         <Input
//                             type="number"
//                             name="amount"
//                             placeholder="e.g. 5000"
//                             value={formData.amount}
//                             onChange={handleChange}
//                         />
//                     </div>

//                     {/* Date */}
//                     <div>
//                         <Label>Date</Label>
//                         <Input type="date" name="date" value={formData.date} onChange={handleChange} />
//                     </div>

//                     {/* Category */}
//                     <div>
//                         <Label>Category</Label>
//                         <Select
//                             value={formData.categoryId}
//                             onValueChange={(value) => handleSelectChange("categoryId", value)}
//                         >
//                             <SelectTrigger>
//                                 <SelectValue placeholder="Select category" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {expensesCategories.map((cat) => (
//                                     <SelectItem key={cat.id} value={cat.id}>
//                                         {cat.expenseCategoryName}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     {/* Payment Method */}
//                     <div>
//                         <Label>Payment Method</Label>
//                         <Select
//                             value={formData.paymentMethod}
//                             onValueChange={(value) => handleSelectChange("paymentMethod", value)}
//                         >
//                             <SelectTrigger>
//                                 <SelectValue placeholder="Optional" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="Cash">Cash</SelectItem>
//                                 <SelectItem value="Bank">Bank Account</SelectItem>
//                                 <SelectItem value="Card">Card</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     {/* Bank Account (Full Width) */}
//                     {formData.paymentMethod === "Bank" && (
//                         <div className="md:col-span-2">
//                             <Label>Bank Account</Label>
//                             <Select
//                                 value={formData.bankAccountId}
//                                 onValueChange={(value) => handleSelectChange("bankAccountId", value)}
//                             >
//                                 <SelectTrigger>
//                                     <SelectValue placeholder="Select bank account" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     {bankaccounts.map((bank) => (
//                                         <SelectItem key={bank.id} value={bank.id}>
//                                             {bank.banktitle} Accounts
//                                         </SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     )}

//                     {/* Description (Full Width) */}
//                     <div className="md:col-span-2">
//                         <Label>Description</Label>
//                         <Textarea
//                             name="description"
//                             placeholder="Optional note (e.g. Internet bill)"
//                             value={formData.description}
//                             onChange={handleChange}
//                         />
//                     </div>

//                     {/* Attachments with Preview */}
//                     <div className="md:col-span-2">
//                         <Label>Attachments</Label>
//                         <Input type="file" multiple accept="image/*" onChange={handleFileChange} />

//                         {previews.length > 0 && (
//                             <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
//                                 {previews.map((src, index) => (
//                                     <div key={index} className="relative border rounded-lg overflow-hidden">
//                                         <img src={src} alt="preview" className="h-28 w-full object-cover" />
//                                         <button
//                                             type="button"
//                                             onClick={() => removeImage(index)}
//                                             className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
//                                         >
//                                             ✕
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     {/* Submit */}
//                     <DialogFooter className="md:col-span-2">
//                         <Button type="submit" disabled={loading} className="bg-[#5965AB] text-white w-full">
//                             {loading ? "Saving..." : "Add Expense"}
//                         </Button>
//                     </DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default ExpenseDialog;



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
import { useSelector } from "react-redux";

const ExpenseDialog = ({ expensesCategories = [], bankaccounts = [] }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [previews, setPreviews] = useState([]);

    const { user } = useSelector((state) => state?.User)

    const [selectedCurrency, setSelectedCurrency] = useState("Rs");

    const [formData, setFormData] = useState({
        amount: "",
        categoryId: "",
        date: "",
        description: "",
        paymentMethod: "",
        bankAccountId: "",
        files: [],
    });

    /* ===================== handlers ===================== */

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "paymentMethod" && value !== "Bank"
                ? { bankAccountId: "" }
                : {}),
        }));

        if (name === "paymentMethod" && value !== "Bank") {
            setSelectedCurrency("Rs");
        }
    };

    const handleBankChange = (bankId) => {
        const bank = bankaccounts.find((b) => b.id === bankId);

        setFormData((prev) => ({
            ...prev,
            bankAccountId: bankId,
        }));

        setSelectedCurrency(bank?.currency?.symbol || "Rs");
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        setFormData((prev) => ({
            ...prev,
            files,
        }));

        const previewUrls = files.map((file) => URL.createObjectURL(file));
        setPreviews(previewUrls);
    };

    const removeImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index),
        }));

        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.amount || !formData.categoryId || !formData.date) {
            return toast.error("Amount, Category & Date are required");
        }

        if (formData.paymentMethod === "Bank" && !formData.bankAccountId) {
            return toast.error("Please select a bank account");
        }

        try {
            setLoading(true);

            const data = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (key === "files") {
                    value.forEach((file) => data.append("files", file));
                } else {
                    data.append(key, value);
                }
            });

            console.log(user?.accountId)

            data.append("userid", user?.accountId);

            const res = await axios.post(
                "/api/acounts/expenses/create",
                data,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (res.data.success) {
                toast.success(res.data.message || "Expense added successfully");

                setFormData({
                    amount: "",
                    categoryId: "",
                    date: "",
                    description: "",
                    paymentMethod: "",
                    bankAccountId: "",
                    files: [],
                });

                setSelectedCurrency("Rs");
                setPreviews([]);
                setOpen(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    /* ===================== UI ===================== */

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#5965AB] text-white">
                    + Add Expense
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Add Expense</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 h-[64vh] overflow-y-auto"
                >
                    {/* Amount with Currency */}
                    <div>
                        <Label>Amount</Label>
                        <div className="flex">
                            <span className="px-3 bg-gray-200 border border-r-0 rounded-l-md flex items-center">
                                {formData.paymentMethod === "Bank"
                                    ? selectedCurrency
                                    : "Rs"}
                            </span>

                            <Input
                                type="number"
                                name="amount"
                                placeholder="e.g. 5000"
                                value={formData.amount}
                                onChange={handleChange}
                                className="rounded-none rounded-r-md
                                [&::-webkit-inner-spin-button]:appearance-none
                                [&::-webkit-outer-spin-button]:appearance-none"
                            />
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <Label>Date</Label>
                        <Input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <Label>Category</Label>
                        <Select
                            value={formData.categoryId}
                            onValueChange={(value) =>
                                handleSelectChange("categoryId", value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {expensesCategories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.expenseCategoryName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <Label>Payment Method</Label>
                        <Select
                            value={formData.paymentMethod}
                            onValueChange={(value) =>
                                handleSelectChange("paymentMethod", value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Optional" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Cash">Cash</SelectItem>
                                <SelectItem value="Bank">Bank Account</SelectItem>
                                <SelectItem value="Card">Card</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Bank Account */}
                    {formData.paymentMethod === "Bank" && (
                        <div className="md:col-span-2">
                            <Label>Bank Account</Label>
                            <Select
                                value={formData.bankAccountId}
                                onValueChange={handleBankChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select bank account" />
                                </SelectTrigger>
                                <SelectContent>
                                    {bankaccounts.map((bank) => (
                                        <SelectItem
                                            key={bank.id}
                                            value={bank.id}
                                        >
                                            {bank.banktitle} Account
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Description */}
                    <div className="md:col-span-2">
                        <Label>Description</Label>
                        <Textarea
                            name="description"
                            placeholder="Optional note"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Attachments */}
                    <div className="md:col-span-2">
                        <Label>Attachments</Label>
                        <Input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                        {previews.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                                {previews.map((src, index) => (
                                    <div
                                        key={index}
                                        className="relative border rounded-lg overflow-hidden"
                                    >
                                        <img
                                            src={src}
                                            alt="preview"
                                            className="h-28 w-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeImage(index)
                                            }
                                            className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <DialogFooter className="md:col-span-2">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-[#5965AB] text-white w-full"
                        >
                            {loading ? "Saving..." : "Add Expense"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ExpenseDialog;
