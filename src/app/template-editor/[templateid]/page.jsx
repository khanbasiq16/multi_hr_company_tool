// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Type,
//   FileText,
//   PenLine,
//   CheckSquare,
//   Circle,
//   List,
//   Calendar,
//   Save,
//   Eye,
//   EyeOff,
//   Loader2,
// } from "lucide-react";
// import { DndContext, closestCenter } from "@dnd-kit/core";
// import {
//   SortableContext,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import SortableField from "@/app/utils/basecomponents/SortableField";
// import FormPreview from "@/app/utils/basecomponents/FormPreview";
// import { useRouter } from "next/navigation";

// const FIELD_TYPES = {
//   SHORT_ANSWER: "short_answer",
//   PARAGRAPH: "paragraph",
//   MULTIPLE_CHOICE: "multiple_choice",
//   CHECKBOXES: "checkboxes",
//   DROPDOWN: "dropdown",
//   DATE: "date",
//   SIGNATURE: "signature",
//   COMPANY_INFO_BLOCK: "company_info_block",
//   APPENDIX: "appendix",
// };

// const TemplateEditorPage = () => {
//   const { templateid } = useParams();
//   const [fields, setFields] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [templateName, setTemplateName] = useState("Untitled Form");
//   const [isPreview, setIsPreview] = useState(false);
//   const [company, setCompany] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     if (!templateid) return;
//     const fetchTemplate = async () => {
//       try {
//         const res = await axios.get(`/api/get-template/${templateid}`);
//         if (res.data.success) {
//           const fetchedTemplate = res.data.template;

//           setCompany(fetchedTemplate.company || {});
//           let initialFields = fetchedTemplate.fields || [];


//           if (
//             initialFields.length === 0 ||
//             !initialFields.some(
//               (f) => f.type === FIELD_TYPES.COMPANY_INFO_BLOCK
//             )
//           ) {
//             initialFields = [
//               {
//                 id: "company-header",
//                 type: FIELD_TYPES.COMPANY_INFO_BLOCK,
//                 label: "Company Header",
//                 isFixed: true,
//               },
//               ...initialFields,
//             ];
//           }
//           setFields(initialFields);
//           setTemplateName(fetchedTemplate.templateName || "Untitled Form");
//         }
//       } catch {
//         toast.error("Failed to load template");
//       }
//     };
//     fetchTemplate();
//   }, [templateid]);

//   const handleAddField = (type) => {
//     if (isPreview) return;
//     const newField = {
//       id: Date.now(),
//       type,
//       question: "Untitled question",
//       description: "",
//       options:
//         type === FIELD_TYPES.MULTIPLE_CHOICE ||
//           type === FIELD_TYPES.CHECKBOXES ||
//           type === FIELD_TYPES.DROPDOWN
//           ? ["Option 1"]
//           : [],
//       required: false,
//     };
//     setFields((prev) => [...prev, newField]);
//   };

//   const handleDeleteField = (id) => {
//     if (isPreview) return;
//     setFields(fields.filter((f) => f.id !== id));
//   };

//   const handleDuplicateField = (field) => {
//     if (isPreview) return;
//     const duplicate = {
//       ...field,
//       id: Date.now(),
//       question: `${field.question} (Copy)`,
//     };
//     setFields((prev) => [...prev, duplicate]);
//   };

//   const handleUpdateField = (id, updated) => {
//     if (isPreview) return;
//     setFields(fields.map((f) => (f.id === id ? { ...f, ...updated } : f)));
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       const slug = templateName.trim().toLowerCase().replace(/\s+/g, "_");

//       console.log(fields);

//       const res = await axios.post(`/api/update-template/${templateid}`, {
//         templateName,
//         fields,
//         slug,
//       });

//       if (res.data.success) {
//         toast.success(res?.data?.message);
//       }
//     } catch {
//       toast.error("Failed to save template");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDragEnd = (event) => {
//     if (isPreview) return;
//     const { active, over } = event;
//     if (!over) return;
//     if (active.id !== over.id) {
//       setFields((prev) => {
//         const oldIndex = prev.findIndex((f) => f.id === active.id);
//         const newIndex = prev.findIndex((f) => f.id === over.id);
//         const updated = [...prev];
//         const [moved] = updated.splice(oldIndex, 1);
//         updated.splice(newIndex, 0, moved);
//         return updated;
//       });
//     }
//   };

//   const handleexit = () => {
//     router.push("/admin/templates");
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-gray-100 min-h-screen">
//       {/* Sidebar */}
//       <div className="space-y-6 bg-white p-4 rounded-xl shadow-md">
//         <div>
//           <h2 className="text-lg font-semibold mb-2">Form Info</h2>
//           <Input
//             value={templateName}
//             onChange={(e) => setTemplateName(e.target.value)}
//             placeholder="Form title"
//           />
//         </div>

//         <div>
//           <h3 className="font-semibold mb-3">Add Question</h3>
//           <div className="grid grid-cols-2 gap-2">
//             {[
//               { icon: Type, label: "Short", type: FIELD_TYPES.SHORT_ANSWER },
//               {
//                 icon: FileText,
//                 label: "Paragraph",
//                 type: FIELD_TYPES.PARAGRAPH,
//               },
//               {
//                 icon: Circle,
//                 label: "Choice",
//                 type: FIELD_TYPES.MULTIPLE_CHOICE,
//               },
//               {
//                 icon: CheckSquare,
//                 label: "Checkbox",
//                 type: FIELD_TYPES.CHECKBOXES,
//               },
//               { icon: List, label: "Dropdown", type: FIELD_TYPES.DROPDOWN },
//               { icon: Calendar, label: "Date", type: FIELD_TYPES.DATE },
//               {
//                 icon: PenLine,
//                 label: "Signature",
//                 type: FIELD_TYPES.SIGNATURE,
//               },
//             ].map(({ icon: Icon, label, type }) => (
//               <Button
//                 key={type}
//                 onClick={!isPreview ? () => handleAddField(type) : undefined}
//                 className={`flex items-center gap-2 ${isPreview ? "opacity-50 cursor-not-allowed" : ""
//                   }`}
//               >
//                 <Icon size={14} /> {label}
//               </Button>
//             ))}
//           </div>
//         </div>

//         <div className="border-t pt-4 space-y-2 ">
//           <Button
//             onClick={handleSave}
//             disabled={loading}
//             className={`w-full flex items-center justify-center gap-2 `}
//           >
//             <Save size={16} />{" "}
//             {loading ? (
//               <>
//                 <Loader2 className="animate-spin" /> Saving...
//               </>
//             ) : (
//               "Save"
//             )}
//           </Button>
//           <Button
//             onClick={() => setIsPreview((prev) => !prev)}
//             className="w-full flex items-center justify-center gap-2"
//             variant="outline"
//           >
//             {isPreview ? <EyeOff size={16} /> : <Eye size={16} />}{" "}
//             {isPreview ? "Close Preview" : "Preview"}
//           </Button>

//           <Button onClick={handleexit} className={"bottom-0 mt-5 w-full "}>
//             Exit to Editor
//           </Button>
//         </div>
//       </div>

//       {/* Main area */}
//       <div className="md:col-span-3 bg-gray-50 p-6 rounded-xl shadow-inner">
//         {isPreview ? (
//           <FormPreview fields={fields} company={company} />
//         ) : (
//           <DndContext
//             collisionDetection={closestCenter}
//             onDragEnd={handleDragEnd}
//           >
//             <SortableContext
//               items={fields.map((f) => f.id)}
//               strategy={verticalListSortingStrategy}
//             >
//               {fields.map((field) => (
//                 <SortableField
//                   key={field.id}
//                   field={field}
//                   onDelete={handleDeleteField}
//                   onUpdate={handleUpdateField}
//                   onDuplicate={handleDuplicateField}
//                 />
//               ))}
//             </SortableContext>
//           </DndContext>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TemplateEditorPage;
"use client";
import React, { useRef, useState } from "react";

export default function ModernContractEditor({ initialCompany }) {
  const defaultCompany = initialCompany || {
    name: "ACME Corp",
    address: "123 Main Street",
    phone: "+1 555 101010",
    email: "info@acme.com",
  };

  const [company] = useState(defaultCompany);

  const [template, setTemplate] = useState(`
**Contract Agreement**

This Contract is between {{company.name}} and {{field:client_name}}.

Appendix: {{field:appendix}}

Signature of Company: {{signature:company_signature}}
Signature of Client: {{signature:client_signature}}

Effective Date: {{field:effective_date}}
  `);

  const [fields, setFields] = useState([
    { key: "client_name", label: "Client Name", value: "" },
    { key: "effective_date", label: "Effective Date", value: "" },
    { key: "appendix", label: "Appendix", value: "" }, // DEFAULT FIELD
  ]);

  const [signatures, setSignatures] = useState([
    { key: "company_signature", label: "Company Signature", value: "" },
    { key: "client_signature", label: "Client Signature", value: "" },
  ]);

  const templateRef = useRef(null);

  // Insert placeholders
  function insertPlaceholder(type, key) {
    const placeholder =
      type === "company"
        ? `{{company.${key}}}`
        : type === "field"
          ? `{{field:${key}}}`
          : `{{signature:${key}}}`;

    const el = templateRef.current;
    if (!el) return setTemplate((t) => t + placeholder);

    const start = el.selectionStart;
    const end = el.selectionEnd;

    const newText =
      template.slice(0, start) + placeholder + template.slice(end);

    setTemplate(newText);

    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + placeholder.length;
      el.focus();
    });
  }

  // Preview rendering
  function renderPreview() {
    let out = template;

    out = out.replace(/{{company\.([a-zA-Z0-9_]+)}}/g, (_, key) => {
      return company[key] ?? `<<missing company.${key}>>`;
    });

    out = out.replace(/{{field:([a-zA-Z0-9_]+)}}/g, (_, key) => {
      const f = fields.find((x) => x.key === key);
      return f?.value || `<<${f?.label || key} (edit)>>`;
    });

    out = out.replace(/{{signature:([a-zA-Z0-9_]+)}}/g, (_, key) => {
      const s = signatures.find((x) => x.key === key);
      return s?.value
        ? `[Signed ✔]`
        : `<<${s?.label || key} - signature pending>>`;
    });

    return out;
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6 flex gap-6">
      {/* LEFT TEMPLATE EDITOR */}
      <div className="flex-1 bg-white shadow rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Contract Template</h2>

        <textarea
          ref={templateRef}
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          rows={14}
          className="w-full p-4 border rounded font-mono text-sm bg-gray-50 focus:ring"
        />

        <h3 className="text-lg font-semibold mt-6 mb-2">Live Preview</h3>
        <pre className="p-4 bg-gray-50 border rounded whitespace-pre-wrap text-sm">
          {renderPreview()}
        </pre>
      </div>

      {/* RIGHT TOOLBAR */}
      <div className="w-80 bg-white shadow rounded p-4 h-fit">
        <h3 className="font-semibold mb-3">Company Fields</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.keys(company).map((key) => (
            <button
              key={key}
              className="px-2 py-1 border rounded text-xs hover:bg-gray-100"
              onClick={() => insertPlaceholder("company", key)}
            >
              company.{key}
            </button>
          ))}
        </div>

        <h3 className="font-semibold mb-3">Custom Fields</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {fields.map((f) => (
            <button
              key={f.key}
              className="px-2 py-1 border rounded text-xs hover:bg-gray-100"
              onClick={() => insertPlaceholder("field", f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <h3 className="font-semibold mb-3">Signatures</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {signatures.map((s) => (
            <button
              key={s.key}
              className="px-2 py-1 border rounded text-xs hover:bg-gray-100"
              onClick={() => insertPlaceholder("signature", s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-semibold mb-2">Fill Fields</h4>

          {fields.map((f, i) => (
            <div key={f.key} className="mb-3">
              <label className="text-xs font-medium">{f.label}</label>
              <input
                className="w-full border p-1 rounded text-sm"
                value={f.value}
                onChange={(e) => {
                  const next = [...fields];
                  next[i].value = e.target.value;
                  setFields(next);
                }}
              />
            </div>
          ))}

          <h4 className="text-sm font-semibold mb-2 mt-4">Signatures</h4>
          {signatures.map((s, i) => (
            <div key={s.key} className="mb-3">
              <label className="text-xs font-medium">{s.label}</label>
              <input
                className="w-full border p-1 rounded text-sm"
                placeholder="Enter signature text or ID"
                value={s.value}
                onChange={(e) => {
                  const next = [...signatures];
                  next[i].value = e.target.value;
                  setSignatures(next);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
