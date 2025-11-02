"use client";

import React, { useState } from "react";
import Employeelayout from "@/app/utils/employees/layout/Employeelayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { UpdateUser } from "@/features/Slice/UserSlice";
// Import icons for better UI
import { Eye, EyeOff, RefreshCcw, Lock } from "lucide-react";

// --- Utility function for password generation ---
const generateRandomPassword = (length = 16) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let password = "";
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSymbol = false;

  // Ensure the password meets criteria (at least one of each type)
  while (
    password.length < length ||
    !hasUpper ||
    !hasLower ||
    !hasNumber ||
    !hasSymbol
  ) {
    password = "";
    hasUpper = false;
    hasLower = false;
    hasNumber = false;
    hasSymbol = false;

    for (let i = 0; i < length; i++) {
      const char = characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
      password += char;
      if (/[A-Z]/.test(char)) hasUpper = true;
      if (/[a-z]/.test(char)) hasLower = true;
      if (/[0-9]/.test(char)) hasNumber = true;
      if (/[!@#$%^&*()_+]/.test(char)) hasSymbol = true;
    }
  }
  return password;
};

const EmployeeSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileupdateloading, setProfileupdateloading] = useState(false);
  const [passwordupdateloading, setPaswordupdateloading] = useState(false);
  const { user } = useSelector((state) => state.User);
  const dispatch = useDispatch();

  const [profileData, setProfileData] = useState({
    employeeName: user?.employeeName || "",
    employeeemail: user?.employeeemail || "",
    employeePhone: user?.employeePhone || "",
    employeeAddress: user?.employeeAddress || "",
    employeeCNIC: user?.employeeCNIC || "",
    dateOfJoining: user?.dateOfJoining || "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setProfileupdateloading(true);
      const res = await axios.post(
        `/api/employee/update-employee/${user.employeeId}`,
        profileData
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(UpdateUser(res.data.employee));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setProfileupdateloading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    try {
      setPaswordupdateloading(true);

      if (passwordData.newPassword.length < 8) {
        return toast.error("New password must be at least 8 characters long.");
      }

      const res = await axios.post(
        `/api/employee/update-password/${user.employeeId}`,
        passwordData
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setPaswordupdateloading(false)
      }
    } catch (err) {
      console.error(err?.response?.data?.error);
      toast.error(err?.response?.data?.error);
      setPaswordupdateloading(true);
    } 
  };

  // Function to generate and set new password
  const handleGeneratePassword = () => {
    const newPass = generateRandomPassword();
    setPasswordData((prev) => ({
      ...prev,
      newPassword: newPass,
      confirmPassword: newPass,
    }));
    toast.success("Strong password generated and applied!");
  };

  // Handle input change for profile form (unchanged)
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Employeelayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold mb-4">Settings</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full sm:w-[400px]">
            <TabsTrigger value="profile">Profile Info</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="password">Update Password</TabsTrigger>
          </TabsList>

          {/* Profile Settings (content unchanged) */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-3 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        name="employeeName"
                        value={profileData.employeeName}
                        onChange={handleProfileChange}
                        placeholder="Employee Name"
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        name="employeeemail"
                        value={profileData.employeeemail}
                        onChange={handleProfileChange}
                        placeholder="Email Address"
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        name="employeePhone"
                        value={profileData.employeePhone}
                        onChange={handleProfileChange}
                        placeholder="Phone Number"
                      />
                    </div>
                    <div>
                      <Label>CNIC</Label>
                      <Input
                        name="employeeCNIC"
                        value={profileData.employeeCNIC}
                        onChange={handleProfileChange}
                        placeholder="CNIC Number"
                      />
                    </div>
                    <div>
                      <Label>Date of Joining</Label>
                      <Input
                        type="date"
                        name="dateOfJoining"
                        value={profileData.dateOfJoining}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Address</Label>
                      <Input
                        name="employeeAddress"
                        value={profileData.employeeAddress}
                        onChange={handleProfileChange}
                        placeholder="Home Address"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={profileupdateloading}
                    className={`mt-4 text-white ${
                      profileupdateloading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#5965AB] hover:bg-[#4a5595]"
                    }`}
                  >
                    {profileupdateloading ? "....Updating" : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings (content unchanged) */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Email Notifications</Label>
                  <input type="checkbox" className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>SMS Alerts</Label>
                  <input type="checkbox" className="h-4 w-4" />
                </div>
                <Button className="mt-4 bg-[#5965AB] text-white">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Update Password (MODIFIED) */}
          <TabsContent value="password">
            <Card>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  {/* Generate Password Button */}

                  <div className="flex items-center justify-between">
                    <CardTitle>Update Password</CardTitle>
                    <Button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="bg-transparent hover:bg-transparent  text-black flex items-center gap-2"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Generate Strong Password
                    </Button>
                  </div>

                  {/* Current Password Field */}
                  <div>
                    <Label htmlFor="oldPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="oldPassword"
                        type={showPassword.old ? "text" : "password"}
                        value={passwordData.oldPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            oldPassword: e.target.value,
                          })
                        }
                        placeholder="Enter current password"
                        className="pr-18"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            old: !showPassword.old,
                          })
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.old ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password Field */}
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="Enter new password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            new: !showPassword.new,
                          })
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.new ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password Field */}
                  <div>
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPassword.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="Confirm new password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            confirm: !showPassword.confirm,
                          })
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.confirm ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={passwordupdateloading}
                    className={`mt-4 flex items-center gap-2 text-white ${
                      passwordupdateloading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#5965AB] hover:bg-[#4a5595]"
                    }`}
                  >
                    <Lock className="h-4 w-4" />
                    {passwordupdateloading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Employeelayout>
  );
};

export default EmployeeSettings;
