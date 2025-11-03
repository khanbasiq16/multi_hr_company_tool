"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming you have a Card component
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createemployees } from "@/features/Slice/EmployeeSlice";
import { Eye, EyeOff, KeyRound, UserPlus, Briefcase, Lock, Calendar } from "lucide-react";

// Helper component for Date Input
const DateInput = ({ label, name, required = false }) => (
  <div>
    <Label htmlFor={name}>
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <Input id={name} name={name} type="date" required={required} />
  </div>
);

// Helper component for Form Field
const FormField = ({ id, name, label, placeholder, type = "text", required = true, children }) => (
  <div>
    <Label htmlFor={id}>
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    {children || (
      <Input
        id={id}
        name={name}
        placeholder={placeholder}
        type={type}
        required={required}
      />
    )}
  </div>
);

const EmployeeFormPage = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  const dispatch = useDispatch();
  const { department } = useSelector((state) => state.Department);
  const { companies } = useSelector((state) => state.Company);

  // Password validation
  const validatePassword = (value) => {
    if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
    } else if (!/\d/.test(value)) {
      setPasswordError("Password must contain at least one number.");
    } else {
      setPasswordError("");
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

      if (selectedDepartment === "Sales" && e.target.salesTarget) {
        formData.append("salesTarget", e.target.salesTarget.value);
      }
      
    
      const res = await axios.post("/api/create-employee", formData);

      if (res.data.success) {
        toast.success("Employee Created Successfully");
        e.target.reset();
        dispatch(createemployees(res.data.employees));
        setSelectedDepartment("");
        setSelectedCompanies([]);
        setPassword("");
      } else {
        toast.error(res.data.error || "Failed to create employee");
      }
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      toast.error(error.response?.data?.error || "Error creating employee");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-2 md:p-8 ">
      <Card className="bg-transparent border-none">
        <CardHeader >
          <CardTitle className="flex items-center text-3xl font-extrabold text-[#5965AB]">
            <UserPlus className="w-8 h-8 mr-3" />
            Create New Employee
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={formHandler} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* --- Personal Information Card --- */}
              <Card className="col-span-1 md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center text-gray-700">
                    <UserPlus className="w-5 h-5 mr-2 text-blue-600" />
                    Personal Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField 
                    id="employeeName" 
                    name="employeeName" 
                    label="Employee Name" 
                    placeholder="e.g., Jane Doe" 
                  />
                  <FormField 
                    id="employeeemail" 
                    name="employeeemail" 
                    label="Email Address" 
                    placeholder="e.g., jane.doe@company.com" 
                    type="email" 
                  />
                  <FormField 
                    id="employeePhone" 
                    name="employeePhone" 
                    label="Phone Number" 
                    placeholder="e.g., +92 3XX-XXXXXXX" 
                  />
                  <FormField 
                    id="employeeCNIC" 
                    name="employeeCNIC" 
                    label="CNIC Number" 
                    placeholder="e.g., XXXXX-XXXXXXX-X" 
                  />
                  <FormField 
                    id="employeeAddress" 
                    name="employeeAddress" 
                    label="Address" 
                    placeholder="e.g., 123 Main St, City" 
                  />
                </CardContent>
              </Card>

              {/* --- Employment Details Card --- */}
              <Card className="col-span-1 md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center text-gray-700">
                    <Briefcase className="w-5 h-5 mr-2 text-green-600" />
                    Employment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Department Select */}
                  <FormField 
                    id="department" 
                    label="Department" 
                    required={true}
                  >
                    <Select
                      onValueChange={setSelectedDepartment}
                      value={selectedDepartment}
                    >
                      <SelectTrigger>
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
                  </FormField>

                  {/* Sales Target - Conditional Field */}
                  {selectedDepartment === "Sales" && (
                    <FormField
                      id="salesTarget"
                      name="salesTarget"
                      label="Monthly Sales Target"
                      placeholder="Enter target amount (e.g., 50000)"
                      type="number"
                    />
                  )}

                  {/* Company Select */}
                  <FormField 
                    id="company" 
                    label="Company" 
                    required={true}
                  >
                    <Select
                      onValueChange={handleCompanySelect}
                      value={
                        companies.find((comp) => selectedCompanies[0] === comp.id)
                          ?.name || ""
                      }
                    >
                      <SelectTrigger>
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
                  </FormField>

                  {/* Salary and Working Hours */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      id="employeeSalary"
                      name="employeeSalary"
                      label="Salary"
                      placeholder="e.g., 50000"
                      type="number"
                    />
                    <FormField
                      id="totalWorkingHours"
                      name="totalWorkingHours"
                      label="Working Hours"
                      placeholder="e.g., 8"
                      type="number"
                    />
                  </div>

                  {/* Date of Joining */}
                  <DateInput label="Date of Joining" name="dateOfJoining" required={true} />
                </CardContent>
              </Card>

              {/* --- Security Card (Password) --- */}
              <Card className="col-span-1 md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center text-gray-700">
                    <Lock className="w-5 h-5 mr-2 text-red-600" />
                    Security Credentials
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="employeepassword">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="employeepassword"
                        name="employeepassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter or generate password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          validatePassword(e.target.value);
                        }}
                        required
                        className="pr-[90px]" // Extra padding for the icons
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                          <span
                              className="text-gray-500 cursor-pointer hover:text-gray-700"
                              onClick={() => setShowPassword(!showPassword)}
                              title={showPassword ? "Hide Password" : "Show Password"}
                          >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </span>
                          <span
                              className="text-gray-500 cursor-pointer hover:text-red-600"
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
                                  setShowPassword(true);
                              }}
                              title="Generate Password"
                          >
                              <KeyRound size={18} />
                          </span>
                      </div>
                    </div>
                    {passwordError && (
                      <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* --- Submit Button Area --- */}
            <div className="flex justify-center pt-8 border-t border-gray-100 mt-6">
              <Button
                type="submit"
                className="bg-[#5965AB] hover:bg-[#4a5595] text-white font-semibold px-12 py-3 text-lg transition-colors duration-300"
                disabled={loading || !!passwordError || !selectedDepartment || selectedCompanies.length === 0}
              >
                {loading ? "Creating Employee..." : "Create Employee"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeFormPage;