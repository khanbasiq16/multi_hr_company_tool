// "use client";

// import React from "react";
// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { GripVertical, Trash2 } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";

// const SortableField = ({ field, onDelete }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useSortable({ id: field.id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       className="relative bg-white shadow-sm border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition-all"
//     >
//       {/* Drag Handle + Delete */}
//       <div className="flex justify-between items-center mb-2">
//         <div
//           {...attributes}
//           {...listeners}
//           className="cursor-grab text-gray-400 hover:text-gray-600 flex items-center gap-1"
//         >
//           <GripVertical size={16} /> Drag
//         </div>
//         <button
//           onClick={() => onDelete(field.id)}
//           className="text-red-500 hover:text-red-700 transition-colors"
//         >
//           <Trash2 size={18} />
//         </button>
//       </div>

//       {/* Field Content */}
//       <div className="space-y-2">
//         <label className="text-sm font-medium text-gray-700">
//           {field.label || "Untitled Field"}
//         </label>

//         {field.type === "text" && (
//           <Input
//             placeholder="Text input"
//             className="border-gray-300"
            
//           />
//         )}

//         {field.type === "textarea" && (
//           <Textarea
//             placeholder="Paragraph text"
//             className="border-gray-300"
            
//           />
//         )}

//         {field.type === "signature" && (
//           <div className="border border-dashed border-gray-400 rounded-md h-20 flex items-center justify-center text-gray-400 text-sm italic">
//             Signature Field
//           </div>
//         )}

//         {field.type === "button" && (
//           <Button variant="outline" disabled className="w-fit">
//             Click Me
//           </Button>
//         )}

//         {field.type === "multiple_choice" && (
//           <div className="space-y-1">
//             <label className="flex items-center gap-2">
//               <input type="radio" disabled /> Option 1
//             </label>
//             <label className="flex items-center gap-2">
//               <input type="radio" disabled /> Option 2
//             </label>
//           </div>
//         )}

//         {field.type === "checkboxes" && (
//           <div className="space-y-1">
//             <label className="flex items-center gap-2">
//               <input type="checkbox" disabled /> Option 1
//             </label>
//             <label className="flex items-center gap-2">
//               <input type="checkbox" disabled /> Option 2
//             </label>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SortableField;


// "use client";
// import React, { useRef } from "react";
// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { GripVertical, Trash2, Copy } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import SignaturePad from "react-signature-canvas";

// const SortableField = ({ field, onDelete, onUpdate }) => {
//   const sigRef = useRef();
//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });
//   const style = { transform: CSS.Transform.toString(transform), transition };

//   const addOption = () => {
//     onUpdate(field.id, { options: [...field.options, `Option ${field.options.length + 1}`] });
//   };

//   const updateOption = (index, value) => {
//     const newOptions = [...field.options];
//     newOptions[index] = value;
//     onUpdate(field.id, { options: newOptions });
//   };

//   const removeOption = (index) => {
//     const newOptions = field.options.filter((_, i) => i !== index);
//     onUpdate(field.id, { options: newOptions });
//   };

//   return (
//     <div ref={setNodeRef} style={style} className="bg-white border rounded-lg shadow-sm p-4 mb-4">
//       <div className="flex justify-between items-center mb-2">
//         <div {...attributes} {...listeners} className="cursor-grab text-gray-400 flex items-center gap-1">
//           <GripVertical size={16} /> Drag
//         </div>
//         <div className="flex items-center gap-2">
//           <button onClick={() => onDelete(field.id)} className="text-red-500 hover:text-red-700">
//             <Trash2 size={18} />
//           </button>
//         </div>
//       </div>

//       <Input
//         className="mb-2"
//         value={field.question}
//         onChange={(e) => onUpdate(field.id, { question: e.target.value })}
//         placeholder="Question title"
//       />
//       <Textarea
//         className="mb-3"
//         value={field.description}
//         onChange={(e) => onUpdate(field.id, { description: e.target.value })}
//         placeholder="Description (optional)"
//       />

//       {/* Render field type */}
//       {field.type === "short_answer" && <Input disabled placeholder="Short answer text" />}
//       {field.type === "paragraph" && <Textarea disabled placeholder="Long answer text" />}
//       {["multiple_choice", "checkboxes", "dropdown"].includes(field.type) && (
//         <div className="space-y-2">
//           {field.options.map((opt, i) => (
//             <div key={i} className="flex items-center gap-2">
//               {field.type === "multiple_choice" && <input type="radio" disabled />}
//               {field.type === "checkboxes" && <input type="checkbox" disabled />}
//               <Input value={opt} onChange={(e) => updateOption(i, e.target.value)} className="w-full" />
//               <Button variant="ghost" size="sm" onClick={() => removeOption(i)}>🗑️</Button>
//             </div>
//           ))}
//           <Button size="sm" variant="outline" onClick={addOption}>
//             + Add option
//           </Button>
//         </div>
//       )}
//       {field.type === "date" && <Input type="date" disabled />}
//       {field.type === "file_upload" && <Input type="file" disabled />}
//       {field.type === "signature" && (
//         <div className="border border-dashed rounded-md p-2">
//           <SignaturePad
//             ref={sigRef}
//             penColor="black"
//             canvasProps={{ width: 400, height: 150, className: "sigCanvas" }}
//           />
//           <Button variant="outline" size="sm" onClick={() => sigRef.current.clear()}>
//             Clear
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SortableField;


"use client";
import React, { useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SignaturePad from "react-signature-canvas";

const SortableField = ({ field, onDelete, onUpdate, onDuplicate }) => {
  const sigRef = useRef();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  if (field.type === "company_info_block") {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-white border rounded-lg shadow-sm p-4 mb-4"
      >
        <h3 className="text-lg font-semibold mb-2">🏢 Company Information</h3>
        <div className="flex justify-between items-start">
          <div>
            <img
              src={field?.companyLogo || "/placeholder.png"}
              alt="Logo"
              className="w-16 h-16 object-contain mb-2"
            />
            <p className="font-bold text-gray-700">{field?.companyName || "Company Name"}</p>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p>{field?.companyAddress || "Company Address"}</p>
            <p>📞 {field?.companyPhone || "Company Phone"}</p>
            <p>
              🌐{" "}
              <a href="#" className="text-blue-500 underline">
                {field?.companyWebsite?.replace(/(^\w+:|^)\/\//, "").replace(/\/$/, "") ||
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
      <div className="flex justify-between items-center mb-2">
        <div {...attributes} {...listeners} className="cursor-grab text-gray-400 flex items-center gap-1">
          <GripVertical size={16} /> Drag
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onDuplicate(field)} className="text-blue-500 hover:text-blue-700">
            <Copy size={18} />
          </button>
          <button onClick={() => onDelete(field.id)} className="text-red-500 hover:text-red-700">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <Input
        className="mb-2"
        value={field.question}
        onChange={(e) => onUpdate(field.id, { question: e.target.value })}
        placeholder="Question title"
      />
      <Textarea
        className="mb-3"
        value={field.description}
        onChange={(e) => onUpdate(field.id, { description: e.target.value })}
        placeholder="Description (optional)"
      />

      {field.type === "short_answer" && <Input disabled placeholder="Short answer text" />}
      {field.type === "paragraph" && <Textarea disabled placeholder="Long answer text" />}

      {["multiple_choice", "checkboxes", "dropdown"].includes(field.type) && (
        <div className="space-y-2">
          {field.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              {field.type === "multiple_choice" && <input type="radio" disabled />}
              {field.type === "checkboxes" && <input type="checkbox" disabled />}
              <Input
                value={opt}
                onChange={(e) => {
                  const updated = [...field.options];
                  updated[i] = e.target.value;
                  onUpdate(field.id, { options: updated });
                }}
                className="w-full"
              />
              <Button variant="ghost" size="sm" onClick={() => {
                onUpdate(field.id, { options: field.options.filter((_, index) => index !== i) });
              }}>🗑️</Button>
            </div>
          ))}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdate(field.id, { options: [...field.options, `Option ${field.options.length + 1}`] })}
          >
            + Add option
          </Button>
        </div>
      )}

      {field.type === "date" && <Input type="date" disabled />}
      {field.type === "file_upload" && <Input type="file" disabled />}
      {field.type === "signature" && (
        <div className="border border-dashed rounded-md p-2">
          <SignaturePad
            ref={sigRef}
            penColor="black"
            canvasProps={{ width: 400, height: 150, className: "sigCanvas" }}
          />
          <Button variant="outline" size="sm" onClick={() => sigRef.current.clear()}>
            Clear
          </Button>
        </div>
      )}
    </div>
  );
};

export default SortableField;
