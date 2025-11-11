"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import Timer from "../components/attendance/Timer";
const Header = () => {
  const pathname = usePathname();
  const { user } = useSelector((state) => state.User);
  
  const links = [
    { href: "/panel", label: "Dashboard" },
    { href: "/companies", label: "Companies" },
  ];
  
  const activePage =
    links.find((link) => link.href === pathname)?.label || "Dashboard";
  return (
    <>
    <div className="pt-6 overflow-hidden z-30 fixed w-full bg-[#F6F6F6]">
      <header className="fixed bg-white px-6 py-3 rounded-xl shadow-sm w-[97%] z-50">
    
        <div className="flex justify-between items-center">
        
          <div className="flex items-center">
            <div className="w-[16vw]">
              <img
                src="https://brintor.com/assets/img/logo-icon.png"
                alt="Logo"
                className="w-12 h-12 2xl:w-16 2xl:h-16 object-contain"
              />
            </div>
            <span className="ml-6 text-gray-600 font-medium text-md 2xl:text-lg">
              <Timer/>
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* Search box */}
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input
                type="search"
                placeholder="Search"
                className="pl-9 pr-4 py-2 bg-gray-100 rounded-full border-0 focus-visible:ring-1 focus-visible:ring-gray-300"
              />
            </div>
     
            <button className="relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {/* User */}
            <div className=" hidden lg:flex items-center  gap-3">
              <div className="leading-tight">
                <p className="font-medium text-sm flex items-center gap-1">
                  {user?.employeeName}
                  {user?.role && (
                    <span className="text-gray-500 text-xs">
                      (
                      {user?.role.charAt(0).toUpperCase() +
                        user?.role.slice(1).replace(/\s+/g, "")}
                      )
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500">{user?.employeeemail}</p>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
        </>
  );
};
export default Header;
