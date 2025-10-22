import React from "react";


const Employeebreadcrumb = ({  slug ,  path , path2 }) => {
  return (
    <div className="bg-white p-6 mb-5 rounded-xl flex justify-between items-center h-[15vh]">
      {/* Left - Company Name */}
      <div className="flex flex-col gap-0">
        <h2 className="text-lg font-semibold text-gray-700">{path}</h2>
        <p className="text-gray opacity-80 text-xs">
          home {">"} {slug.replace(/-/g, " ")} {">"} {path.toLowerCase()} {path2 ? `> ${path2.toLowerCase()}` : ""}
        </p>
      </div>

     
    </div>
  );
};

export default Employeebreadcrumb;
