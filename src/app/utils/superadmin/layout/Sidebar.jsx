"use client";
import React, { useState } from "react";
import {
  Home,
  Calendar,
  LogOut,
  Menu,
  X,
  Users,
  BanknoteArrowDown,
  PersonStanding,
  CardSim,
  NotepadTextDashed,
  Settings,
  ArrowBigLeft,
  Building,
  DollarSign,
  Receipt,
  BadgeDollarSign,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { logout } from "@/features/Slice/UserSlice";
import axios from "axios";
import { useDispatch } from "react-redux";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  /* ================= DASHBOARD LINKS ================= */
  const dashboardLinks = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: <Home className="w-4 h-4 2xl:w-5 2xl:h-5" />,
    },
    {
      href: "/admin/companies",
      label: "Companies",
      icon: <Building className="w-4 h-4 2xl:w-5 2xl:h-5" />,
    },
    {
      href: "/admin/employees",
      label: "Employees",
      icon: <Users className="w-4 h-4 2xl:w-5 2xl:h-5" />,
    },
    {
      href: "/admin/templates",
      label: "Templates",
      icon: <NotepadTextDashed className="w-4 h-4 2xl:w-5 2xl:h-5" />,
    },
    {
      href: "/admin/attendance",
      label: "Attendance",
      icon: <Calendar className="w-4 h-4 2xl:w-5 2xl:h-5" />,
    },
    {
      href: "/admin/accounts",
      label: "Accounts",
      icon: <DollarSign className="w-4 h-4 2xl:w-5 2xl:h-5" />,
    },
    {
      href: "/admin/banks",
      label: "Bank Accounts",
      icon: <BanknoteArrowDown className="w-4 h-4 2xl:w-5 2xl:h-5" />,
    },
    {
      href: "/admin/taxes",
      label: "Taxes",
      icon: <DollarSign className="w-4 h-4 2xl:w-5 2xl:h-5" />,
    },
    {
      href: "/admin/expenses",
      label: "Expenses",
      icon: <Receipt className="w-4 h-4 2xl:w-5 2xl:h-5" />,
    },

  ];

  /* ================= SLUG EXTRACTION ================= */
  const parts = pathname.split("/");
  const companyId = pathname.startsWith("/admin/company/") ? parts[3] : null;
  const bankId = pathname.startsWith("/admin/bank/") ? parts[3] : null;

  /* ================= COMPANY DETAILS LINKS ================= */
  const companyDetailsLinks = companyId
    ? [
      {
        href: `/admin/company/${companyId}`,
        label: "General",
        icon: <Home className="w-4 h-4 2xl:w-5 2xl:h-5" />,
      },
      {
        href: `/admin/company/${companyId}/clients`,
        label: "Clients",
        icon: <PersonStanding className="w-4 h-4 2xl:w-5 2xl:h-5" />,
      },
      {
        href: `/admin/company/${companyId}/invoices`,
        label: "Invoices",
        icon: <CardSim className="w-4 h-4 2xl:w-5 2xl:h-5" />,
      },
      {
        href: `/admin/company/${companyId}/templates`,
        label: "Templates",
        icon: <NotepadTextDashed className="w-4 h-4 2xl:w-5 2xl:h-5" />,
      },
    ]
    : [];

  /* ================= BANK DETAILS LINKS ================= */
  const bankDetailsLinks = bankId
    ? [
      {
        href: `/admin/bank/${bankId}`,
        label: "General",
        icon: <Home className="w-4 h-4 2xl:w-5 2xl:h-5" />,
      },
      {
        href: `/admin/bank/${bankId}/transfer`,
        label: "Transfer",
        icon: <NotepadTextDashed className="w-4 h-4 2xl:w-5 2xl:h-5" />,
      },
      {
        href: `/admin/bank/${bankId}/loans`,
        label: "Loans",
        icon: <BadgeDollarSign className="w-4 h-4 2xl:w-5 2xl:h-5" />,
      },
    ]
    : [];

  /* ================= LINKS SWITCH ================= */
  let links = dashboardLinks;

  if (pathname.startsWith("/admin/company/")) {
    links = companyDetailsLinks;
  }

  if (pathname.startsWith("/admin/bank/")) {
    links = bankDetailsLinks;
  }

  const showBackButton =
    pathname.startsWith("/admin/company/") ||
    pathname.startsWith("/admin/bank/");

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    try {
      const res = await axios.get("/api/logout");
      if (res.data.success) {
        dispatch(logout());
        router.push("/superadmin/sign-in");
        toast.success("Logged out successfully");
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-24 right-4 z-50 bg-[#5965AB] text-white p-2 rounded-md"
      >
        {open ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 mt-24 z-40 bg-white shadow-sm rounded-lg
        w-[60%] sm:w-[55%] px-6 py-8 transition-transform duration-300
        ${open ? "translate-x-4" : "-translate-x-full"}
        lg:translate-x-0 lg:w-[20%] lg:h-[78vh] lg:mt-28`}
      >
        {/* Links */}
        <nav className="flex flex-col gap-2 h-[50vh] overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium
                ${isActive
                    ? "bg-gradient-to-r from-[#5965AB] to-[#60B89E] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="mt-6 flex flex-col gap-2">
          {showBackButton && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowBigLeft className="w-4 h-4" /> Back
            </Link>
          )}

          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <Settings className="w-4 h-4" /> Settings
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-100"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
