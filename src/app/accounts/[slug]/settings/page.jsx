"use client";

import React, { useEffect, useState } from "react";
import Accountslayout from "@/app/utils/accounts/layout/Accountslayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import axios from "axios";
import toast from "react-hot-toast";

/* ================= DEFAULT FORM ================= */
const emptyForm = {
    currenyName: "",
    currencyCode: "",
    currencySymbol: "",
    Curencyrate: "",
};

export default function Page() {
    /* ================= STATE ================= */
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(false);

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const [currencyForm, setCurrencyForm] = useState(emptyForm);
    const [editId, setEditId] = useState(null);

    /* ================= FETCH ================= */
    const getCurrencies = async () => {
        try {
            const res = await axios.get("/api/admin/get-curency");
            if (res.data.success) {
                setCurrencies(res.data.currencies);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getCurrencies();
    }, []);

    /* ================= CREATE ================= */
    const createCurrency = async () => {
        if (!currencyForm.currenyName || !currencyForm.currencyCode) return;


        try {
            setLoading(true);
            const res = await axios.post("/api/admin/curency", currencyForm, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.data.success) {
                setCreateOpen(false);
                setCurrencies(res.data.currencies);
                setCurrencyForm(emptyForm);
                setLoading(false);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    /* ================= EDIT ================= */
    const openEdit = (currency) => {
        setEditId(currency.curencyid);
        setCurrencyForm({
            currenyName: currency.currenyName,
            currencyCode: currency.currencyCode,
            currencySymbol: currency.currencySymbol,
            Curencyrate: currency.Curencyrate,
        });
        setEditOpen(true);
    };

    const updateCurrency = async () => {
        try {
            setLoading(true);
            const res = await axios.post(`/api/admin/update-curency/${editId}`, currencyForm);

            if (res.data.success) {
                setEditOpen(false);
                setCurrencies(res.data.currencies);
                setCurrencyForm(emptyForm);
                setEditId(null);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    /* ================= DELETE ================= */
    const deleteCurrency = async (id) => {
        if (!confirm("Are you sure you want to delete this currency?")) return;

        try {
            const res = await axios.post(`/api/admin/delete-curency/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.data.success) {
                toast.success("Currency deleted successfully");
                setCurrencies(res.data.currencies);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Accountslayout>
            <div className="p-6 space-y-6">
                <h1 className="text-3xl font-semibold">Currency Settings</h1>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Currencies</CardTitle>
                        <Button
                            onClick={() => {
                                setCurrencyForm(emptyForm); // ✅ reset form
                                setCreateOpen(true);
                            }}
                        >
                            + Add Currency
                        </Button>
                    </CardHeader>

                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Symbol</TableHead>
                                    <TableHead>Rate</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {currencies.map((currency) => (
                                    <TableRow key={currency.curencyid}>
                                        <TableCell>{currency.currenyName}</TableCell>
                                        <TableCell>{currency.currencyCode}</TableCell>
                                        <TableCell>{currency.currencySymbol}</TableCell>
                                        <TableCell>{currency.Curencyrate}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => openEdit(currency)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => deleteCurrency(currency.curencyid)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {currencies.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-center text-muted-foreground"
                                        >
                                            No currencies found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* ================= CREATE DIALOG ================= */}
            <Dialog
                open={createOpen}
                onOpenChange={(open) => {
                    setCreateOpen(open);
                    if (!open) setCurrencyForm(emptyForm);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Currency</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Input
                            placeholder="Currency Name"
                            value={currencyForm.currenyName}
                            onChange={(e) =>
                                setCurrencyForm({
                                    ...currencyForm,
                                    currenyName: e.target.value,
                                })
                            }
                        />
                        <Input
                            placeholder="Currency Code"
                            value={currencyForm.currencyCode}
                            onChange={(e) =>
                                setCurrencyForm({
                                    ...currencyForm,
                                    currencyCode: e.target.value.toUpperCase(),
                                })
                            }
                        />
                        <Input
                            placeholder="Symbol"
                            value={currencyForm.currencySymbol}
                            onChange={(e) =>
                                setCurrencyForm({
                                    ...currencyForm,
                                    currencySymbol: e.target.value,
                                })
                            }
                        />
                        <Input
                            placeholder="Currency Rate"
                            value={currencyForm.Curencyrate}
                            onChange={(e) =>
                                setCurrencyForm({
                                    ...currencyForm,
                                    Curencyrate: e.target.value,
                                })
                            }
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={createCurrency} disabled={loading}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ================= EDIT DIALOG ================= */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Currency</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Input
                            value={currencyForm.currenyName}
                            onChange={(e) =>
                                setCurrencyForm({
                                    ...currencyForm,
                                    currenyName: e.target.value,
                                })
                            }
                        />
                        <Input
                            value={currencyForm.currencyCode}
                            onChange={(e) =>
                                setCurrencyForm({
                                    ...currencyForm,
                                    currencyCode: e.target.value.toUpperCase(),
                                })
                            }
                        />
                        <Input
                            value={currencyForm.currencySymbol}
                            onChange={(e) =>
                                setCurrencyForm({
                                    ...currencyForm,
                                    currencySymbol: e.target.value,
                                })
                            }
                        />
                        <Input
                            value={currencyForm.Curencyrate}
                            onChange={(e) =>
                                setCurrencyForm({
                                    ...currencyForm,
                                    Curencyrate: e.target.value,
                                })
                            }
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={updateCurrency} disabled={loading}>
                            Update
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Accountslayout>
    );
}
