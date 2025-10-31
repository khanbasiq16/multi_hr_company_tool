"use client";

import React from "react";

const FormPreview = ({ fields, company }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      {/* Company Header */}
      {company && (
        <div className="flex justify-between items-center border-b pb-4">
          <div className="flex items-center gap-3">
            {company.companyLogo && (
              <img
                src={company.companyLogo}
                alt="Company Logo"
                className="w-12 h-12 object-contain"
              />
            )}
            <h3 className="text-xl font-bold text-gray-800">
              {company.name || "Company Name"}
            </h3>
          </div>
          <div className="text-right text-sm text-gray-600">
            {company.companyAddress && <div>{company.companyAddress}</div>}
            {company.companyPhoneNumber && <div>📞 {company.companyPhoneNumber}</div>}
            {company.companyWebsite && (
              <a
                href={company.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-500"
              >
                🌐 {company.companyWebsite.replace(/(^\w+:|^)\/\//, "").replace(/\/$/, "")}
              </a>
            )}
          </div>
        </div>
      )}

      {/* Fields */}
      {fields
        .filter((f) => f.type !== "company_info_block")
        .map((field) => (
          <div key={field.id} className="space-y-2">
            <p className="font-medium">{field.question}</p>
            {field.type === "short_answer" && <input disabled className="border p-2 w-full rounded" />}
            {field.type === "paragraph" && (
              <textarea disabled className="border p-2 w-full rounded h-20" />
            )}
            {field.type === "multiple_choice" &&
              field.options.map((opt, i) => (
                <label key={i} className="block">
                  <input type="radio" disabled className="mr-2" /> {opt}
                </label>
              ))}
            {field.type === "checkboxes" &&
              field.options.map((opt, i) => (
                <label key={i} className="block">
                  <input type="checkbox" disabled className="mr-2" /> {opt}
                </label>
              ))}
            {field.type === "dropdown" && (
              <select disabled className="border p-2 w-full rounded">
                {field.options.map((opt, i) => (
                  <option key={i}>{opt}</option>
                ))}
              </select>
            )}
            {field.type === "date" && <input type="date" disabled className="border p-2 w-full rounded" />}
            {field.type === "file_upload" && <input type="file" disabled className="border p-2 w-full rounded" />}
            {field.type === "signature" && (
              <div className="border-dashed border p-4 text-center text-gray-400 italic">
                Signature Field
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default FormPreview;
