"use client"
import Accountslayout from "@/app/utils/accounts/layout/Accountslayout";
import { Users, UserPlus, CreditCard, Settings, ArrowUpRight, Bell, Landmark, BanknoteArrowDown } from "lucide-react";

const Page = () => {
    return (
        <Accountslayout>
            <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 p-6">

                {/* Top Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Accounts Dashboard</h1>

                </div>

                {/* Cards Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    <DashboardCard icon={<Landmark />} title="Total Banks" value="1,245" growth="+12%" />
                    <DashboardCard icon={<CreditCard />} title="Active Accounts" value="78" growth="+4%" />
                    <DashboardCard icon={<CreditCard />} title="Inactive Accounts" value="860" growth="+8%" />
                    <DashboardCard icon={<BanknoteArrowDown />} title="Total Transaction" value="23" growth="-2%" negative />

                </div>

                {/* Table Area */}
                <div className="mt-10 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold border-b pb-3 text-gray-800 dark:text-gray-200">
                        Recent Account Activity
                    </h2>

                    <table className="w-full mt-4">
                        <thead>
                            <tr className="text-gray-600 dark:text-gray-300 text-sm uppercase">
                                <th className="p-3 text-left">User</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {["Ali", "Hamza", "Usman", "Areeba"].map((name, i) => (
                                <tr key={i} className="border-b hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                                    <td className="px-3 py-2 text-gray-800 dark:text-gray-200">{name}</td>
                                    <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{name.toLowerCase()}@gmail.com</td>
                                    <td className="px-3 py-2">
                                        <span className="px-3 py-1 rounded-full bg-green-200 text-green-700 text-xs">Active</span>
                                    </td>
                                    <td className="px-3 py-2">
                                        <button className="text-blue-500 hover:underline">View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Accountslayout>
    );
};

export default Page;



const DashboardCard = ({ icon, title, value, growth, negative }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 hover:shadow-lg transition transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">{icon}</div>
            <ArrowUpRight
                size={20}
                className={`${negative ? "text-red-500" : "text-green-500"}`}
            />
        </div>
        <h3 className="text-gray-600 dark:text-gray-300 text-sm">{title}</h3>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</h2>
        <p className={`text-sm ${negative ? "text-red-500" : "text-green-500"}`}>{growth}</p>
    </div>
);
