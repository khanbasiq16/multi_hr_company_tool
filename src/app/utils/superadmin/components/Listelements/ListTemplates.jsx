"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import { createtemplate } from "@/features/Slice/TemplateSlice";
import TemplateDialog from "../dialog/TemplateDialog";

const ListTemplates = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();
  const { templates } = useSelector((state) => state.Templates);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get("/api/templates/get");
        if (res.data.success) {
          console.log(res?.data?.templates);
          dispatch(createtemplate(res?.data?.templates || []));
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-md flex flex-col h-[64vh] overflow-auto">
        {loading ? (
          <p className="text-center text-gray-500">Loading templates...</p>
        ) : templates.length === 0 ? (
          <div className="flex h-full justify-center items-center">
            <TemplateDialog />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => router.push(`/template-editor/${template.id}`)}
                className="group bg-white dark:bg-gray-900 p-5 border border-gray-200 dark:border-gray-700 rounded-2xl  transition-all cursor-pointer "
              >
                {/* Company Logo */}
                <div className="flex justify-center mb-4">
                  <img
                    src={
                      template.company.companyLogo || "/placeholder-logo.png"
                    }
                    alt={`${template.company.name} logo`}
                    className="w-16 h-16    transition-transform duration-300"
                  />
                </div>

                {/* Template Title */}
                <h3 className="font-semibold text-lg text-center text-gray-800 dark:text-gray-100 mb-2">
                  {template.company.name} Template
                </h3>

                {/* Company Info */}
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-3">
                  Company:{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {template.company.name}
                  </span>
                </p>

                {/* Footer Buttons or Tags */}
                <div className="flex justify-center">
                  <span className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded-full font-medium">
                    {template.role === "Admin"
                      ? "Contracts"
                      : "Employee letter"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ListTemplates;
