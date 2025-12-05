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
import { useSelector } from "react-redux";

const AttendanceImportDialog = ({ selectedEmployee }) => {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const { employees } = useSelector((state) => state.Employee);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [importStatus, setImportStatus] = useState({
        processed: 0,
        total: 0,
        progress: 0,
        status: "",
    });

    const handleImport = async (e) => {
        e.preventDefault();
        if (!file) return toast.error("Please select an Excel file!");

        setLoading(true);
        setUploadProgress(0);
        setImportStatus({ processed: 0, total: 0, progress: 0, status: "Uploading..." });

        try {

            const filteredEmployee = employees.find(emp => emp.employeeName === selectedEmployee);

            console.log(filteredEmployee);


            const formData = new FormData();
            formData.append("file", file);
            formData.append("employeeId", filteredEmployee.employeeId);

            const response = await axios.post("/api/attendance/import", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percent);
                },
            });

            if (response.data.success) {

                setImportStatus({
                    processed: 100,
                    total: 100,
                    progress: 100,
                    status: "Import Completed",
                });
                toast.success("Attendance imported successfully!");
            } else {
                throw new Error(response.data.error || "Import failed");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Error importing file");
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#5965AB] text-white flex items-center gap-2">
                    <Plus size={18} /> Import Attendance
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Import Attendance</DialogTitle>
                    <p className="text-sm text-gray-500">
                        Upload an Excel file (.xls, .xlsx)
                    </p>
                </DialogHeader>

                <form onSubmit={handleImport} className="space-y-5">
                    <Label>Select Excel File</Label>
                    <Input
                        type="file"
                        accept=".xls,.xlsx"
                        required
                        onChange={(e) => setFile(e.target.files[0])}
                    />

                    {/* Upload Progress */}
                    {loading && (
                        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    )}

                    {/* Import Status */}
                    {loading && importStatus.status && (
                        <div className="text-sm font-semibold text-blue-600">
                            <p>Status: {importStatus.status}</p>
                            {importStatus.total > 0 && (
                                <p>
                                    Progress: {importStatus.processed} / {importStatus.total} (
                                    {importStatus.progress}%)
                                </p>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            disabled={loading}
                            type="submit"
                            className="bg-[#5965AB] text-white w-full"
                        >
                            {loading ? `Uploading ${uploadProgress}%` : "Upload File"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AttendanceImportDialog;
