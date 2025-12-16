import React from "react";
import Bankdailog from "../dialog/Bankdailog";
import ExpensesDialog from "../dialog/Expensesdailog";

const Accountsbreadcrumbs = ({ path, path2 }) => {
    const [open, setOpen] = React.useState(false);
    return (
        <div className="bg-white px-6 py-4 mb-5 rounded-xl flex justify-between items-center ">
            {/* Left - Company Name */}
            <div className="flex flex-col gap-0">
                <h2 className="text-lg font-semibold text-gray-700">{path ? path : path2}</h2>
                <p className="text-gray opacity-80 text-xs">
                    home {path ? `> ${path.toLowerCase()}` : ""}
                    {path2 ? `> ${path2.toLowerCase()}` : ""}
                </p>
            </div>

            {path2 === "Banks" ? (
                <Bankdailog open={open} setOpen={setOpen} />
            ) : path2 === "Expenses" ? (
                <ExpensesDialog />
            ) : null}
        </div>
    );
};

export default Accountsbreadcrumbs;
