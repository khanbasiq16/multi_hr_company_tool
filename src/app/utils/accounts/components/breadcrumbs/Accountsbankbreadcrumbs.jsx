"use client";
import React, { useState } from "react";

import { useParams } from "next/navigation";
import TransferDialog from "../dialog/Transferdialog";
import Loandialog from "../dialog/Loandialog";

const Accountsbankbreadcrumbs = ({ path, bank, setBank }) => {
    const { slug, bankslug } = useParams();


    return (
        <div className="bg-white px-6 py-4 mb-5 rounded-xl flex justify-between items-center ">
            {/* Left - Company Name */}
            <div className="flex flex-col gap-0">
                <h2 className="text-lg font-semibold text-gray-700">{path}</h2>
                <p className="text-gray opacity-80 text-xs">
                    accounts {">"}{" "}
                    {slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toLowerCase())} {">"}{" "}
                    {bankslug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toLowerCase())} {">"}{" "}
                    {path.toLowerCase()}
                </p>
            </div>

            {path === "Transfer" ? (
                <TransferDialog bank={bank} setBank={setBank} />
            ) :
                path === "Loans" ? (
                    <Loandialog bank={bank} setBank={setBank} />
                ) : null}
        </div>
    );
};

export default Accountsbankbreadcrumbs;
