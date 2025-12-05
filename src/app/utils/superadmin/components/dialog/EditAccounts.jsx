// "use client";
// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogFooter,
//     DialogTrigger,
// } from "@/components/ui/dialog";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Pencil } from "lucide-react";

// const EditAccounts = ({ accounts, setAccounts }) => {
//     const [open, setOpen] = useState(false);
//     const [loading, setLoading] = useState(false);


//     // Pre-filled form
//     const [formData, setFormData] = useState({
//         accountuserName: accounts?.accountuserName || "",
//         accountuseraddress: accounts?.accountuseraddress || "",
//         accountuseremail: accounts?.accountuseremail || "",
//         accountuserphone: accounts?.accountuserphone || "",
//     });

//     // Input handler
//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     // Update Handler
//     const updateHandler = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             const res = await axios.post(`/api/acounts/update-account/${accounts?.accountId}`, formData);
//             const data = res.data;

//             if (data.success) {
//                 toast.success("Account Updated Successfully 🚀");
//                 setAccounts(data.account);
//                 setOpen(false);
//             } else toast.error(data.error || "Failed to update ❌");
//         } catch (error) {
//             console.log(error);
//             toast.error("Update Failed ❌");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>
//                 <Button className="bg-[#5965AB] text-white flex items-center gap-2">
//                     <Pencil size={18} /> Edit Account
//                 </Button>
//             </DialogTrigger>

//             <DialogContent className="sm:max-w-[700px]">
//                 <DialogHeader>
//                     <DialogTitle className="text-lg font-semibold">Edit Accountant Details</DialogTitle>
//                 </DialogHeader>

//                 <form
//                     onSubmit={updateHandler}
//                     className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 max-h-[80vh] overflow-y-auto p-2"
//                 >
//                     {/* Column Left */}
//                     <div className="space-y-4">
//                         <div>
//                             <Label>Accountant User Name</Label>
//                             <Input
//                                 name="accountName"
//                                 value={formData.accountuserName}
//                                 onChange={handleChange}
//                                 type="text"
//                                 required
//                             />
//                         </div>



//                         <div>
//                             <Label>Accountant User Email</Label>
//                             <Input
//                                 name="accountuseremail"
//                                 value={formData.accountuseremail}
//                                 type="email"
//                                 onChange={handleChange}
//                             />
//                         </div>
//                     </div>

//                     {/* Column Right */}
//                     <div className="space-y-4">

//                         <div>
//                             <Label>Accountant User Address </Label>
//                             <Input
//                                 name="accountuseraddress"
//                                 value={formData.accountuseraddress}
//                                 onChange={handleChange}
//                                 type="text"
//                                 placeholder="Cash, Bank, Expense etc."
//                             />
//                         </div> <div>
//                             <Label>Accountant User Phone </Label>
//                             <Input
//                                 name="accountuserphone"
//                                 value={formData.accountuserphone}
//                                 onChange={handleChange}
//                                 type="text"
//                                 placeholder="Cash, Bank, Expense etc."
//                             />
//                         </div>
//                     </div>

//                     {/* Notes */}


//                     <DialogFooter className="col-span-2 flex justify-end">
//                         <Button
//                             type="submit"
//                             className="bg-[#5965AB] text-white px-6"
//                             disabled={loading}
//                         >
//                             {loading ? "Updating..." : "Update Account"}
//                         </Button>
//                     </DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default EditAccounts;


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
import { Pencil } from "lucide-react";

const EditAccounts = ({ accounts, setAccounts }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Prefilled State
    const [formData, setFormData] = useState({
        accountuserName: accounts?.accountuserName || "",
        accountuseraddress: accounts?.accountuseraddress || "",
        accountuseremail: accounts?.accountuseremail || "",
        accountuserphone: accounts?.accountuserphone || "",
    });

    // Input Catcher
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Update Handler
    const updateHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post(`/api/acounts/update-account/${accounts?.accountId}`, formData);
            const data = res.data;

            if (data.success) {
                toast.success("Account Updated Successfully 🚀");
                setAccounts(data.accounts);
                setOpen(false);
            } else toast.error(data.error || "Failed to update ❌");
        } catch (error) {
            console.log(error);
            toast.error("Update Failed ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#5965AB] hover:bg-[#47519a] text-white flex items-center gap-2">
                    <Pencil size={17} /> Edit Account
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[700px] space-y-4">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-800">
                        Edit Accountant Details
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={updateHandler}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[75vh] overflow-auto px-1"
                >
                    {/* Left Column */}
                    <div className="space-y-4">
                        <div>
                            <Label className="font-medium">Accountant Name</Label>
                            <Input
                                name="accountuserName"
                                value={formData.accountuserName}
                                onChange={handleChange}
                                type="text"
                                placeholder="Enter full name"
                                required
                            />
                        </div>

                        <div>
                            <Label className="font-medium">Accountant Email</Label>
                            <Input
                                name="accountuseremail"
                                value={formData.accountuseremail}
                                onChange={handleChange}
                                type="email"
                                placeholder="example@gmail.com"
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        <div>
                            <Label className="font-medium">Address</Label>
                            <Input
                                name="accountuseraddress"
                                value={formData.accountuseraddress}
                                onChange={handleChange}
                                type="text"
                                placeholder="City, Country"
                            />
                        </div>

                        <div>
                            <Label className="font-medium">Phone</Label>
                            <Input
                                name="accountuserphone"
                                value={formData.accountuserphone}
                                onChange={handleChange}
                                type="text"
                                placeholder="+92 XXX XXXXXXX"
                            />
                        </div>
                    </div>

                    <DialogFooter className="col-span-2 flex justify-end pt-2">
                        <Button
                            type="submit"
                            className="bg-[#5965AB] hover:bg-[#47519a] text-white px-6"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Account"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditAccounts;
