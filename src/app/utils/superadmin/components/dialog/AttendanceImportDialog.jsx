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
import { Plus } from "lucide-react";

const AttendanceImportDialog = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);

    const handleImport = async (e) => {
        e.preventDefault();
        if (!file) return toast.error("Please select an Excel file!");

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await axios.post("/api/attendance/import", formData);

            if (res.data.success) {
                toast.success("Attendance Imported Successfully!");
                setOpen(false);
            }
        } catch (err) {
            toast.error(err.response?.data?.error || "Error importing file");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Trigger Button */}
            <DialogTrigger asChild>
                <Button className="bg-[#5965AB] text-white flex items-center gap-2">
                    <Plus size={18} /> Import Attendance
                </Button>
            </DialogTrigger>

            {/* Dialog */}
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Import Attendance</DialogTitle>
                    <p className="text-sm text-gray-500">
                        Upload an Excel sheet (.xls or .xlsx) to import attendance records.
                    </p>
                </DialogHeader>

                <form
                    onSubmit={handleImport}
                    className="mt-4 space-y-6 max-h-[70vh] overflow-y-auto p-2"
                >
                    {/* File Input */}
                    <div className="space-y-2">
                        <Label>Select Excel File</Label>
                        <Input
                            type="file"
                            accept=".xls,.xlsx"
                            required
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            className="bg-[#5965AB] text-white px-6 py-2"
                            disabled={loading}
                        >
                            {loading ? "Uploading..." : "Upload File"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AttendanceImportDialog;
