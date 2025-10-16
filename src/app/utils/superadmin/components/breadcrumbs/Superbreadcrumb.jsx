import React from "react";
import Companydailog from "../dialog/Companydailog";
import Employeedailog from "../dialog/Employeedailog";
import Expensedailog from "../dialog/Expensedailog";


const Superbreadcrumb = ({ path , path2 }) => {
  return (
    <div className="bg-white p-6 mb-5 rounded-xl flex justify-between items-center h-[10vh]">
      {/* Left - Company Name */}
      <div className="flex flex-col gap-0">
        <h2 className="text-lg font-semibold text-gray-700">{path}</h2>
        <p className="text-gray opacity-80 text-xs">
          home {">"} {path.toLowerCase()} {path2 ? `> ${path2.toLowerCase()}` : ""}
        </p>
      </div>

      {path === "Companies" ? (
        <Companydailog />
      ) : path === "Employees" ? (
        <Employeedailog />
      ) : path === "Expense" ? (
        <Expensedailog />
      ) : null}
    </div>
  );
};

export default Superbreadcrumb;
