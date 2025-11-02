


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
import {
  ArrowUpDown,
  ChevronDown,
  Loader2,
  MoreHorizontal,
  Trash,
} from "lucide-react";
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
import Link from "next/link";
import { toast } from "react-hot-toast";
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
import { createemployees } from "@/features/Slice/EmployeeSlice";
import { useDispatch } from "react-redux";

// ✅ Shadcn Select
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EmployeeTable({ employees }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [deleteloading, setDeleteloading] = React.useState(false);
  const [updatingStatus, setUpdatingStatus] = React.useState(false);
  const [editingRowId, setEditingRowId] = React.useState(null);

  const dispatch = useDispatch();

  // 🔹 Single employee status update
  const handleStatusChange = async (employeeId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const toastId = toast.loading("Updating status...");
      const res = await fetch("/api/update-employee-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, status: newStatus }),
      });

      const data = await res.json();
      if (res.ok) {
         toast.success(data.message, {
        id: toastId, // replace the loading toast
      });
       
        dispatch(createemployees(data.employees));
      }
      else {
      toast.error(data.message || "Failed to update status", {
        id: toastId,
      });
    }
    } catch (error) {
      console.error("❌ Error updating status:", error);
      toast.error("Something went wrong");
    } finally {
      setUpdatingStatus(false);
      setEditingRowId(null);
    }
  };



const handleBulkStatusChange = async (newStatus) => {
  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original);
  const employeeIds = selectedRows.map((emp) => emp.employeeId);

  if (employeeIds.length === 0) {
    toast.error("Select at least one employee");
    return;
  }

  try {
    setUpdatingStatus(true);

    const toastId = toast.loading("Updating status...");

    const res = await fetch("/api/bulk-update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeIds, status: newStatus }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Status updated for selected employees", {
        id: toastId, // replace the loading toast
      });
      dispatch(createemployees(data.employees));
    } else {
      toast.error(data.message || "Failed to update status", {
        id: toastId,
      });
    }
  } catch (error) {
    console.error("❌ Bulk update error:", error);
    toast.error("Something went wrong while updating status");
  } finally {
    setUpdatingStatus(false);
  }
};

  // 🔹 Delete handler
  const handleDelete = async () => {
    const selectedRows = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original);

    const employeeIds = selectedRows.map((emp) => emp.employeeId);

    if (employeeIds.length === 0) {
      toast.error("Please select at least one employee to delete");
      return;
    }

    try {
      setDeleteloading(true);
      const res = await fetch("/api/delete-employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeIds }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        dispatch(createemployees(data.employees));
      } else {
        toast.error(data.message || "Failed to delete employees");
      }
    } catch (error) {
      console.error("❌ Delete error:", error);
      toast.error("Something went wrong while deleting employees");
    } finally {
      setDeleteloading(false);
    }
  };

  // 🔹 Table columns
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
      accessorKey: "employeeName",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize whitespace-nowrap overflow-hidden text-ellipsis">
          {row.getValue("employeeName")}
        </div>
      ),
    },
    {
      accessorKey: "employeeemail",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="whitespace-nowrap"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase whitespace-nowrap overflow-hidden text-ellipsis">
          {row.getValue("employeeemail")}
        </div>
      ),
    },
    {
      accessorKey: "employeePhone",
      header: "Phone",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">{row.getValue("employeePhone")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        const formattedStatus =
          status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        const badgeColor =
          status.toLowerCase() === "active"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700";

        const isEditing = editingRowId === row.original.employeeId;

        return (
          <div
            onDoubleClick={() => setEditingRowId(row.original.employeeId)}
            className="cursor-pointer"
          >
            {isEditing ? (
              <Select
                onValueChange={(val) =>
                  handleStatusChange(row.original.employeeId, val)
                }
                defaultValue={status.toLowerCase()}
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
                className={`px-3 py-1 rounded-full text-sm font-medium ${badgeColor}`}
              >
                {formattedStatus}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "employeeCNIC",
      header: "CNIC",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">{row.getValue("employeeCNIC")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const emp = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(emp.employeeemail)}
              >
                Copy Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={`/admin/employees/${emp.employeeId}/viewdetails`}>
                  View Details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // 🔹 React Table Config
  const table = useReactTable({
    data: employees,
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
      {/* 🔍 Filter + Bulk Actions */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={table.getColumn("employeeemail")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("employeeemail")?.setFilterValue(event.target.value)
          }
          className="w-40"
        />

        {/* 🟢 Bulk Status Change Dropdown */}
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <div className="ml-4">
            <Select
              disabled={updatingStatus}
              onValueChange={(val) => handleBulkStatusChange(val)}
            >
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

        {/* 🗑️ Delete Dialog */}
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
              <AlertDialogDescription>
                This action cannot be undone. It will permanently delete the
                selected employees from your system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleteloading}
              >
                {deleteloading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    Deleting...
                  </div>
                ) : (
                  "Confirm Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* ⚙️ Column Toggle */}
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
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 🧾 Table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
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

      {/* 📄 Footer */}
      <div className="flex items-center justify-between py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
