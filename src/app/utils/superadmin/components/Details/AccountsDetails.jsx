"use client";
import React from "react";
import EditClient from "../dialog/EditClient";
import EditAccounts from "../dialog/EditAccounts";

const AccountsDetails = ({ accounts, setAccounts }) => {
    if (!accounts) return null;

    return (
        <div className="mx-auto bg-white shadow-sm rounded-2xl p-8 border border-gray-200">
            <div className="space-y-6">



                <div className="flex items-center justify-between border-b pb-4">
                    {/* Left Section — Client Name + ID */}
                    <div className="flex flex-col items-start">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            {accounts.accountuserName}
                        </h2>
                        <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                            ID: {accounts.id}
                        </span>
                    </div>

                    {/* Right Section — Edit Button */}
                    <EditAccounts accounts={accounts} setAccounts={setAccounts} />
                </div>
                {/* Info Grid */}
                <div className="grid grid-cols-3 gap-6 text-gray-700">

                    {/* Column 1 */}
                    <div className="space-y-3">
                        <Info label="Email" value={accounts.accountuseremail} />
                        <Info label="Phone" value={accounts.accountuserphone} />
                        <Info label="Address" value={accounts.accountuseraddress} />
                    </div>


                </div>

                {/* Footer */}
                <div className="col-span-2 mt-4 border-t pt-4">
                    <p className="text-sm text-gray-500">
                        Created At:{" "}
                        {new Date(accounts.createdAt).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
};

// Reusable Field Component
const Info = ({ label, value }) => (
    <p>
        <span className="font-medium text-gray-800">{label}:</span>{" "}
        <span className="text-gray-600">{value || "N/A"}</span>
    </p>
);

export default AccountsDetails;
