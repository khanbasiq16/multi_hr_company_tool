// "use client";
// import React, { useState } from "react";
// import {
//   Home,
//   Calendar,
//   HelpCircle,
//   LogOut,
//   Menu,
//   X,
//   Users,
//   BanknoteArrowDown,
//   HandCoins,
//   PersonStanding,
//   CardSim,
//   NotepadTextDashed,
//   Settings,
//   Calendar1,
//   ArrowBigLeft,
// } from "lucide-react";
// import { usePathname, useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import Link from "next/link";
// import { logout } from "@/features/Slice/UserSlice";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { resetTimer } from "@/features/Slice/StopwatchSlice";
// import { resetCheckIn } from "@/features/Slice/CheckInSlice";
// import { resetCheckOut } from "@/features/Slice/CheckOutSlice";

// const Sidebar = () => {
//   const [open, setOpen] = useState(false);
//   const pathname = usePathname();
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.User);

//   // ✅ Extract slug from URL
//   const segments = pathname.split("/");
//   const employeeSlug = segments[2] || "";

//   const dashboardLinks = [
//     {
//       href: `/employee/${employeeSlug}`,
//       label: "Dashboard",
//       icon: <Home className="2xl:w-5 w-4 2xl:h-5 h-4" />,
//     },
//     {
//       href: `/employee/${employeeSlug}/companies`,
//       label: "Companies",
//       icon: <Calendar className="2xl:w-5 w-4 2xl:h-5 h-4" />,
//     },
//     {
//       href: `/employee/${employeeSlug}/attendance`,
//       label: "Attendance",
//       icon: <Calendar1 className="2xl:w-5 w-4 2xl:h-5 h-4" />,
//     },
//   ];

//   // ✅ Extract companyId
//   const parts = pathname.split("/");

//   const companyId = parts[4] || null;

//     const shouldShow =
//     pathname.startsWith(`/employee/${employeeSlug}/company`);
//   const companyDetailsLinks = companyId
//     ? [
//         {
//           href: `/employee/${employeeSlug}/company/${companyId}`,
//           label: "General",
//           icon: <Home className="2xl:w-5 w-4 2xl:h-5 h-4" />,
//         },
//         {
//           href: `/employee/${employeeSlug}/company/${companyId}/clients`,
//           label: "Clients",
//           icon: <PersonStanding className="2xl:w-5 w-4 2xl:h-5 h-4" />,
//         },
//         {
//           href: `/employee/${employeeSlug}/company/${companyId}/invoices`,
//           label: "Invoice",
//           icon: <CardSim className="2xl:w-5 w-4 2xl:h-5 h-4" />,
//         },
//         {
//           href: `/employee/${employeeSlug}/company/${companyId}/contracts`,
//           label: "Contracts",
//           icon: <CardSim className="2xl:w-5 w-4 2xl:h-5 h-4" />,
//         },
//         {
//           href: `/employee/${employeeSlug}/company/${companyId}/templates`,
//           label: "Templates",
//           icon: <NotepadTextDashed className="2xl:w-5 w-4 2xl:h-5 h-4" />,
//         },
//       ]
//     : [];

//   const links = pathname.startsWith(`/employee/${employeeSlug}/company`)
//     ? companyDetailsLinks
//     : dashboardLinks;

//   const handleLogout = async () => {
//     try {
//       const response = await axios.get("/api/logout");
//       if (response.data.success) {
//         dispatch(logout());
//         dispatch(resetTimer());
//         dispatch(resetCheckIn());
//         dispatch(resetCheckOut());
//         router.push("/");
//         toast.success("Logged out successfully");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to logout");
//     }
//   };

//   return (
//     <>
//       <button
//         onClick={() => setOpen(!open)}
//         className="lg:hidden fixed top-28 left-4 z-50 bg-[#5965AB] text-white p-2 rounded-md"
//       >
//         {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//       </button>

//       <aside
//         className={`
//           fixed bg-white shadow-sm flex flex-col z-40 justify-between transition-transform duration-300
//           ${open ? "translate-x-0" : "-translate-x-[130%]"}
//           lg:translate-x-0
//           ${
//             open
//               ? "rounded-none h-screen w-[60%] sm:w-[40%] top-0 left-0 px-6 py-8"
//               : ""
//           }
//           lg:mt-28 lg:2xl:mt-32 lg:rounded-xl lg:px-6 lg:py-8 lg:w-[18%] lg:h-[78vh]
//         `}
//       >
//         <div>
//           <nav className="flex flex-col gap-2 text-xs 2xl:text-lg">
//             {links.map((link) => {
//               const isActive = pathname === link.href;
//               const isDevLink =
//                 link.href.includes("/contracts") ||
//                 link.href.includes("/templates");

//               const handleClick = (e) => {
//                 if (isDevLink) {
//                   e.preventDefault();
//                   toast("This feature is in development", {
//                     icon: "⚠️",
//                   });
//                 }
//               };

//               return (
//                 <a
//                   key={link.href}
//                   href={link.href}
//                   onClick={handleClick}
//                   className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors
//                     ${
//                       isActive
//                         ? "bg-gradient-to-r from-[#5965AB] to-[#60B89E] text-white"
//                         : "text-gray-600 hover:bg-gray-100"
//                     }`}
//                 >
//                   {link.icon} {link.label}
//                 </a>
//               );
//             })}
//           </nav>
//         </div>

//         <div className="flex flex-col gap-2 text-xs 2xl:text-lg">
//            {shouldShow && (
//         <Link
//           href={`/employee/${employeeSlug}`}
//           className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
//         >
//           <ArrowBigLeft className="2xl:w-5 w-4 2xl:h-5 h-4" /> back
//         </Link>
//       )}
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-100"
//           >
//             <LogOut className="2xl:w-5 w-4 2xl:h-5 h-4" /> Log Out
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;

"use client";
import React, { useState } from "react";
import {
  Home,
  Calendar,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Users,
  BanknoteArrowDown,
  HandCoins,
  PersonStanding,
  CardSim,
  NotepadTextDashed,
  Settings,
  Calendar1,
  ArrowBigLeft,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { logout } from "@/features/Slice/UserSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { resetTimer } from "@/features/Slice/StopwatchSlice";
import { resetCheckIn } from "@/features/Slice/CheckInSlice";
import { resetCheckOut } from "@/features/Slice/CheckOutSlice";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.User);

  const segments = pathname.split("/");
  const employeeSlug = segments[2] || "";

  let dashboardLinks = [
    {
      href: `/employee/${employeeSlug}`,
      label: "Dashboard",
      icon: <Home className="2xl:w-5 w-4 2xl:h-5 h-4" />,
    },
    {
      href: `/employee/${employeeSlug}/attendance`,
      label: "Attendance",
      icon: <Calendar1 className="2xl:w-5 w-4 2xl:h-5 h-4" />,
    },
  ];

  if (
    user?.department?.departmentName === "Sales" ||
    user?.department?.departmentName === "sales"
  ) {
    dashboardLinks.splice(1, 0, {
      href: `/employee/${employeeSlug}/companies`,
      label: "Companies",
      icon: <Calendar className="2xl:w-5 w-4 2xl:h-5 h-4" />,
    });
  }

  const parts = pathname.split("/");
  const companyId = parts[4] || null;

  const shouldShow = pathname.startsWith(`/employee/${employeeSlug}/company`);

  const companyDetailsLinks = companyId
    ? [
        {
          href: `/employee/${employeeSlug}/company/${companyId}`,
          label: "General",
          icon: <Home className="2xl:w-5 w-4 2xl:h-5 h-4" />,
        },
        {
          href: `/employee/${employeeSlug}/company/${companyId}/clients`,
          label: "Clients",
          icon: <PersonStanding className="2xl:w-5 w-4 2xl:h-5 h-4" />,
        },
        {
          href: `/employee/${employeeSlug}/company/${companyId}/invoices`,
          label: "Invoice",
          icon: <CardSim className="2xl:w-5 w-4 2xl:h-5 h-4" />,
        },
        {
          href: `/employee/${employeeSlug}/company/${companyId}/contracts`,
          label: "Contracts",
          icon: <CardSim className="2xl:w-5 w-4 2xl:h-5 h-4" />,
        },
      ]
    : [];

  const links = pathname.startsWith(`/employee/${employeeSlug}/company`)
    ? companyDetailsLinks
    : dashboardLinks;

  const handleLogout = async () => {
    try {
      const response = await axios.get("/api/logout");
      if (response.data.success) {
        dispatch(logout());
        // dispatch(resetTimer());
        // dispatch(resetCheckIn());
        // dispatch(resetCheckOut());
        router.push("/");
        toast.success("Logged out successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to logout");
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-28 left-4 z-50 bg-[#5965AB] text-white p-2 rounded-md"
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside
        className={`
          fixed bg-white shadow-sm flex flex-col z-40 justify-between transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-[130%]"}
          lg:translate-x-0
          ${
            open
              ? "rounded-none h-screen w-[60%] sm:w-[40%] top-0 left-0 px-6 py-8"
              : ""
          }
          lg:mt-28 lg:2xl:mt-32 lg:rounded-xl lg:px-6 lg:py-8 lg:w-[18%] lg:h-[78vh]
        `}
      >
        <div>
          <nav className="flex flex-col gap-2 text-xs 2xl:text-lg">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const isDevLink =
                link.href.includes("/contracts") ||
                link.href.includes("/templates");

              const handleClick = (e) => {
                if (isDevLink) {
                  e.preventDefault();
                  toast("This feature is in development", { icon: "⚠️" });
                }
              };

              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleClick}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors
                    ${
                      isActive
                        ? "bg-gradient-to-r from-[#5965AB] to-[#60B89E] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {link.icon} {link.label}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-2 text-xs 2xl:text-lg">
          {shouldShow && (
            <Link
              href={`/employee/${employeeSlug}`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <ArrowBigLeft className="2xl:w-5 w-4 2xl:h-5 h-4" /> Back
            </Link>
          )}

          <Link
            href={`/employee/${employeeSlug}/mark-attendance`}
            className="flex items-center bg-[#5965AB] px-3 py-2  rounded-lg text-white"
          >
            Mark Attendance
          </Link>

          <Link
            href={`/employee/${employeeSlug}/settings`}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <Settings className="2xl:w-5 w-4 2xl:h-5 h-4" /> Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-100"
          >
            <LogOut className="2xl:w-5 w-4 2xl:h-5 h-4" /> Log Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
