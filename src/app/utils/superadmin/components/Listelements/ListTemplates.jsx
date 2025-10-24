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
          console.log(res?.data?.templates)
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
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md cursor-pointer transition-all"
              >
                <h3 className="font-semibold text-lg text-gray-800">
                  {template.role} Template
                </h3>
                {template.company && (
                  <p className="text-sm text-gray-500">
                    Company: {template.company}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ListTemplates;
