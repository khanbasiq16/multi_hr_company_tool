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

const ViewContractdetails = ({ fields = [], company, onUpdate }) => {
  const sigCanvasRef = useRef({});

  const handleClear = (id) => {
    sigCanvasRef.current[id]?.clear();
    onUpdate(id, { signatureData: "" });
  };

  const handleSave = (id) => {
    const sigData = sigCanvasRef.current[id]?.toDataURL("image/png");
    onUpdate(id, { signatureData: sigData });
  };

  return (
    <div className="relative bg-gradient-to-b max-w-[794px] from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 rounded-2xl  p-8 space-y-8 overflow-hidden border border-gray-200 dark:border-gray-800">
      {/* 🖋️ Watermark */}
      {company?.name && (
        <div
          className="absolute inset-0 flex justify-center items-center pointer-events-none select-none"
          style={{
            opacity: 0.05,
            fontSize: "10rem",
            fontWeight: "900",
            color: "#000000",
            transform: "rotate(-25deg)",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            letterSpacing: "0.5rem",
          }}
        >
          {company.name}
        </div>
      )}

      {/* 🏢 Company Header */}
      {company && (
        <header className="relative z-10 flex justify-between items-center border-b pb-6">
          <div className="flex items-center gap-4">
            {company.companyLogo && (
              <img
                src={company.companyLogo}
                alt="Company Logo"
                className="w-16 h-16 object-contain rounded-lg   dark:border-gray-700 bg-white"
              />
            )}
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
                {company.name || "Company Name"}
              </h1>
              {company.companyEmail && (
                <p className="text-sm text-gray-500">{company.companyEmail}</p>
              )}
            </div>
          </div>

          <div className="text-right text-sm text-gray-700 dark:text-gray-300 space-y-1">
            {company.companyAddress && (
              <div className="flex items-center justify-end gap-2">
                <Building size={15} className="text-gray-400" />
                <span>{company.companyAddress}</span>
              </div>
            )}
            {company.companyPhoneNumber && (
              <div className="flex items-center justify-end gap-2">
                <Phone size={15} className="text-gray-400" />
                <span>{company.companyPhoneNumber}</span>
              </div>
            )}
            {company.companyWebsite && (
              <div className="flex items-center justify-end gap-2">
                <Globe size={15} className="text-gray-400" />
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
        </header>
      )}

      {/* 📜 Fields */}
      <section className="relative z-10 space-y-6">
        {fields
          .filter((f) => f.type !== "company_info_block")
          .map((field) => (
            <div
              key={field.id}
              className="p-4  dark:border-gray-700   transition-all duration-200"
            >
              {/* Short Answer */}
              {field.type === "short_answer" && (
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                    {field.question}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {field.answer || "—"}
                  </p>
                </div>
              )}

              {/* Paragraph */}
              {field.type === "paragraph" && (
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                    {field.question}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {field.answer || "—"}
                  </p>
                </div>
              )}

              {/* Multiple Choice */}
              {field.type === "multiple_choice" && (
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                    {field.question}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {field.answer || "—"}
                  </p>
                </div>
              )}

              {/* Checkboxes */}
              {field.type === "checkboxes" && (
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                    {field.question}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {Array.isArray(field.answer) && field.answer.length > 0
                      ? field.answer.join(", ")
                      : "—"}
                  </p>
                </div>
              )}

              {/* Dropdown */}
              {field.type === "dropdown" && (
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                    {field.question}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {field.answer || "—"}
                  </p>
                </div>
              )}

              {/* Date */}
              {field.type === "date" && (
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                    {field.question}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {field.answer || "—"}
                  </p>
                </div>
              )}

              {/* Appendix */}
              {field.type === "appendix" && field.answer && (
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                    {field.question}
                  </p>

                  <p className="text-gray-700 dark:text-gray-300">
                    {field.answer}
                  </p>
                </div>
              )}

              {/* Signature */}
              {/* {field.type === "signature" && (
                <>
                  {field.signatureType === "pad" ? (
                    <div className="flex flex-col gap-3">
                      <p className="font-semibold text-gray-800 dark:text-gray-100">
                        {field.question}
                      </p>

                      {field.signatureData ? (
                        // ✅ If signature already saved — show only image
                        <img
                          src={field.signatureData}
                          alt="Signature"
                          className="border border-gray-300 dark:border-gray-600 rounded-lg w-full h-44 object-contain bg-white dark:bg-gray-900"
                        />
                      ) : (
                        // 📝 If no signature — show SignatureCanvas + buttons
                        <>
                          <SignatureCanvas
                            ref={(ref) =>
                              (sigCanvasRef.current[field.id] = ref)
                            }
                            penColor="black"
                            canvasProps={{
                              className:
                                "border border-gray-300 dark:border-gray-600 rounded-lg w-full h-44 bg-white dark:bg-gray-900",
                            }}
                            onEnd={() => handleSave(field.id)}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleClear(field.id)}
                              className="px-4 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                            >
                              Clear
                            </button>
                            <button
                              onClick={() => handleSave(field.id)}
                              className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                              Save
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <p className="font-semibold text-gray-800 dark:text-gray-100">
                        {field.question}
                      </p>

                      {field.typedSignature ? (
                        // ✅ If signature already exists — show only p with selected font
                        <p
                          className="text-3xl text-gray-700 dark:text-gray-200"
                          style={{ fontFamily: field.fontFamily || "Allura" }}
                        >
                          {field.typedSignature}
                        </p>
                      ) : (
                        // 📝 If no signature — show input + font select + preview
                        <>
                          <input
                            type="text"
                            placeholder="Type your signature"
                            value={field.typedSignature || ""}
                            onChange={(e) =>
                              onUpdate(field.id, {
                                typedSignature: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-gray-800 dark:text-gray-100 bg-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                          <div className="flex items-center gap-4">
                            <Select
                              value={field.fontFamily || "Allura"}
                              onValueChange={(value) =>
                                onUpdate(field.id, { fontFamily: value })
                              }
                            >
                              <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select Font" />
                              </SelectTrigger>
                              <SelectContent>
                                {[
                                  "Allura",
                                  "Great Vibes",
                                  "Dancing Script",
                                  "Pacifico",
                                  "Cedarville Cursive",
                                ].map((font) => (
                                  <SelectItem key={font} value={font}>
                                    <span style={{ fontFamily: font }}>
                                      {font}
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <p
                              className="text-3xl text-gray-700 dark:text-gray-200"
                              style={{
                                fontFamily: field.fontFamily || "Allura",
                              }}
                            >
                              {field.typedSignature || "—"}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </>
              )} */}

{field.type === "signature" && (
  <div className="flex flex-col gap-3">
    <p className="font-semibold text-gray-800 dark:text-gray-100">
      {field.question}
    </p>

    {/* Handwriting / Pad */}
    {field.signatureType === "pad" ? (
      field.signatureData ? (
        // ✅ Database se data already hai → sirf display
        <img
          src={field.signatureData}
          alt="Signature"
          className="border border-gray-300 dark:border-gray-600 rounded-lg w-full h-44 object-contain bg-white dark:bg-gray-900"
        />
      ) : (
        // 📝 Editable pad + Save
        <>
          <SignatureCanvas
            ref={(ref) => (sigCanvasRef.current[field.id] = ref)}
            penColor="black"
            canvasProps={{
              className:
                "border border-gray-300 dark:border-gray-600 rounded-lg w-full h-44 bg-white dark:bg-gray-900",
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={() => sigCanvasRef.current[field.id].clear()}
              className="px-4 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Clear
            </button>
            <button
              onClick={() => {
                const dataUrl = sigCanvasRef.current[field.id].toDataURL();
                handleSave(field.id, dataUrl); // Save function update
              }}
              className="px-4 py-1.5 text-sm bg-[#5965AB] hover:bg-[#5f6ebe] text-white rounded-md  transition"
            >
              Save
            </button>
          </div>
        </>
      )
    ) : (
      // Typed signature
      field.typedSignature ? (
        // ✅ Database se data already hai → sirf display
        <p
          className="text-3xl text-gray-700 dark:text-gray-200"
          style={{ fontFamily: field.fontFamily || "Allura" }}
        >
          {field.typedSignature}
        </p>
      ) : (
        // 📝 Editable input + font select + Save button
        <>
          <input
            type="text"
            placeholder="Type your signature"
            value={field.tempTypedSignature || ""}
            onChange={(e) =>
              onUpdate(field.id, { tempTypedSignature: e.target.value })
            }
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-gray-800 dark:text-gray-100 bg-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <div className="flex items-center gap-4">
            <Select
              value={field.fontFamily || "Allura"}
              onValueChange={(value) =>
                onUpdate(field.id, { fontFamily: value })
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Font" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Allura",
                  "Great Vibes",
                  "Dancing Script",
                  "Pacifico",
                  "Cedarville Cursive",
                ].map((font) => (
                  <SelectItem key={font} value={font}>
                    <span style={{ fontFamily: font }}>{font}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <p
              className="text-3xl text-gray-700 dark:text-gray-200"
              style={{
                fontFamily: field.fontFamily || "Allura",
              }}
            >
              {field.tempTypedSignature || "—"}
            </p>
          </div>

          {/* Save button */}
          <button
            onClick={() =>
              handleSave(field.id, field.tempTypedSignature, field.fontFamily)
            }
            className="mt-2 w-20 px-4 py-1.5 cursor-pointer text-sm bg-[#5965AB] hover:bg-[#5f6ebe] text-white rounded-md  transition"
          >
            Save
          </button>
        </>
      )
    )}
  </div>
)}


            </div>
          ))}
      </section>

      {/* 📄 Footer */}
      <footer className="relative z-10 border-t pt-6 mt-10 text-gray-600 dark:text-gray-400 text-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left space-y-1">
          {company?.companyAddress && <p>{company.companyAddress}</p>}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} {company?.name || "Your Company"}. All
          rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ViewContractdetails;
