

"use client";
import React, { useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SignaturePad from "react-signature-canvas";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const SortableField = ({ field, onDelete, onUpdate, onDuplicate, isPreview }) => {
  const sigRef = useRef();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  // ✅ Company Info Block
  if (field.type === "company_info_block") {
    return (
      <div ref={setNodeRef} style={style} className="bg-white border rounded-lg shadow-sm p-4 mb-4">
        <h3 className="text-lg font-semibold mb-2">🏢 Company Information</h3>
        <div className="flex justify-between items-start">
          <div>
            <img
              src={field?.company?.companyLogo || "/icons/icon-144x144.png"}
              alt="Logo"
              className="w-16 h-16 object-contain mb-2"
            />
            <p className="font-bold text-gray-700">{field?.company?.companyName || "Company Name"}</p>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p>{field?.company?.companyAddress || "Company Address"}</p>
            <p>📞 {field?.company?.companyPhone || "Company Phone"}</p>
            <p>
              🌐{" "}
              <a href="#" className="text-blue-500 underline">
                {field?.company?.companyWebsite?.replace(/(^\w+:|^)\/\//, "").replace(/\/$/, "") ||
                  "company.com"}
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className="bg-white border rounded-lg shadow-sm p-4 mb-4">
      {/* Header controls */}
      {!isPreview && (
        <div className="flex justify-between items-center mb-2">
          <div {...attributes} {...listeners} className="cursor-grab text-gray-400 flex items-center gap-1">
            <GripVertical size={16} /> Drag
          </div>
           {field.type !== "appendix" && (
          <div className="flex items-center gap-2">
            <button onClick={() => onDuplicate(field)} className="text-blue-500 hover:text-blue-700">
              <Copy size={18} />
            </button>
            <button onClick={() => onDelete(field.id)} className="text-red-500 hover:text-red-700">
              <Trash2 size={18} />
            </button>
          </div>
           )}
        </div>
      )}

      {/* Question title */}
      <Input
        className="mb-2"
        value={field.question}
        onChange={(e) => !isPreview && onUpdate(field.id, { question: e.target.value })}
        placeholder="Question title"
        disabled={isPreview}
      />

      {/* Optional description */}
      {!isPreview && field.description && (
        <Textarea
          className="mb-3"
          value={field.description}
          onChange={(e) => onUpdate(field.id, { description: e.target.value })}
          placeholder="Add description (optional)"
        />
      )}

     
    
      {field.type === "short_answer" && (
        <div className="space-y-2">
          {!isPreview && (
            <div className="flex gap-2 mb-1">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onUpdate(field.id, { bold: !field.bold })}
                className={field.bold ? "bg-gray-200" : ""}
              >
                <b>B</b>
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onUpdate(field.id, { italic: !field.italic })}
                className={field.italic ? "bg-gray-200" : ""}
              >
                <i>I</i>
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onUpdate(field.id, { underline: !field.underline })}
                className={field.underline ? "bg-gray-200" : ""}
              >
                <u>U</u>
              </Button>
            </div>
          )}

          <Input
            placeholder="Enter short answer"
            value={field.answer || ""}
            onChange={(e) => !isPreview && onUpdate(field.id, { answer: e.target.value })}
            disabled={isPreview}
            className={`w-full ${field.bold ? "font-bold" : ""} ${field.italic ? "italic" : ""} ${
              field.underline ? "underline" : ""
            }`}
          />
        </div>
      )}

      {/* Paragraph with Formatting */}
      {field.type === "paragraph" && (
        <div className="space-y-2">
          {!isPreview && (
            <div className="flex gap-2 mb-1">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onUpdate(field.id, { bold: !field.bold })}
                className={field.bold ? "bg-gray-200" : ""}
              >
                <b>B</b>
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onUpdate(field.id, { italic: !field.italic })}
                className={field.italic ? "bg-gray-200" : ""}
              >
                <i>I</i>
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onUpdate(field.id, { underline: !field.underline })}
                className={field.underline ? "bg-gray-200" : ""}
              >
                <u>U</u>
              </Button>
            </div>
          )}

          <Textarea
            placeholder="Enter long answer"
            value={field.answer || ""}
            onChange={(e) => !isPreview && onUpdate(field.id, { answer: e.target.value })}
            disabled={isPreview}
            className={`w-full ${field.bold ? "font-bold" : ""} ${field.italic ? "italic" : ""} ${
              field.underline ? "underline" : ""
            }`}
          />
        </div>
      )}

      {/* Multiple choice / checkboxes / dropdown */}
      {["multiple_choice", "checkboxes", "dropdown"].includes(field.type) && (
        <div className="space-y-2">
          {field.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              {field.type === "multiple_choice" && <input type="radio" disabled />}
              {field.type === "checkboxes" && <input type="checkbox" disabled />}
              <Input
                value={opt}
                onChange={(e) => {
                  if (!isPreview) {
                    const updated = [...field.options];
                    updated[i] = e.target.value;
                    onUpdate(field.id, { options: updated });
                  }
                }}
                disabled={isPreview}
                className="w-full"
              />
              {!isPreview && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onUpdate(field.id, {
                      options: field.options.filter((_, index) => index !== i),
                    })
                  }
                >
                  🗑️
                </Button>
              )}
            </div>
          ))}
          {!isPreview && (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                onUpdate(field.id, {
                  options: [...field.options, `Option ${field.options.length + 1}`],
                })
              }
            >
              + Add option
            </Button>
          )}
        </div>
      )}

      {field.type === "date" && (
        <Input
          type="date"
          value={field.answer || ""}
          onChange={(e) => !isPreview && onUpdate(field.id, { answer: e.target.value })}
          disabled={isPreview}
        />
      )}

      {field.type === "file_upload" && <Input type="file" disabled={isPreview} />}


      {field.type === "appendix" && (
  <div className="space-y-2">

    {/* Optional formatting buttons (if needed) */}
    {!isPreview && (
      <div className="flex gap-2 mb-1">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onUpdate(field.id, { bold: !field.bold })}
          className={field.bold ? "bg-gray-200" : ""}
        >
          <b>B</b>
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onUpdate(field.id, { italic: !field.italic })}
          className={field.italic ? "bg-gray-200" : ""}
        >
          <i>I</i>
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onUpdate(field.id, { underline: !field.underline })}
          className={field.underline ? "bg-gray-200" : ""}
        >
          <u>U</u>
        </Button>
      </div>
    )}

    {/* Input area */}
    <Textarea
      placeholder="Enter appendix content..."
      value={field.answer || ""}
      onChange={(e) => !isPreview && onUpdate(field.id, { answer: e.target.value })}
      disabled={isPreview}
      className={`w-full ${field.bold ? "font-bold" : ""} ${field.italic ? "italic" : ""} ${
        field.underline ? "underline" : ""
      }`}
    />
  </div>
)}

      {/* Signature Field */}
      {field.type === "signature" && (
        <div className="border border-dashed rounded-md p-4 space-y-3">
          {/* Mode Selector */}
          {!isPreview && (
            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`sigType-${field.id}`}
                  value="pad"
                  checked={field.signatureType === "pad"}
                  onChange={() => onUpdate(field.id, { signatureType: "pad" })}
                />
                Signature Pad
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`sigType-${field.id}`}
                  value="typed"
                  checked={field.signatureType === "typed"}
                  onChange={() => onUpdate(field.id, { signatureType: "typed" })}
                />
                Typed Signature
              </label>
            </div>
          )}

          {/* Signature Pad */}
          {field.signatureType === "pad" && (
            <div className="border rounded-md p-2">
              <SignaturePad
                ref={sigRef}
                penColor="black"
                canvasProps={{ width: 400, height: 150, className: "sigCanvas" }}
              />
              {!isPreview && (
                <Button variant="outline" size="sm" className="mt-2" onClick={() => sigRef.current.clear()}>
                  Clear
                </Button>
              )}
            </div>
          )}

          {/* Typed Signature */}
          {field.signatureType === "typed" && (
            <div className="space-y-3">
              <Input
                placeholder="Enter your name"
                value={field.typedSignature || ""}
                onChange={(e) => onUpdate(field.id, { typedSignature: e.target.value })}
                disabled={isPreview}
              />

              {/* Font Picker */}
              {!isPreview && (
                <div className="w-full">
                  <Select
                    value={field.fontFamily || "Allura"}
                    onValueChange={(value) => onUpdate(field.id, { fontFamily: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Signature Font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Allura" style={{ fontFamily: "Allura" }}>
                        Allura
                      </SelectItem>
                      <SelectItem value="Great Vibes" style={{ fontFamily: "Great Vibes" }}>
                        Great Vibes
                      </SelectItem>
                      <SelectItem value="Dancing Script" style={{ fontFamily: "Dancing Script" }}>
                        Dancing Script
                      </SelectItem>
                      <SelectItem value="Pacifico" style={{ fontFamily: "Pacifico" }}>
                        Pacifico
                      </SelectItem>
                      <SelectItem value="Cedarville Cursive" style={{ fontFamily: "Cedarville Cursive" }}>
                        Cedarville Cursive
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              

              {/* Signature Preview */}
              <div className="border rounded-md p-3 bg-gray-50">
                <p
                  className="text-3xl"
                  style={{
                    fontFamily:
                      field.fontFamily === "Allura"
                        ? "Allura"
                        : field.fontFamily === "Great Vibes"
                        ? "Great Vibes"
                        : field.fontFamily === "Dancing Script"
                        ? "Dancing Script"
                        : field.fontFamily === "Pacifico"
                        ? "Pacifico"
                        : "Cedarville Cursive",
                  }}
                >
                  {field.typedSignature || "Your signature will appear here"}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SortableField;
