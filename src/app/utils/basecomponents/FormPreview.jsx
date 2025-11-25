"use client";
import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Building, Globe, Phone } from "lucide-react";

const FormPreview = ({ fields = [], company, onUpdate }) => {
  const sigCanvasRef = useRef({});

  const handleClear = (id) => {
    sigCanvasRef.current[id].clear();
    onUpdate(id, { signatureData: "" });
  };

  const handleSave = (id) => {
    const sigData = sigCanvasRef.current[id].toDataURL("image/png");
    onUpdate(id, { signatureData: sigData });
  };

  return (
    <div className="relative bg-white rounded-lg shadow p-6 space-y-6 overflow-hidden">
      {/* 🖋️ Company Watermark */}
      {company?.name && (
        <div
          className="absolute inset-0 flex justify-center items-center pointer-events-none select-none"
          style={{
            opacity: 0.08,
            filter: "grayscale(100%)",
            fontSize: "7rem",

            fontWeight: "bold",
            color: "#000",
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          {company.name}
        </div>
      )}

      {/* ✅ Company Info Block */}
      {company && (
        <div className="flex justify-between items-center border-b pb-4 relative z-10">
          <div className="flex flex-col items-start gap-2">
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

          {/* Right Section */}
          <div className="text-right text-sm text-gray-700 space-y-1 leading-relaxed">
            {company.companyAddress && (
              <div className="flex items-center justify-end gap-2 text-gray-600">
                <span className="text-gray-400 text-base">
                  <Building size={15} />
                </span>
                <span>{company.companyAddress}</span>
              </div>
            )}

            {company.companyPhoneNumber && (
              <div className="flex items-center justify-end gap-2 text-gray-600">
                <span className="text-gray-400 text-base">
                  <Phone size={15} />
                </span>
                <span>{company.companyPhoneNumber}</span>
              </div>
            )}

            {company.companyWebsite && (
              <div className="flex items-center justify-end gap-2 text-gray-600">
                <span className="text-gray-400 text-base">
                  <Globe size={15} />
                </span>
                <a
                  href={company.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline underline-offset-2 transition-colors"
                >
                  {company.companyWebsite
                    .replace(/(^\w+:|^)\/\//, "")
                    .replace(/\/$/, "")}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✅ Render Fields */}
      <div className="relative z-10">
        {fields
          .filter((f) => f.type !== "company_info_block")
          .map((field) => (
            <div key={field.id} className="space-y-2 pb-4 last:border-none">
              {/* Short Answer */}
              {field.type === "short_answer" && (
                <p className="text-gray-700">
                  {field.question} : {field.answer || "—"}
                </p>
              )}

              {/* Paragraph */}
              {field.type === "paragraph" && (
                <>
                  <p className="font-medium text-gray-800">{field.question}</p>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {field.answer || "—"}
                  </p>
                </>
              )}


              {/* Multiple Choice */}
              {field.type === "multiple_choice" && (
                <>
                  <p className="font-medium text-gray-800">{field.question}</p>
                  <div>
                    {field.options.map((opt, i) => (
                      <label key={i} className="block text-gray-700">
                        <input
                          type="radio"
                          name={field.id}
                          className="mr-2"
                          checked={field.answer === opt}
                          readOnly
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </>
              )}

              {/* Checkboxes */}
              {field.type === "checkboxes" && (
                <>
                  <p className="font-medium text-gray-800">{field.question}</p>
                  <div>
                    {field.options.map((opt, i) => (
                      <label key={i} className="block text-gray-700">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={
                            Array.isArray(field.answer) &&
                            field.answer.includes(opt)
                          }
                          readOnly
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </>
              )}



              {field.type === "dropdown" && (
                <>
                  {/* If answer exists → show text */}
                  {field.answer ? (
                    <div className="text-gray-700 font-semibold">{field.answer}</div>
                  ) : (
                    /* If no answer → show selectable dropdown */
                    <div className="flex flex-col w-full gap-2">
                      <label className="text-gray-700 font-semibold">
                        {field.question || "Select an option"}
                      </label>

                      <select
                        className="border rounded p-2 text-gray-700"
                        value={field.answer || ""}
                        onChange={(e) =>
                          onUpdate(field.id, { answer: e.target.value })
                        }
                      >
                        <option value="">Select...</option>

                        {field.options?.map((opt, idx) => (
                          <option key={idx} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}




              {field.type === "date" && (
                <>
                 
                  {field.answer ? (
                    <div className="flex w-full justify-start">
                      <p className="text-gray-700 font-semibold mr-2">
                        {field.question || "—"} :
                      </p>
                      <p className="text-gray-700">{field.answer}</p>
                    </div>
                  ) : (
                    /* If no answer → show date input */
                    <div className="flex flex-col w-full gap-2">
                      <label className="text-gray-700 font-semibold">
                        {field.question || "Select Date"}
                      </label>

                      <input
                        type="date"
                        className="border rounded p-2 w-full text-gray-700"
                        value={field.answer || ""}
                        onChange={(e) =>
                          onUpdate(field.id, { answer: e.target.value })
                        }
                      />
                    </div>
                  )}
                </>
              )}


              {field.type === "appendix" && (
                <div className="space-y-2">
                  <p className="font-medium text-gray-800">{field.question}</p>
                  <textarea
                    className="w-full border border-gray-300 rounded p-2 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    placeholder="Type your Appendix here..."
                    value={field.answer || field.defaultText || ""}
                    onChange={(e) =>
                      onUpdate(field.id, { answer: e.target.value })
                    }
                    rows={3}
                  />
                </div>
              )}

              {/* ✅ Signature (Editable) */}
              {field.type === "signature" && (
                <>
                  {field.signatureType === "pad" ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <p className="font-medium text-gray-800">
                        {field.question}
                      </p>
                      {/* Signature pad */}
                      <SignatureCanvas
                        ref={(ref) => (sigCanvasRef.current[field.id] = ref)}
                        penColor="black"
                        canvasProps={{
                          className:
                            "border border-gray-300 rounded w-full sm:w-[60%] h-40",
                        }}
                        onEnd={() => handleSave(field.id)}
                      />

                      {/* Buttons aligned in a row */}
                      <div className="flex flex-row gap-2 mt-3 sm:mt-0">
                        <button
                          onClick={() => handleClear(field.id)}
                          className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                        >
                          Clear
                        </button>
                        <button
                          onClick={() => handleSave(field.id)}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <p className="font-medium text-gray-800">
                        {field.question}
                      </p>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Type your signature"
                          value={field.typedSignature || ""}
                          onChange={(e) =>
                            onUpdate(field.id, {
                              typedSignature: e.target.value,
                            })
                          }
                          className="w-full border rounded p-2"
                        />
                      </div>

                      <div className="flex-1">
                        <Select
                          value={field.fontFamily || "Allura"}
                          onValueChange={(value) =>
                            onUpdate(field.id, { fontFamily: value })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Font" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Allura">
                              <span style={{ fontFamily: "Allura" }}>
                                Allura
                              </span>
                            </SelectItem>
                            <SelectItem value="Great Vibes">
                              <span style={{ fontFamily: "Great Vibes" }}>
                                Great Vibes
                              </span>
                            </SelectItem>
                            <SelectItem value="Dancing Script">
                              <span style={{ fontFamily: "Dancing Script" }}>
                                Dancing Script
                              </span>
                            </SelectItem>
                            <SelectItem value="Pacifico">
                              <span style={{ fontFamily: "Pacifico" }}>
                                Pacifico
                              </span>
                            </SelectItem>
                            <SelectItem value="Cedarville Cursive">
                              <span
                                style={{ fontFamily: "Cedarville Cursive" }}
                              >
                                Cedarville Cursive
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Preview */}
                      <p
                        className="text-3xl text-gray-700 mt-2 sm:mt-0"
                        style={{ fontFamily: field.fontFamily || "Allura" }}
                      >
                        {field.typedSignature || "—"}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
      </div>

      {/* ✅ Footer Section */}
      <div className="relative z-10 mt-10 border-t pt-6 text-gray-600 text-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Company Info */}
        <div className="text-center sm:text-left space-y-1">
          {company?.companyAddress && <p>{company.companyAddress}</p>}
        </div>

        {/* Copyright + Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} {company?.name || "Your Company"}. All
            rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormPreview;
