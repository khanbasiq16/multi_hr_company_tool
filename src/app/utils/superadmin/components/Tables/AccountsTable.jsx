"use client";

import * as React from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Loader2, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { createAccountants } from "@/features/Slice/AccountantSlice";
import Link from "next/link";

export function AccountsTable({ accountants }) {
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [deleteloading, setDeleteloading] = React.useState(false);
    const [editingRowId, setEditingRowId] = React.useState(null);
    const [updatingStatus, setUpdatingStatus] = React.useState(false);

    const dispatch = useDispatch();

    // ----- STATUS CHANGE -----
    const handleStatusChange = async (accountId, newStatus) => {
        try {
            setUpdatingStatus(true);
            const toastId = toast.loading("Updating status...");
            const res = await fetch("/api/acounts/update-account-status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accountId, status: newStatus }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message, { id: toastId });
                dispatch(createAccountants(data.accounts));
            } else {
                toast.error(data.message || "Failed to update status", { id: toastId });
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setUpdatingStatus(false);
            setEditingRowId(null);
        }
    };

    // ----- BULK STATUS CHANGE -----
    const handleBulkStatusChange = async (newStatus) => {
        const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => row.original);
        const accountIds = selectedRows.map((acc) => acc.accountId);

        if (!accountIds.length) {
            toast.error("Select at least one account");
            return;
        }

        try {
            setUpdatingStatus(true);
            const toastId = toast.loading("Updating status...");
            const res = await fetch("/api/acounts/bulk-update-account-status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accountIds, status: newStatus }),
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Status updated for selected accounts", { id: toastId });
                dispatch(createAccountants(data.accounts));
            } else {
                toast.error(data.message || "Failed", { id: toastId });
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setUpdatingStatus(false);
        }
    };

    // ----- DELETE -----
    const handleDelete = async () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => row.original);
        const accountIds = selectedRows.map((acc) => acc.accountId);

        if (!accountIds.length) {
            toast.error("Select at least one account to delete");
            return;
        }

        try {
            setDeleteloading(true);
            const res = await fetch("/api/acounts/delete-account", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accountIds }),
            });

            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                dispatch(createAccountants(data.accounts));
                setDeleteloading(false);
            } else {
                toast.error(data.message || "Failed to delete accounts");
                setDeleteloading(false);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    // ----- TABLE COLUMNS -----
    const columns = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                />
            ),
            cell: ({ row }) => (
                <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "accountuserName",
            header: "Name",
            cell: ({ row }) => <div className="capitalize">{row.getValue("accountuserName")}</div>,
        },
        {
            accessorKey: "accountuseremail",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="whitespace-nowrap"
                >
                    Email <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div className="lowercase">{row.getValue("accountuseremail")}</div>,
        },
        {
            accessorKey: "accountuserphone",
            header: "Phone",
            cell: ({ row }) => <div>{row.getValue("accountuserphone")}</div>,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status");
                const isEditing = editingRowId === row.original.accountId;
                return (
                    <div onDoubleClick={() => setEditingRowId(row.original.accountId)} className="cursor-pointer">
                        {isEditing ? (
                            <Select
                                defaultValue={status.toLowerCase()}
                                onValueChange={(val) => handleStatusChange(row.original.accountId, val)}
                            >
                                <SelectTrigger className="w-[120px] h-8 text-sm">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="deactivate">Deactivate</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${status.toLowerCase() === "active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.accountuseremail)}>
                            Copy Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            {/* Assuming you have a details page */}
                            <Link href={`/admin/accounts/${row.original.accountId}/viewdetails`}>View Details</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    // ----- TABLE CONFIG -----
    const table = useReactTable({
        data: accountants,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full">
            {/* FILTER & BULK ACTIONS */}
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter emails..."
                    value={table.getColumn("accountuseremail")?.getFilterValue() ?? ""}
                    onChange={(e) => table.getColumn("accountuseremail")?.setFilterValue(e.target.value)}
                    className="w-40"
                />

                {table.getFilteredSelectedRowModel().rows.length > 0 && (
                    <div className="ml-4">
                        <Select disabled={updatingStatus} onValueChange={(val) => handleBulkStatusChange(val)}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Change Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Activate</SelectItem>
                                <SelectItem value="deactivate">Deactivate</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* DELETE DIALOG */}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="destructive"
                            size="sm"
                            disabled={table.getFilteredSelectedRowModel().rows.length === 0}
                            className="ml-4"
                        >
                            <Trash />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>This will permanently delete the selected accounts.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} disabled={deleteloading}>
                                {deleteloading ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : "Confirm Delete"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* COLUMN TOGGLE */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* TABLE */}
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between py-4">
                <div className="text-sm text-muted-foreground flex-1">
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
