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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createemployees } from "@/features/Slice/EmployeeSlice";

const Employeedailog = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const dispatch = useDispatch();

  const { department } = useSelector((state) => state.Department);
  const { companies } = useSelector((state) => state.Company);
  const { slug } = useParams();

  const capitalizedCompanyName = slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "";

  // ✅ Password validation
  const validatePassword = (value) => {
    if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    } else if (!/\d/.test(value)) {
      setPasswordError("Password must contain at least one number");
    } else {
      setPasswordError("");
    }
  };

  const formHandler = async (e) => {
    e.preventDefault();
    const passwordValue = password;
    if (!passwordValue || passwordError) return;

    if (!selectedDepartment) {
      toast.error("Please select a department");
      return;
    }

    if (selectedCompanies.length === 0) {
      toast.error("Please select a company");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      selectedCompanies.forEach((companyId) => {
        formData.append("companyIds[]", companyId);
      });

      formData.append("employeeName", e.target.employeeName.value);
      formData.append("employeeAddress", e.target.employeeAddress.value);
      formData.append("employeeemail", e.target.employeeemail.value);
      formData.append("employeepassword", passwordValue);
      formData.append("employeePhone", e.target.employeePhone.value);
      formData.append("employeeCNIC", e.target.employeeCNIC.value);
      formData.append("employeeSalary", e.target.employeeSalary.value);
      formData.append("department", selectedDepartment);

      formData.append(
        "totalWorkingHours",
        e.target.totalWorkingHours?.value || ""
      );
      formData.append("dateOfJoining", e.target.dateOfJoining.value);

      if (e.target.salesTarget) {
        formData.append("salesTarget", e.target.salesTarget.value);
      }

      const res = await axios.post("/api/create-employee", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.success) {
        toast.success("Employee Created Successfully");
        e.target.reset();
        dispatch(createemployees(res.data.employees));
        setSelectedDepartment("");
        setSelectedCompanies([]);
        setPassword("");
        setOpen(false);
      } 
    } catch (error) {
      console.error(error.response.data.error);
      toast.error("Error creating employee");
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySelect = (value) => {
    const selectedCompany = companies.find((c) => c.name === value);
    if (selectedCompany) {
      setSelectedCompanies([selectedCompany.id]);
    } else {
      setSelectedCompanies([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#5965AB] text-white font-semibold rounded-md px-4 py-2">
          + Create Employee
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create New Employee</DialogTitle>
          {capitalizedCompanyName && (
            <p className="text-sm text-gray-500 mt-1">
              Company:{" "}
              <span className="font-semibold">{capitalizedCompanyName}</span>
            </p>
          )}
        </DialogHeader>

        <form
          onSubmit={formHandler}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 max-h-[80vh] overflow-y-auto p-2"
        >
          {/* Left column */}
          <div className="space-y-4">
            {/* Employee Name */}
            <div>
              <Label htmlFor="employeeName">
                Employee Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="employeeName"
                name="employeeName"
                placeholder="Enter employee name"
                required
              />
            </div>

            {/* Department */}
            <div>
              <Label htmlFor="department">
                Department <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={setSelectedDepartment}
                value={selectedDepartment}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {department?.length > 0 ? (
                    department.map((dep) => (
                      <SelectItem
                        key={dep._id || dep.id}
                        value={dep.departmentName}
                      >
                        {dep.departmentName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No departments available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Sales Target */}
            {selectedDepartment === "Sales" && (
              <div>
                <Label htmlFor="salesTarget">
                  Sales Target <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="salesTarget"
                  name="salesTarget"
                  placeholder="Enter monthly sales target"
                  type="number"
                  required
                />
              </div>
            )}

            {/* Company */}
            <div>
              <Label htmlFor="company">
                Company <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={handleCompanySelect}
                value={
                  companies.find((comp) => selectedCompanies[0] === comp.id)
                    ?.name || ""
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  {companies?.length > 0 ? (
                    companies.map((comp) => (
                      <SelectItem key={comp.id} value={comp.name}>
                        {comp.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No companies available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="employeeemail">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="employeeemail"
                name="employeeemail"
                placeholder="Enter Email"
                type="email"
                required
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col w-full max-w-sm mx-auto">
              <Label htmlFor="employeepassword">
                Password <span className="text-red-500">*</span>
              </Label>

              <div className="relative">
                <Input
                  id="employeepassword"
                  name="employeepassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  required
                  className="w-full px-4 py-3 pr-20"
                />

                <span
                  className="absolute inset-y-0 right-10 flex items-center text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>

                <span
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-500 cursor-pointer"
                  onClick={() => {
                    const chars =
                      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
                    let randomPass = "";
                    for (let i = 0; i < 10; i++) {
                      randomPass += chars.charAt(
                        Math.floor(Math.random() * chars.length)
                      );
                    }
                    setPassword(randomPass);
                    validatePassword(randomPass);
                    navigator.clipboard.writeText(randomPass);
                    toast.success("Password generated & copied!");
                    setShowPassword(true); // 👈 show generated password
                  }}
                  title="Generate Password"
                >
                  <KeyRound size={18} />
                </span>
              </div>

              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            {/* CNIC */}
            <div>
              <Label htmlFor="employeeCNIC">
                CNIC Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="employeeCNIC"
                name="employeeCNIC"
                placeholder="Enter CNIC number"
                required
              />
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="employeeSalary">
                Salary <span className="text-red-500">*</span>
              </Label>
              <Input
                id="employeeSalary"
                name="employeeSalary"
                placeholder="Enter salary"
                required
              />
            </div>

            <div>
              <Label htmlFor="totalWorkingHours">
                Total Working Hours <span className="text-red-500">*</span>
              </Label>
              <Input
                id="totalWorkingHours"
                name="totalWorkingHours"
                placeholder="Enter total working hours"
              />
            </div>

            <div>
              <Label htmlFor="employeeAddress">
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="employeeAddress"
                name="employeeAddress"
                placeholder="Enter address"
              />
            </div>

            <div>
              <Label htmlFor="employeePhone">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="employeePhone"
                name="employeePhone"
                placeholder="Enter phone number"
              />
            </div>

            <DateInput label="Date of Joining" name="dateOfJoining" />
          </div>

          <DialogFooter className="col-span-2 flex justify-end mt-2">
            <Button
              type="submit"
              className="bg-[#5965AB] text-white font-semibold px-6 py-2"
              disabled={loading || !!passwordError}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Employeedailog;

const DateInput = ({ label, name }) => (
  <div className="flex flex-col w-full max-w-sm mx-auto mt-4">
    <Label className="mb-2 text-sm font-semibold">{label}</Label>
    <Input id={name} name={name} type="date" className="w-full px-4 py-3" />
  </div>
);
