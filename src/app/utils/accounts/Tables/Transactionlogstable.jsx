"use client"

import * as React from "react"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function Transactionlogstable({ logs }) {

    const [sorting, setSorting] = React.useState([])
    const [columnFilters, setColumnFilters] = React.useState([])
    const [columnVisibility, setColumnVisibility] = React.useState({})
    const [rowSelection, setRowSelection] = React.useState({})

    const columns = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "userName",
            header: "User Name",
            cell: ({ row }) => <div className="capitalize">{row.getValue("userName")}</div>,
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => <span className="font-medium">{row.getValue("role")}</span>,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <span className={`px-2 py-1 rounded-full text-xs font-bold
           ${row.getValue("status") === "Credit" ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"}
        `}
                >
                    {row.getValue("status")}
                </span>
            ),
        },
        {
            accessorKey: "amount",
            header: "Amount",
            cell: ({ row }) => <span className="font-semibold">Rs {row.getValue("amount")}</span>,
        },
        {
            accessorKey: "date",
            header: "Date",
            cell: ({ row }) => {
                const d = new Date(row.getValue("date"))
                const formattedDate = d.toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                })
                return <span>{formattedDate}</span>
            }
        },
        {
            header: "Time",
            accessorKey: "time",
            cell: ({ row }) => {
                const d = new Date(row.original.date)
                const formattedTime = d.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                })
                return <span>{formattedTime}</span>
            }
        },
        {
            accessorKey: "ip",
            header: "IP Address",
            cell: ({ row }) => <span className="text-gray-600">{row.getValue("ip")}</span>,
        },

        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const log = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(log.ip)}>
                                Copy IP
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(JSON.stringify(log))}>
                                Copy Full Record
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data: logs,
        columns,
        state: { sorting, columnFilters, columnVisibility, rowSelection },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    return (
        <div className="w-full">
            {/* 🔍 Search Filter */}
            <div className="flex items-center py-4">
                <Input
                    placeholder="Search by user name..."
                    value={table.getColumn("userName")?.getFilterValue() ?? ""}
                    onChange={(e) => table.getColumn("userName")?.setFilterValue(e.target.value)}
                    className="max-w-sm"
                />

                {/* Column Toggle */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table.getAllColumns().filter(c => c.getCanHide()).map(column => (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                checked={column.getIsVisible()}
                                onCheckedChange={(v) => column.toggleVisibility(!!v)}
                                className="capitalize"
                            >
                                {column.id}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No Logs Found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex justify-end gap-3 py-4">
                <Button disabled={!table.getCanPreviousPage()} variant="outline" onClick={() => table.previousPage()}>
                    Previous
                </Button>
                <Button disabled={!table.getCanNextPage()} variant="outline" onClick={() => table.nextPage()}>
                    Next
                </Button>
            </div>
        </div>
    )
}
