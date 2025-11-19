"use client";
import React from "react";
import Clientdialog from "../dialog/Clientdialog";
import Invoicedialog from "../dialog/Invoicedialog";
import Contractdialog from "../dialog/Contractdialog";

const Employeecompbreadcrumb = ({ slug, path, path2 }) => {
  return (
    <>
      <div className="bg-white p-6 mb-5 rounded-xl flex justify-between items-center h-[13vh]">
        {/* Left - Company Name */}
        <div className="flex flex-col gap-0">
          <h2 className="text-lg font-semibold text-gray-700">{path2}</h2>
          <p className="text-gray opacity-80 text-xs">
            home {">"} {slug.replace(/-/g, " ")} {">"}{" "}
            {path.toLowerCase().replace(/-/g, " ")}{" "}
            {path2 ? `> ${path2.toLowerCase()}` : ""}
          </p>
        </div>

        {path2 === "Clients" ? (
          <Clientdialog />
        ) : path2 === "Invoices" ? (
          <Invoicedialog />
        ) : path2 === "Contracts" ? (
          <Contractdialog />
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Employeecompbreadcrumb;
