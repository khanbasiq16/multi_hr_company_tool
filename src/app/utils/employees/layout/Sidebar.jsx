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

//   const segments = pathname.split("/");
//   const employeeSlug = segments[2] || "";

//   let dashboardLinks = [
//     {
//       href: `/employee/${employeeSlug}`,
//       label: "Dashboard",
//       icon: <Home className="2xl:w-5 w-4 2xl:h-5 h-4" />,
//     },
//     {
//       href: `/employee/${employeeSlug}/attendance`,
//       label: "Attendance",
//       icon: <Calendar1 className="2xl:w-5 w-4 2xl:h-5 h-4" />,
//     },
//   ];

//   if (
//     user?.department?.departmentName === "Sales" ||
//     user?.department?.departmentName === "sales"
//   ) {
//     dashboardLinks.splice(1, 0, {
//       href: `/employee/${employeeSlug}/companies`,
//       label: "Companies",
//       icon: <Calendar className="2xl:w-5 w-4 2xl:h-5 h-4" />,
//     });
//   }

//   const parts = pathname.split("/");
//   const companyId = parts[4] || null;

//   const shouldShow = pathname.startsWith(`/employee/${employeeSlug}/company`);

//   const companyDetailsLinks = companyId
//     ? [
//       {
//         href: `/employee/${employeeSlug}/company/${companyId}`,
//         label: "General",
//         icon: <Home className="2xl:w-5 w-4 2xl:h-5 h-4" />,
//       },
//       {
//         href: `/employee/${employeeSlug}/company/${companyId}/clients`,
//         label: "Clients",
//         icon: <PersonStanding className="2xl:w-5 w-4 2xl:h-5 h-4" />,
//       },
//       {
//         href: `/employee/${employeeSlug}/company/${companyId}/invoices`,
//         label: "Invoice",
//         icon: <CardSim className="2xl:w-5 w-4 2xl:h-5 h-4" />,
//       },
//       {
//         href: `/employee/${employeeSlug}/company/${companyId}/contracts`,
//         label: "Contracts",
//         icon: <CardSim className="2xl:w-5 w-4 2xl:h-5 h-4" />,
//       },
//     ]
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
//         className="lg:hidden fixed top-24  right-4 z-50 bg-[#5965AB] text-white p-2 rounded-md shadow-md"
//       >
//         {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//       </button>

//       <aside
//         className={`
//          fixed top-0 mt-24 ml-0 lg:ml-5 left-0 z-40   bg-white shadow-sm flex flex-col justify-between 
//     transition-transform duration-300 ease-in-out  rounded-lg 

//      w-[60%] sm:w-[55%] 
//     px-6 py-8

//     ${open ? "translate-x-4" : "-translate-x-full"}

//     /* Desktop */
//     lg:translate-x-0
//     lg:fixed
//     lg:w-[20%]
//     lg:h-[78vh]
//     lg:rounded-xl
//     lg:mt-28
//     lg:px-6
//     lg:py-8

//     xl:w-[20%]
//     xl:h-[80vh]
//     xl:rounded-xl
//     xl:mt-28
//     xl:px-6
//     xl:py-8



//         `}
//       >
//         <div>
//           <nav className="flex flex-col gap-2 text-sm md:text-base 2xl:text-lg">
//             {links.map((link) => {
//               const isActive = pathname === link.href;
//               const isDevLink =
//                 link.href.includes("/contracts") ||
//                 link.href.includes("/templates");

//               const handleClick = (e) => {
//                 if (isDevLink) {
//                   e.preventDefault();
//                   toast("This feature is in development", { icon: "⚠️" });
//                 }
//               };

//               return (
//                 <a
//                   key={link.href}
//                   href={link.href}
//                   onClick={handleClick}
//                   className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors
//                     ${isActive
//                       ? "bg-gradient-to-r from-[#5965AB] to-[#60B89E] text-white"
//                       : "text-gray-600 hover:bg-gray-100"
//                     }`}
//                 >
//                   {link.icon} {link.label}
//                 </a>
//               );
//             })}
//           </nav>
//         </div>

//         <div className="flex flex-col gap-2 text-sm md:text-base 2xl:text-lg mt-6">
//           {shouldShow && (
//             <Link
//               href={`/employee/${employeeSlug}`}
//               className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
//             >
//               <ArrowBigLeft className="2xl:w-5 w-4 2xl:h-5 h-4" /> Back
//             </Link>
//           )}

//           <Link
//             href={`/employee/${employeeSlug}/mark-attendance`}
//             className="flex items-center bg-[#5965AB] px-3 py-2  rounded-lg text-white"
//           >
//             Mark Attendance
//           </Link>

//           <Link
//             href={`/employee/${employeeSlug}/settings`}
//             className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
//           >
//             <Settings className="2xl:w-5 w-4 2xl:h-5 h-4" /> Settings
//           </Link>
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
  LogOut,
  Menu,
  X,
  Users,
  BanknoteArrowDown,
  PersonStanding,
  CardSim,
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
      icon: <Home className="w-4 h-4 2xl:w-5 2xl:h-5" />,
    },
    {
      href: `/employee/${employeeSlug}/attendance`,
      label: "Attendance",
      icon: <Calendar1 className="w-4 h-4 2xl:w-5 2xl:h-5" />,
    },
  ];

  // Add Companies if Sales
  if (
    user?.department?.departmentName?.toLowerCase() === "sales"
  ) {
    dashboardLinks.splice(1, 0, {
      href: `/employee/${employeeSlug}/companies`,
      label: "Companies",
      icon: <Calendar className="w-4 h-4 2xl:w-5 2xl:h-5" />,
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
        icon: <Home className="w-4 h-4 2xl:w-5 2xl:h-5" />,
      },
      {
        href: `/employee/${employeeSlug}/company/${companyId}/clients`,
        label: "Clients",
        icon: <PersonStanding className="w-4 h-4 2xl:w-5 2xl:h-5" />,
      },
      {
        href: `/employee/${employeeSlug}/company/${companyId}/invoices`,
        label: "Invoice",
        icon: <CardSim className="w-4 h-4 2xl:w-5 2xl:h-5" />,
      },
      {
        href: `/employee/${employeeSlug}/company/${companyId}/contracts`,
        label: "Contracts",
        icon: <CardSim className="w-4 h-4 2xl:w-5 2xl:h-5" />,
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
        dispatch(resetTimer());
        dispatch(resetCheckIn());
        dispatch(resetCheckOut());
        router.push("/");
        toast.success("Logged out successfully");
      }
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-24  right-4 z-50 bg-[#5965AB] text-white p-2 rounded-md shadow-md"
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
            fixed top-0 mt-24 ml-0 lg:ml-5 left-0 z-40   bg-white shadow-sm flex flex-col justify-between 
    transition-transform duration-300 ease-in-out  rounded-lg 

    
     w-[60%] sm:w-[55%] 
    px-6 py-8
    
    ${open ? "translate-x-4" : "-translate-x-full"}

    /* Desktop */
    lg:translate-x-0
    lg:fixed
    lg:w-[20%]
    lg:h-[78vh]
    lg:rounded-xl
    lg:mt-28
    lg:px-6
    lg:py-8

    xl:w-[20%]
    xl:h-[80vh]
    xl:rounded-xl
    xl:mt-28
    xl:px-6
    xl:py-8

        `}
      >
        {/* Navigation */}
        <div>
          <nav className="flex flex-col gap-2 text-sm md:text-base ">
            {links.map((link) => {
              const isActive = pathname === link.href;

              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition
                    ${isActive
                      ? "bg-gradient-to-r from-[#5965AB] to-[#60B89E] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  {link.icon} {link.label}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-2 text-sm md:text-base 2xl:text-lg mt-6">
          {shouldShow && (
            <Link
              href={`/employee/${employeeSlug}`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <ArrowBigLeft className="w-4 h-4 2xl:w-5 2xl:h-5" /> Back
            </Link>
          )}

          <Link
            href={`/employee/${employeeSlug}/mark-attendance`}
            className="flex items-center bg-[#5965AB] px-3 py-2 rounded-lg text-white"
          >
            Mark Attendance
          </Link>

          <Link
            href={`/employee/${employeeSlug}/settings`}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <Settings className="w-4 h-4 2xl:w-5 2xl:h-5" /> Settings
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-100"
          >
            <LogOut className="w-4 h-4 2xl:w-5 2xl:h-5" /> Log Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
