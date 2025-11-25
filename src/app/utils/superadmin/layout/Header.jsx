

"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";

const Header = () => {
  const pathname = usePathname();
  const { user } = useSelector((state) => state.User);

  // 🔹 Local search state
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // ✅ Example data (label + link)
  const allItems = [
    { label: "Dashboard Overview", href: "/admin" },
    { label: "Company Details", href: "/admin/companies" },
    { label: "Employee Records", href: "/admin/employees" },
    { label: "Attendance Sheet", href: "/admin/attendance" },
    { label: "Expense Reports", href: "/admin/expense" },
    { label: "Settings", href: "/admin/settings" },
    { label: "Templates", href: "/admin/templates" },
  ];

  // 🔹 Handle search typing
  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length > 0) {
      const results = allItems.filter((item) =>
        item.label.toLowerCase().includes(value.toLowerCase())
      );
      setFiltered(results);
      setShowDropdown(true);
    } else {
      setFiltered([]);
      setShowDropdown(false);
    }
  };

  const links = [
    { href: "/panel", label: "Dashboard" },
    { href: "/companies", label: "Companies" },
  ];

  const activePage =
    links.find((link) => link.href === pathname)?.label || "Dashboard";

  return (
    

    <div className="fixed top-0 left-0 w-full bg-[#F6F6F6] pt-4 pb-2 z-30">
  <header className="mx-auto bg-white px-4 md:px-6 py-3 rounded-xl shadow-sm w-[95%] md:w-[97%]">
    <div className="flex justify-between items-center gap-4">
      
      {/* Left Section */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Logo */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
          <img
            src="https://brintor.com/assets/img/logo-icon.png"
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Page Title */}
        <span className="text-gray-600 font-medium text-sm sm:text-base md:text-lg">
          {activePage}
        </span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 sm:gap-6 relative">
        
        {/* Search Box */}
        <div className="relative w-32 sm:w-56 md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          
          <Input
            type="search"
            placeholder="Search"
            value={query}
            onChange={handleSearch}
            onFocus={() => query && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            className="pl-9 pr-4 py-2 bg-gray-100 rounded-full border-0 text-sm focus-visible:ring-1 focus-visible:ring-gray-300"
          />

          {/* Dropdown */}
          {showDropdown && filtered.length > 0 && (
            <ul className="absolute mt-2 w-full bg-white rounded-lg shadow-md border border-gray-200 max-h-48 overflow-y-auto z-50">
              {filtered.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="block px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm"
                    onClick={() => {
                      setQuery("");
                      setShowDropdown(false);
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {showDropdown && filtered.length === 0 && (
            <div className="absolute mt-2 w-full bg-white rounded-lg shadow-md border border-gray-200 text-center text-gray-500 text-sm py-2">
              No results found
            </div>
          )}
        </div>

        {/* Notification */}
        <button className="relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Info (hide on mobile) */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="leading-tight">
            <p className="font-medium text-sm flex items-center gap-1">
              {user?.name}
              {user?.role && (
                <span className="text-gray-500 text-xs">
                  (
                  {user?.role.charAt(0).toUpperCase() +
                    user?.role.slice(1).replace(/\s+/g, "")}
                  )
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  </header>
</div>

  

  );
};

export default Header;
