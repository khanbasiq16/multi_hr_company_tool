"use client";
import React from "react";

import { useParams } from "next/navigation";
import Clientdialog from "../dialog/Clientdialog";
import Invoicedialog from "../dialog/Invoicedialog";
import TemplateDialog from "../dialog/TemplateDialog";
import ContractDialog from "../dialog/ContractsDialog";

const Companybreadcumbs = ({ path }) => {
  const { id } = useParams();

  return (
    <div className="bg-white p-6 mb-5 rounded-xl flex justify-between items-center h-[10vh]">
      {/* Left - Company Name */}
      <div className="flex flex-col gap-0">
        <h2 className="text-lg font-semibold text-gray-700">{path}</h2>
        <p className="text-gray opacity-80 text-xs">
          home {">"}{" "}
          {id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} {">"}{" "}
          {path.toLowerCase()}
        </p>
      </div>

      {path === "Clients" ? (
        <Clientdialog />
      ) : path === "Invoices" ? (
        <Invoicedialog />
      ) : path === "Expense" ? (
        <Expensedailog />
      ) : path === "Contracts" ? (
        <ContractDialog />
      ) : null}
    </div>
  );
};

export default Companybreadcumbs;
