// // "use client";

// // import React, { useEffect, useState, useRef } from "react";
// // import { useParams } from "next/navigation";
// // import axios from "axios";
// // import toast from "react-hot-toast";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { PlusCircle, Type, FileText, PenLine, Building } from "lucide-react";

// // import { DndContext, closestCenter } from "@dnd-kit/core";
// // import {
// //   arrayMove,
// //   SortableContext,
// //   useSortable,
// //   verticalListSortingStrategy,
// // } from "@dnd-kit/sortable";
// // import { CSS } from "@dnd-kit/utilities";

// // // 🎨 Field Types
// // const FIELD_TYPES = {
// //   TEXT: "text",
// //   TEXTAREA: "textarea",
// //   SIGNATURE: "signature",
// //   COMPANY_INFO: "company_info",
// // };

// // const TemplateEditorPage = () => {
// //   const { templateid } = useParams();
// //   const [template, setTemplate] = useState(null);
// //   const [fields, setFields] = useState([]);
// //   const [background, setBackground] = useState("#ffffff");
// //   const [fontSize, setFontSize] = useState(16);
// //   const [showCompanyInfo, setShowCompanyInfo] = useState({
// //     logo: true,
// //     address: true,
// //     phone: true,
// //     website: true,
// //   });

// //   // 🧠 Fetch Template
// //   useEffect(() => {
// //     const fetchTemplate = async () => {
// //       try {
// //         const res = await axios.get(`/api/get-template/${templateid}`);
// //         if (res.data.success) {
// //           setTemplate(res.data.template);
// //           setFields(res.data.template.fields || []);
// //         } else {
// //           toast.error("Template not found!");
// //         }
// //       } catch (error) {
// //         console.error(error);
// //         toast.error("Failed to fetch template data");
// //       }
// //     };
// //     fetchTemplate();
// //   }, [templateid]);

// //   // ➕ Add New Field
// //   const handleAddField = (type) => {
// //     const newField = {
// //       id: Date.now(),
// //       type,
// //       label:
// //         type === FIELD_TYPES.TEXT
// //           ? "Text Field"
// //           : type === FIELD_TYPES.TEXTAREA
// //           ? "Textarea Field"
// //           : type === FIELD_TYPES.SIGNATURE
// //           ? "Signature Field"
// //           : "Company Info",
// //       value: "",
// //     };
// //     setFields([...fields, newField]);
// //   };

// //   // 🧱 Sortable Field Item
// //   const SortableField = ({ field }) => {
// //     const { attributes, listeners, setNodeRef, transform, transition } =
// //       useSortable({ id: field.id });
// //     const style = {
// //       transform: CSS.Transform.toString(transform),
// //       transition,
// //       background: "#fff",
// //       padding: "10px",
// //       borderRadius: "8px",
// //       border: "1px solid #ddd",
// //       marginBottom: "8px",
// //       cursor: "grab",
// //     };

// //     return (
// //       <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
// //         <label className="block text-sm font-semibold mb-2">
// //           <Input
// //             value={field.label}
// //             onChange={(e) =>
// //               setFields(
// //                 fields.map((f) =>
// //                   f.id === field.id ? { ...f, label: e.target.value } : f
// //                 )
// //               )
// //             }
// //           />
// //         </label>

// //         {field.type === FIELD_TYPES.TEXT && (
// //           <Input
// //             placeholder="Text field"
// //             value={field.value}
// //             onChange={(e) =>
// //               setFields(
// //                 fields.map((f) =>
// //                   f.id === field.id ? { ...f, value: e.target.value } : f
// //                 )
// //               )
// //             }
// //           />
// //         )}

// //         {field.type === FIELD_TYPES.TEXTAREA && (
// //           <textarea
// //             className="w-full border rounded-md p-2 text-sm"
// //             rows={3}
// //             placeholder="Textarea field"
// //             value={field.value}
// //             onChange={(e) =>
// //               setFields(
// //                 fields.map((f) =>
// //                   f.id === field.id ? { ...f, value: e.target.value } : f
// //                 )
// //               )
// //             }
// //           />
// //         )}

// //         {field.type === FIELD_TYPES.SIGNATURE && <SignaturePad field={field} />}
// //       </div>
// //     );
// //   };

// //   // ✍️ Signature Component
// //   const SignaturePad = ({ field }) => {
// //     const canvasRef = useRef(null);

// //     useEffect(() => {
// //       const canvas = canvasRef.current;
// //       const ctx = canvas.getContext("2d");
// //       ctx.lineWidth = 2;
// //       ctx.lineCap = "round";
// //       let drawing = false;

// //       const start = (e) => {
// //         drawing = true;
// //         ctx.beginPath();
// //         ctx.moveTo(
// //           e.clientX - canvas.offsetLeft,
// //           e.clientY - canvas.offsetTop
// //         );
// //       };

// //       const draw = (e) => {
// //         if (!drawing) return;
// //         ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
// //         ctx.stroke();
// //       };

// //       const stop = () => (drawing = false);

// //       canvas.addEventListener("mousedown", start);
// //       canvas.addEventListener("mousemove", draw);
// //       canvas.addEventListener("mouseup", stop);
// //       canvas.addEventListener("mouseleave", stop);

// //       return () => {
// //         canvas.removeEventListener("mousedown", start);
// //         canvas.removeEventListener("mousemove", draw);
// //         canvas.removeEventListener("mouseup", stop);
// //         canvas.removeEventListener("mouseleave", stop);
// //       };
// //     }, []);

// //     return (
// //       <div className="border rounded-md p-2 bg-white">
// //         <canvas
// //           ref={canvasRef}
// //           width={400}
// //           height={120}
// //           className="border rounded-md w-full"
// //         />
// //         <p className="text-xs text-gray-500 mt-1 text-center">
// //           Sign above ⬆️
// //         </p>
// //       </div>
// //     );
// //   };

// //   // ⚙️ Handle drag reorder
// //   const handleDragEnd = (event) => {
// //     const { active, over } = event;
// //     if (active.id !== over?.id) {
// //       const oldIndex = fields.findIndex((f) => f.id === active.id);
// //       const newIndex = fields.findIndex((f) => f.id === over.id);
// //       setFields(arrayMove(fields, oldIndex, newIndex));
// //     }
// //   };

// //   const templateStyle = {
// //     background,
// //     fontSize: `${fontSize}px`,
// //     minHeight: "80vh",
// //     border: "2px dashed #ccc",
// //     borderRadius: "16px",
// //     padding: "20px",
// //   };

// //   return (
// //     <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
// //       {/* 🎛️ Sidebar Controls */}
// //       <div className="md:col-span-1 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md border">
// //         <h2 className="text-lg font-semibold mb-4">Editor Controls</h2>

// //         {/* 🎨 Basic Controls */}
// //         <div className="space-y-4">
// //           <div>
// //             <label className="text-sm text-gray-600">Background Color</label>
// //             <Input
// //               type="color"
// //               value={background}
// //               onChange={(e) => setBackground(e.target.value)}
// //             />
// //           </div>

// //           <div>
// //             <label className="text-sm text-gray-600">Font Size</label>
// //             <Input
// //               type="number"
// //               min="12"
// //               max="40"
// //               value={fontSize}
// //               onChange={(e) => setFontSize(Number(e.target.value))}
// //             />
// //           </div>

// //           {/* 🏢 Company Info Toggles */}
// //           <div className="border-t pt-4 mt-4">
// //             <h3 className="font-semibold mb-2 flex items-center gap-2">
// //               <Building className="w-4 h-4" /> Company Info
// //             </h3>
// //             {Object.keys(showCompanyInfo).map((key) => (
// //               <label key={key} className="flex items-center gap-2 mb-1">
// //                 <input
// //                   type="checkbox"
// //                   checked={showCompanyInfo[key]}
// //                   onChange={(e) =>
// //                     setShowCompanyInfo({
// //                       ...showCompanyInfo,
// //                       [key]: e.target.checked,
// //                     })
// //                   }
// //                 />
// //                 <span className="capitalize">{key}</span>
// //               </label>
// //             ))}
// //           </div>

// //           {/* ➕ Field Type Buttons */}
// //           <div className="space-y-2 mt-6">
// //             <Button
// //               variant="outline"
// //               className="w-full"
// //               onClick={() => handleAddField(FIELD_TYPES.TEXT)}
// //             >
// //               <Type className="mr-2 h-4 w-4" /> Add Text Field
// //             </Button>

// //             <Button
// //               variant="outline"
// //               className="w-full"
// //               onClick={() => handleAddField(FIELD_TYPES.TEXTAREA)}
// //             >
// //               <FileText className="mr-2 h-4 w-4" /> Add Textarea
// //             </Button>

// //             <Button
// //               variant="outline"
// //               className="w-full"
// //               onClick={() => handleAddField(FIELD_TYPES.SIGNATURE)}
// //             >
// //               <PenLine className="mr-2 h-4 w-4" /> Add Signature
// //             </Button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* 🧩 Main Template Area */}
// //       <div className="md:col-span-3 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner">
// //         <h2 className="text-xl font-bold mb-4 text-center">
// //           {template?.name || "Template"} Builder
// //         </h2>

// //         {template ? (
// //           <div style={templateStyle}>
// //             {/* 🏢 Company Header */}
// //             {template?.company && (
// //               <div className="flex justify-between items-start mb-8">
// //                 <div>
// //                   {showCompanyInfo.logo && (
// //                     <img
// //                       src={template.company.companyLogo}
// //                       alt="Company Logo"
// //                       className="w-14 h-14 object-contain "
// //                     />
// //                   )}
// //                   <h3 className="text-lg font-semibold">
// //                     {template.company.name}
// //                   </h3>
// //                 </div>
// //                 <div className="text-right">
// //                   {showCompanyInfo.address && (
// //                     <p className="text-sm text-gray-600">
// //                       {template.company.companyAddress}
// //                     </p>
// //                   )}
// //                   {showCompanyInfo.phone && (
// //                     <p className="text-sm text-gray-600">
// //                       📞 {template.company.companyPhoneNumber}
// //                     </p>
// //                   )}
// //                   {showCompanyInfo.website && (
// //                     <p className="text-sm text-gray-600">
// //                       🌐{" "}
// //                       <a
// //                         href={template.company.companyWebsite}
// //                         target="_blank"
// //                         className="underline"
// //                       >
// //                         {template.company.companyWebsite}
// //                       </a>
// //                     </p>
// //                   )}
// //                 </div>
// //               </div>
// //             )}

// //             {/* ✏️ Editable & Draggable Fields */}
// //             <DndContext
// //               collisionDetection={closestCenter}
// //               onDragEnd={handleDragEnd}
// //             >
// //               <SortableContext
// //                 items={fields}
// //                 strategy={verticalListSortingStrategy}
// //               >
// //                 {fields.map((field) => (
// //                   <SortableField key={field.id} field={field} />
// //                 ))}
// //               </SortableContext>
// //             </DndContext>
// //           </div>
// //         ) : (
// //           <p className="text-center text-gray-500">Loading Template...</p>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default TemplateEditorPage;

// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "next/navigation";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   PlusCircle,
//   Type,
//   FileText,
//   PenLine,
//   Building,
//   Trash2,
//   Save,
// } from "lucide-react";
// import { DndContext, closestCenter } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";

// // 🎨 Field Types
// const FIELD_TYPES = {
//   TEXT: "text",
//   TEXTAREA: "textarea",
//   SIGNATURE: "signature",
// };

// const TemplateEditorPage = () => {
//   const { templateid } = useParams();
//   const [template, setTemplate] = useState(null);
//   const [fields, setFields] = useState([]);
//   const [background, setBackground] = useState("#ffffff");
//   const [fontSize, setFontSize] = useState(16);
//   const [loading, setLoading] = useState(false);
//   const [showCompanyInfo, setShowCompanyInfo] = useState({
//     logo: true,
//     address: true,
//     phone: true,
//     website: true,
//   });

//   // 🧠 Fetch Template Data
//   useEffect(() => {
//     const fetchTemplate = async () => {
//       try {
//         const res = await axios.get(`/api/get-template/${templateid}`);
//         if (res.data.success) {
//           setTemplate(res.data.template);
//           setFields(res.data.template.fields || []);
//         } else {
//           toast.error("Template not found!");
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("Failed to fetch template data");
//       }
//     };
//     fetchTemplate();
//   }, [templateid]);

//   // ➕ Add New Field
//   const handleAddField = (type) => {
//     const newField = {
//       id: Date.now(),
//       type,
//       label:
//         type === FIELD_TYPES.TEXT
//           ? "Text Field"
//           : type === FIELD_TYPES.TEXTAREA
//           ? "Textarea Field"
//           : "Signature Field",
//       value: "",
//     };
//     setFields((prev) => [...prev, newField]);
//   };

//   // 🗑️ Delete Field
//   const handleDeleteField = (id) => {
//     setFields(fields.filter((f) => f.id !== id));
//   };

//   // ✍️ Signature Component
//   const SignaturePad = ({ field }) => {
//     const canvasRef = useRef(null);

//     useEffect(() => {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext("2d");
//       ctx.lineWidth = 2;
//       ctx.lineCap = "round";
//       let drawing = false;

//       const start = (e) => {
//         drawing = true;
//         ctx.beginPath();
//         ctx.moveTo(
//           e.clientX - canvas.getBoundingClientRect().left,
//           e.clientY - canvas.getBoundingClientRect().top
//         );
//       };

//       const draw = (e) => {
//         if (!drawing) return;
//         ctx.lineTo(
//           e.clientX - canvas.getBoundingClientRect().left,
//           e.clientY - canvas.getBoundingClientRect().top
//         );
//         ctx.stroke();
//       };

//       const stop = () => (drawing = false);

//       canvas.addEventListener("mousedown", start);
//       canvas.addEventListener("mousemove", draw);
//       canvas.addEventListener("mouseup", stop);
//       canvas.addEventListener("mouseleave", stop);

//       return () => {
//         canvas.removeEventListener("mousedown", start);
//         canvas.removeEventListener("mousemove", draw);
//         canvas.removeEventListener("mouseup", stop);
//         canvas.removeEventListener("mouseleave", stop);
//       };
//     }, []);

//     return (
//       <div className="border rounded-md p-2 bg-white mt-2">
//         <canvas
//           ref={canvasRef}
//           width={400}
//           height={120}
//           className="border rounded-md w-full"
//         />
//         <p className="text-xs text-gray-500 mt-1 text-center">
//           Sign above ⬆️
//         </p>
//       </div>
//     );
//   };

//   // 🧱 Sortable Field
//   const SortableField = ({ field }) => {
//     const { attributes, listeners, setNodeRef, transform, transition } =
//       useSortable({ id: field.id });

//     const style = {
//       transform: CSS.Transform.toString(transform),
//       transition,
//     };

//     const updateField = (key, value) => {
//       setFields((prev) =>
//         prev.map((f) => (f.id === field.id ? { ...f, [key]: value } : f))
//       );
//     };

//     return (
//       <div
//         ref={setNodeRef}
//         style={style}
//         {...attributes}
//         {...listeners}
//         className="bg-white p-4 rounded-lg border shadow-sm mb-3"
//       >
//         <div className="flex justify-between items-center mb-2">
//           <Input
//             value={field.label}
//             onChange={(e) => updateField("label", e.target.value)}
//             className="font-semibold text-gray-800"
//           />
//           <Trash2
//             onClick={() => handleDeleteField(field.id)}
//             className="text-red-500 cursor-pointer ml-3"
//             size={18}
//           />
//         </div>

//         {field.type === FIELD_TYPES.TEXT && (
//           <Input
//             placeholder="Text field"
//             value={field.value}
//             onChange={(e) => updateField("value", e.target.value)}
//           />
//         )}

//         {field.type === FIELD_TYPES.TEXTAREA && (
//           <textarea
//             className="w-full border rounded-md p-2 text-sm"
//             rows={3}
//             placeholder="Textarea field"
//             value={field.value}
//             onChange={(e) => updateField("value", e.target.value)}
//           />
//         )}

//         {field.type === FIELD_TYPES.SIGNATURE && <SignaturePad field={field} />}
//       </div>
//     );
//   };

//   // 🪄 Handle drag reorder
//   const handleDragEnd = (event) => {
//     const { active, over } = event;
//     if (active.id !== over?.id) {
//       const oldIndex = fields.findIndex((f) => f.id === active.id);
//       const newIndex = fields.findIndex((f) => f.id === over.id);
//       setFields(arrayMove(fields, oldIndex, newIndex));
//     }
//   };

//   // 💾 Save Template
//   const handleSave = async () => {
//     if (!template) return toast.error("No template found!");
//     setLoading(true);
//     try {
//       const res = await axios.put(`/api/update-template/${templateid}`, {
//         fields,
//         background,
//         fontSize,
//       });
//       if (res.data.success) toast.success("Template updated successfully!");
//       else toast.error("Failed to update template");
//     } catch (err) {
//       console.error(err);
//       toast.error("Error saving template");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const templateStyle = {
//     background,
//     fontSize: `${fontSize}px`,
//     minHeight: "80vh",
//     border: "2px dashed #ccc",
//     borderRadius: "16px",
//     padding: "20px",
//   };

//   return (
//     <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
//       {/* 🎛️ Sidebar Controls */}
//       <div className="md:col-span-1 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md border">
//         <h2 className="text-lg font-semibold mb-4">Editor Controls</h2>

//         <div className="space-y-4">
//           <div>
//             <label className="text-sm text-gray-600">Background Color</label>
//             <Input
//               type="color"
//               value={background}
//               onChange={(e) => setBackground(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="text-sm text-gray-600">Font Size</label>
//             <Input
//               type="number"
//               min="12"
//               max="40"
//               value={fontSize}
//               onChange={(e) => setFontSize(Number(e.target.value))}
//             />
//           </div>

//           <div className="border-t pt-4 mt-4">
//             <h3 className="font-semibold mb-2 flex items-center gap-2">
//               <Building className="w-4 h-4" /> Company Info
//             </h3>
//             {Object.keys(showCompanyInfo).map((key) => (
//               <label key={key} className="flex items-center gap-2 mb-1">
//                 <input
//                   type="checkbox"
//                   checked={showCompanyInfo[key]}
//                   onChange={(e) =>
//                     setShowCompanyInfo({
//                       ...showCompanyInfo,
//                       [key]: e.target.checked,
//                     })
//                   }
//                 />
//                 <span className="capitalize">{key}</span>
//               </label>
//             ))}
//           </div>

//           <div className="space-y-2 mt-6">
//             <Button
//               variant="outline"
//               className="w-full"
//               onClick={() => handleAddField(FIELD_TYPES.TEXT)}
//             >
//               <Type className="mr-2 h-4 w-4" /> Add Text Field
//             </Button>

//             <Button
//               variant="outline"
//               className="w-full"
//               onClick={() => handleAddField(FIELD_TYPES.TEXTAREA)}
//             >
//               <FileText className="mr-2 h-4 w-4" /> Add Textarea
//             </Button>

//             <Button
//               variant="outline"
//               className="w-full"
//               onClick={() => handleAddField(FIELD_TYPES.SIGNATURE)}
//             >
//               <PenLine className="mr-2 h-4 w-4" /> Add Signature
//             </Button>

//             <Button
//               className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
//               onClick={handleSave}
//               disabled={loading}
//             >
//               <Save className="mr-2 h-4 w-4" />
//               {loading ? "Saving..." : "Save Template"}
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* 🧩 Main Template Area */}
//       <div className="md:col-span-3 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner">
//         <h2 className="text-xl font-bold mb-4 text-center">
//           {template?.name || "Template Builder"}
//         </h2>

//         {template ? (
//           <div style={templateStyle}>
//             {template?.company && (
//               <div className="flex justify-between items-start mb-8">
//                 <div>
//                   {showCompanyInfo.logo && (
//                     <img
//                       src={template.company.companyLogo}
//                       alt="Company Logo"
//                       className="w-14 h-14 object-contain"
//                     />
//                   )}
//                   <h3 className="text-lg font-semibold">
//                     {template.company.name}
//                   </h3>
//                 </div>
//                 <div className="text-right text-sm text-gray-600">
//                   {showCompanyInfo.address && (
//                     <p>{template.company.companyAddress}</p>
//                   )}
//                   {showCompanyInfo.phone && (
//                     <p>📞 {template.company.companyPhoneNumber}</p>
//                   )}
//                   {showCompanyInfo.website && (
//                     <p>
//                       🌐{" "}
//                       <a
//                         href={template.company.companyWebsite}
//                         target="_blank"
//                         className="underline"
//                       >
//                         {template.company.companyWebsite}
//                       </a>
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )}

//             <DndContext
//               collisionDetection={closestCenter}
//               onDragEnd={handleDragEnd}
//             >
//               <SortableContext
//                 items={fields}
//                 strategy={verticalListSortingStrategy}
//               >
//                 {fields.map((field) => (
//                   <SortableField key={field.id} field={field} />
//                 ))}
//               </SortableContext>
//             </DndContext>
//           </div>
//         ) : (
//           <p className="text-center text-gray-500">Loading Template...</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TemplateEditorPage;


// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "next/navigation";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Type,
//   FileText,
//   PenLine,
//   Building,
//   Trash2,
//   Save,
// } from "lucide-react";
// import { DndContext, closestCenter } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";

// // 🎨 Field Types
// const FIELD_TYPES = {
//   TEXT: "text",
//   TEXTAREA: "textarea",
//   SIGNATURE: "signature",
// };

// const TemplateEditorPage = () => {
//   const { templateid } = useParams();
//   const [template, setTemplate] = useState(null);
//   const [fields, setFields] = useState([]);
//   const [background, setBackground] = useState("#ffffff");
//   const [fontSize, setFontSize] = useState(16);
//   const [loading, setLoading] = useState(false);
//   const [showCompanyInfo, setShowCompanyInfo] = useState({
//     logo: true,
//     address: true,
//     phone: true,
//     website: true,
//   });

//   // 🧠 Fetch Template Data
//   useEffect(() => {
//     const fetchTemplate = async () => {
//       try {
//         // Simulating the shape of data including company info and potentially existing fields/styles
//         const res = await axios.get(`/api/get-template/${templateid}`); 
//         if (res.data.success) {
//           const { template: fetchedTemplate } = res.data;
//           setTemplate(fetchedTemplate);
//           setFields(fetchedTemplate.fields || []);
//           // Set initial styles if they exist on the template object
//           if (fetchedTemplate.background) setBackground(fetchedTemplate.background);
//           if (fetchedTemplate.fontSize) setFontSize(fetchedTemplate.fontSize);
//         } else {
//           toast.error("Template not found!");
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("Failed to fetch template data");
//       }
//     };
//     fetchTemplate();
//   }, [templateid]);

//   // ➕ Add New Field
//   const handleAddField = (type) => {
//     const newField = {
//       // Use a unique ID generator that's safe for React keys, though Date.now() is fine for small apps
//       id: Date.now() + Math.random(), 
//       type,
//       label:
//         type === FIELD_TYPES.TEXT
//           ? "Text Field"
//           : type === FIELD_TYPES.TEXTAREA
//           ? "Textarea Field"
//           : "Signature Field",
//       value: "",
//     };
//     setFields((prev) => [...prev, newField]);
//   };

//   // 🗑️ Delete Field
//   const handleDeleteField = (id) => {
//     setFields(fields.filter((f) => f.id !== id));
//     toast.success("Field deleted!");
//   };

//   // ✍️ Signature Component (Improved offset calculation)
//   const SignaturePad = () => {
//     const canvasRef = useRef(null);

//     // This effect handles the drawing logic
//     useEffect(() => {
//       const canvas = canvasRef.current;
//       if (!canvas) return;
//       const ctx = canvas.getContext("2d");
//       ctx.lineWidth = 2;
//       ctx.lineCap = "round";
//       ctx.strokeStyle = '#000000'; // Ensure a black line color
//       let drawing = false;

//       // Function to get mouse position relative to the canvas
//       const getMousePos = (e) => {
//         const rect = canvas.getBoundingClientRect();
//         return {
//           x: e.clientX - rect.left,
//           y: e.clientY - rect.top,
//         };
//       };

//       const start = (e) => {
//         drawing = true;
//         const pos = getMousePos(e);
//         ctx.beginPath();
//         ctx.moveTo(pos.x, pos.y);
//       };

//       const draw = (e) => {
//         if (!drawing) return;
//         const pos = getMousePos(e);
//         ctx.lineTo(pos.x, pos.y);
//         ctx.stroke();
//       };

//       const stop = () => (drawing = false);

//       // Attach event listeners for mouse and touch events
//       canvas.addEventListener("mousedown", start);
//       canvas.addEventListener("mousemove", draw);
//       canvas.addEventListener("mouseup", stop);
//       canvas.addEventListener("mouseleave", stop);

//       // Cleanup
//       return () => {
//         canvas.removeEventListener("mousedown", start);
//         canvas.removeEventListener("mousemove", draw);
//         canvas.removeEventListener("mouseup", stop);
//         canvas.removeEventListener("mouseleave", stop);
//       };
//     }, []);

//     const clearSignature = () => {
//         const canvas = canvasRef.current;
//         if (canvas) {
//             const ctx = canvas.getContext("2d");
//             ctx.clearRect(0, 0, canvas.width, canvas.height);
//         }
//     }

//     return (
//       <div className="border rounded-md p-2 bg-gray-50 mt-2">
//         <canvas
//           ref={canvasRef}
//           width={400}
//           height={120}
//           className="border rounded-md w-full bg-white"
//         />
//         <div className="flex justify-between items-center mt-2">
//             <p className="text-xs text-gray-500">Sign above ⬆️ (Click & Drag)</p>
//             <Button variant="ghost" size="sm" onClick={clearSignature} className="text-red-500 hover:text-red-700">Clear</Button>
//         </div>
//       </div>
//     );
//   };

//   // 🧱 Sortable Field Component
//   const SortableField = ({ field }) => {
//     const { attributes, listeners, setNodeRef, transform, transition } =
//       useSortable({ id: field.id });

//     // Apply transform and transition for drag-and-drop
//     const style = {
//       transform: CSS.Transform.toString(transform),
//       transition,
//     };

//     const updateField = (key, value) => {
//       setFields((prev) =>
//         prev.map((f) => (f.id === field.id ? { ...f, [key]: value } : f))
//       );
//     };

//     return (
//       <div
//         ref={setNodeRef}
//         style={style}
//         className="bg-white p-4 rounded-lg border shadow-sm mb-3"
//       >
//         {/* Drag handle, Label input, and Delete button */}
//         <div className="flex justify-between items-center mb-3">
//           <Input
//             value={field.label}
//             onChange={(e) => updateField("label", e.target.value)}
//             className="font-semibold text-gray-800 flex-grow mr-4"
//             placeholder="Field Label"
//             // Drag listeners are on the whole item, but often a separate handle is better UX
//             {...attributes} 
//             {...listeners}
//           />
//           <Trash2
//             onClick={() => handleDeleteField(field.id)}
//             className="text-red-500 cursor-pointer hover:opacity-75 transition-opacity"
//             size={18}
//             title="Delete Field"
//           />
//         </div>

//         {/* Field Input Area */}
//         {field.type === FIELD_TYPES.TEXT && (
//           <Input
//             placeholder="[User will enter text here]"
//             value={field.value}
//             onChange={(e) => updateField("value", e.target.value)}
//             className="w-full"
//           />
//         )}

//         {field.type === FIELD_TYPES.TEXTAREA && (
//           <textarea
//             className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//             rows={3}
//             placeholder="[User will enter a long text here]"
//             value={field.value}
//             onChange={(e) => updateField("value", e.target.value)}
//           />
//         )}

//         {field.type === FIELD_TYPES.SIGNATURE && <SignaturePad />}
//       </div>
//     );
//   };

//   // 🪄 Handle drag reorder
//   const handleDragEnd = (event) => {
//     const { active, over } = event;
//     if (active.id !== over?.id) {
//       const activeId = active.id;
//       const overId = over.id;
      
//       const oldIndex = fields.findIndex((f) => f.id === activeId);
//       const newIndex = fields.findIndex((f) => f.id === overId);
//       setFields(arrayMove(fields, oldIndex, newIndex));
//     }
//   };

//   // 💾 Save Template to API
//   const handleSave = async () => {
//     if (!template) return toast.error("No template found to save!");
//     setLoading(true);
//     try {
//       const payload = {
//         fields,
//         background,
//         fontSize,
//       };
      
//       // Update with templateid and the new payload
//       const res = await axios.put(`/api/update-template/${templateid}`, payload); 
      
//       if (res.data.success) {
//         toast.success("Template updated successfully! 🎉");
//       } else {
//         toast.error(res.data.message || "Failed to update template");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Error saving template. Check console for details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const templateStyle = {
//     background,
//     fontSize: `${fontSize}px`,
//     minHeight: "80vh",
//     border: "2px dashed #ccc",
//     borderRadius: "16px",
//     padding: "20px",
//   };

//   return (
//     <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
//       {/* 🎛️ Sidebar Controls */}
//       <div className="md:col-span-1 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-lg border h-fit sticky top-6">
//         <h2 className="text-lg font-bold mb-4 border-b pb-2">Editor Controls</h2>

//         <div className="space-y-6">
//           {/* 🎨 Style Controls */}
//           <div className="space-y-4">
//             <div>
//               <label className="text-sm font-medium text-gray-700 block mb-1">Background Color</label>
//               <Input
//                 type="color"
//                 value={background}
//                 onChange={(e) => setBackground(e.target.value)}
//                 className="h-10 p-0 cursor-pointer"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-700 block mb-1">Font Size (px)</label>
//               <Input
//                 type="number"
//                 min="12"
//                 max="40"
//                 value={fontSize}
//                 onChange={(e) => setFontSize(Number(e.target.value))}
//               />
//             </div>
//           </div>

//           {/* 🏢 Company Info Toggles */}
//           <div className="border-t pt-4">
//             <h3 className="font-semibold mb-2 flex items-center gap-2">
//               <Building className="w-4 h-4 text-blue-600" /> Company Info Display
//             </h3>
//             {Object.keys(showCompanyInfo).map((key) => (
//               <label key={key} className="flex items-center gap-2 mb-1 text-sm text-gray-700">
//                 <input
//                   type="checkbox"
//                   checked={showCompanyInfo[key]}
//                   onChange={(e) =>
//                     setShowCompanyInfo({
//                       ...showCompanyInfo,
//                       [key]: e.target.checked,
//                     })
//                   }
//                   className="rounded text-blue-600 focus:ring-blue-500"
//                 />
//                 <span className="capitalize">{key}</span>
//               </label>
//             ))}
//           </div>

//           {/* ➕ Field Type Buttons */}
//           <div className="space-y-2 border-t pt-4">
//             <h3 className="font-semibold mb-2">Add New Field</h3>
//             <Button
//               variant="outline"
//               className="w-full justify-start text-left"
//               onClick={() => handleAddField(FIELD_TYPES.TEXT)}
//             >
//               <Type className="mr-2 h-4 w-4 text-orange-500" /> Add Text Input
//             </Button>

//             <Button
//               variant="outline"
//               className="w-full justify-start text-left"
//               onClick={() => handleAddField(FIELD_TYPES.TEXTAREA)}
//             >
//               <FileText className="mr-2 h-4 w-4 text-purple-500" /> Add Textarea
//             </Button>

//             <Button
//               variant="outline"
//               className="w-full justify-start text-left"
//               onClick={() => handleAddField(FIELD_TYPES.SIGNATURE)}
//             >
//               <PenLine className="mr-2 h-4 w-4 text-green-500" /> Add Signature Pad
//             </Button>
//           </div>
          
//           {/* 💾 Save Button */}
//           <Button
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg mt-6"
//             onClick={handleSave}
//             disabled={loading}
//           >
//             <Save className="mr-2 h-4 w-4" />
//             {loading ? "Saving..." : "Save Template Changes"}
//           </Button>
//         </div>
//       </div>

//       {/* 🧩 Main Template Area */}
//       <div className="md:col-span-3 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner">
//         <h2 className="text-2xl font-extrabold mb-6 text-center text-gray-800">
//           📄 {template?.name || "Template"} Preview & Builder
//         </h2>

//         {template ? (
//           <div style={templateStyle} className="shadow-2xl mx-auto max-w-2xl">
//             {/* 🏢 Company Header */}
//             {template?.company && (
//               <div className="flex justify-between items-start mb-8 pb-4 border-b border-gray-200">
//                 <div>
//                   {showCompanyInfo.logo && template.company.companyLogo && (
//                     <img
//                       src={template.company.companyLogo}
//                       alt="Company Logo"
//                       className="w-16 h-16 object-contain mb-2"
//                     />
//                   )}
//                   <h3 className="text-xl font-bold text-gray-800">
//                     {template.company.name}
//                   </h3>
//                 </div>
//                 <div className="text-right text-sm text-gray-600 space-y-0.5">
//                   {showCompanyInfo.address && template.company.companyAddress && (
//                     <p>{template.company.companyAddress}</p>
//                   )}
//                   {showCompanyInfo.phone && template.company.companyPhoneNumber && (
//                     <p>📞 {template.company.companyPhoneNumber}</p>
//                   )}
//                   {showCompanyInfo.website && template.company.companyWebsite && (
//                     <p>
//                       🌐{" "}
//                       <a
//                         href={template.company.companyWebsite}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="underline text-blue-500"
//                       >
//                         {template.company.companyWebsite}
//                       </a>
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* ✏️ Editable & Draggable Fields */}
//             <DndContext
//               collisionDetection={closestCenter}
//               onDragEnd={handleDragEnd}
//             >
//               <SortableContext
//                 items={fields.map(f => f.id)} // Pass only the IDs to SortableContext
//                 strategy={verticalListSortingStrategy}
//               >
//                 {fields.map((field) => (
//                   <SortableField key={field.id} field={field} />
//                 ))}
//               </SortableContext>
//             </DndContext>
            
//             {fields.length === 0 && (
//                 <div className="text-center p-10 text-gray-400 border border-dashed border-gray-300 rounded-lg mt-4">
//                     <p>Add fields from the sidebar to start building your template.</p>
//                 </div>
//             )}
//           </div>
//         ) : (
//           <p className="text-center text-gray-500 p-20">Loading Template...</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TemplateEditorPage;


// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "next/navigation";
// import axios from "axios";
// import toast from "react-hot-toast";
// // Assuming you have these components/icons available
// import { Button } from "@/components/ui/button"; 
// import { Input } from "@/components/ui/input"; 
// import {
//   Type,
//   FileText,
//   PenLine,
//   Building,
//   Trash2,
//   Save,
// } from "lucide-react";
// import { DndContext, closestCenter } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";

// // 🎨 Field Types
// const FIELD_TYPES = {
//   TEXT: "text",
//   TEXTAREA: "textarea",
//   SIGNATURE: "signature",
// };

// const TemplateEditorPage = () => {
//   const { templateid } = useParams();
//   const [template, setTemplate] = useState(null);
//   const [fields, setFields] = useState([]);
//   const [background, setBackground] = useState("#ffffff");
//   const [fontSize, setFontSize] = useState(16);
//   const [loading, setLoading] = useState(false);
//   const [showCompanyInfo, setShowCompanyInfo] = useState({
//     logo: true,
//     address: true,
//     phone: true,
//     website: true,
//   });

//   // 🧠 Fetch Template Data
//   useEffect(() => {
//     const fetchTemplate = async () => {
//       try {
//         // Replace with your actual API endpoint for fetching template data
//         const res = await axios.get(`/api/get-template/${templateid}`); 
//         if (res.data.success) {
//           const { template: fetchedTemplate } = res.data;
//           setTemplate(fetchedTemplate);
//           setFields(fetchedTemplate.fields || []);
          
//           if (fetchedTemplate.background) setBackground(fetchedTemplate.background);
//           if (fetchedTemplate.fontSize) setFontSize(fetchedTemplate.fontSize);
//         } else {
//           toast.error("Template not found!");
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("Failed to fetch template data");
//       }
//     };
//     fetchTemplate();
//   }, [templateid]);

//   // ➕ Add New Field
//   const handleAddField = (type) => {
//     const newField = {
//       id: Date.now() + Math.random(), 
//       type,
//       label:
//         type === FIELD_TYPES.TEXT
//           ? "New Text Field"
//           : type === FIELD_TYPES.TEXTAREA
//           ? "New Textarea Field"
//           : "New Signature Field",
//       value: "",
//     };
//     setFields((prev) => [...prev, newField]);
//   };

//   // 🗑️ Delete Field
//   const handleDeleteField = (id) => {
//     setFields(fields.filter((f) => f.id !== id));
//     toast.success("Field deleted!");
//   };

//   // ✍️ Signature Component 
//   const SignaturePad = () => {
//     const canvasRef = useRef(null);

//     useEffect(() => {
//       const canvas = canvasRef.current;
//       if (!canvas) return;
//       const ctx = canvas.getContext("2d");
//       ctx.lineWidth = 2;
//       ctx.lineCap = "round";
//       ctx.strokeStyle = '#000000';
//       let drawing = false;

//       const getMousePos = (e) => {
//         const rect = canvas.getBoundingClientRect();
//         return {
//           x: e.clientX - rect.left,
//           y: e.clientY - rect.top,
//         };
//       };

//       const start = (e) => {
//         // Prevent accidental scrolling while drawing
//         e.preventDefault(); 
//         drawing = true;
//         const pos = getMousePos(e);
//         ctx.beginPath();
//         ctx.moveTo(pos.x, pos.y);
//       };

//       const draw = (e) => {
//         if (!drawing) return;
//         const pos = getMousePos(e);
//         ctx.lineTo(pos.x, pos.y);
//         ctx.stroke();
//       };

//       const stop = () => (drawing = false);

//       // Mouse Listeners
//       canvas.addEventListener("mousedown", start);
//       canvas.addEventListener("mousemove", draw);
//       canvas.addEventListener("mouseup", stop);
//       canvas.addEventListener("mouseleave", stop);
      
//       // Touch Listeners for mobile
//       canvas.addEventListener('touchstart', (e) => start(e.touches[0]), { passive: false });
//       canvas.addEventListener('touchmove', (e) => draw(e.touches[0]), { passive: false });
//       canvas.addEventListener('touchend', stop);

//       // Cleanup
//       return () => {
//         canvas.removeEventListener("mousedown", start);
//         canvas.removeEventListener("mousemove", draw);
//         canvas.removeEventListener("mouseup", stop);
//         canvas.removeEventListener("mouseleave", stop);
//         canvas.removeEventListener('touchstart', (e) => start(e.touches[0]));
//         canvas.removeEventListener('touchmove', (e) => draw(e.touches[0]));
//         canvas.removeEventListener('touchend', stop);
//       };
//     }, []);

//     const clearSignature = () => {
//         const canvas = canvasRef.current;
//         if (canvas) {
//             const ctx = canvas.getContext("2d");
//             ctx.clearRect(0, 0, canvas.width, canvas.height);
//         }
//     }

//     return (
//       <div className="border rounded-md p-2 bg-gray-50 mt-2">
//         <canvas
//           ref={canvasRef}
//           width={400}
//           height={120}
//           className="border rounded-md w-full bg-white touch-none" // touch-none prevents browser default touch behavior
//         />
//         <div className="flex justify-between items-center mt-2">
//             <p className="text-xs text-gray-500">Sign above ⬆️ (Click & Drag)</p>
//             <Button variant="ghost" size="sm" onClick={clearSignature} className="text-red-500 hover:text-red-700">Clear</Button>
//         </div>
//       </div>
//     );
//   };

//   // 🧱 Sortable Field Component (FIXED to allow typing)
//   const SortableField = ({ field }) => {
//     const { attributes, listeners, setNodeRef, transform, transition } =
//       useSortable({ id: field.id });

//     const style = {
//       transform: CSS.Transform.toString(transform),
//       transition,
//     };

//     const updateField = (key, value) => {
//       setFields((prev) =>
//         prev.map((f) => (f.id === field.id ? { ...f, [key]: value } : f))
//       );
//     };

//     return (
//       <div
//         ref={setNodeRef}
//         style={style}
//         className="bg-white p-4 rounded-lg border shadow-sm mb-3"
//       >
//         <div className="flex justify-between items-center mb-3">
          
//           {/* === DRAG HANDLE (Only this element has the listeners/attributes) === */}
//           <div 
//             className="cursor-grab p-2 -ml-2 -mt-2 mr-2 opacity-50 hover:opacity-100 transition-opacity"
//             {...attributes} 
//             {...listeners}
//             title="Drag to reorder"
//           >
//               <span className="text-gray-400 font-extrabold text-xl">⋮⋮</span>
//           </div>
//           {/* =================================================================== */}

//           <Input
//             value={field.label}
//             onChange={(e) => updateField("label", e.target.value)}
//             className="font-semibold text-gray-800 flex-grow mr-4"
//             placeholder="Field Label"
//           />
//           <Trash2
//             onClick={() => handleDeleteField(field.id)}
//             className="text-red-500 cursor-pointer hover:opacity-75 transition-opacity"
//             size={18}
//             title="Delete Field"
//           />
//         </div>

//         {/* Field Input Area (Now correctly focusable) */}
//         {field.type === FIELD_TYPES.TEXT && (
//           <Input
//             placeholder="[User will enter text here]"
//             value={field.value}
//             onChange={(e) => updateField("value", e.target.value)}
//             className="w-full"
//           />
//         )}

//         {field.type === FIELD_TYPES.TEXTAREA && (
//           <textarea
//             className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//             rows={3}
//             placeholder="[User will enter a long text here]"
//             value={field.value}
//             onChange={(e) => updateField("value", e.target.value)}
//           />
//         )}

//         {field.type === FIELD_TYPES.SIGNATURE && <SignaturePad />}
//       </div>
//     );
//   };

//   // 🪄 Handle drag reorder
//   const handleDragEnd = (event) => {
//     const { active, over } = event;
//     if (active.id !== over?.id) {
//       const activeId = active.id;
//       const overId = over.id;
      
//       const oldIndex = fields.findIndex((f) => f.id === activeId);
//       const newIndex = fields.findIndex((f) => f.id === overId);
//       setFields(arrayMove(fields, oldIndex, newIndex));
//     }
//   };

//   // 💾 Save Template to API
//   const handleSave = async () => {
//     if (!template) return toast.error("No template found to save!");
//     setLoading(true);
//     try {
//       const payload = {
//         fields,
//         background,
//         fontSize,
//       };
      
//       // Replace with your actual API endpoint for updating template data
//       const res = await axios.put(`/api/update-template/${templateid}`, payload); 
      
//       if (res.data.success) {
//         toast.success("Template updated successfully! 🎉");
//       } else {
//         toast.error(res.data.message || "Failed to update template");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Error saving template. Check console for details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const templateStyle = {
//     background,
//     fontSize: `${fontSize}px`,
//     minHeight: "80vh",
//     border: "2px dashed #ccc",
//     borderRadius: "16px",
//     padding: "20px",
//   };

//   return (
//     <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
//       {/* 🎛️ Sidebar Controls */}
//       <div className="md:col-span-1 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-lg border h-fit sticky top-6">
//         <h2 className="text-lg font-bold mb-4 border-b pb-2">Editor Controls</h2>

//         <div className="space-y-6">
//           {/* 🎨 Style Controls */}
//           <div className="space-y-4">
//             <div>
//               <label className="text-sm font-medium text-gray-700 block mb-1">Background Color</label>
//               <Input
//                 type="color"
//                 value={background}
//                 onChange={(e) => setBackground(e.target.value)}
//                 className="h-10 p-0 cursor-pointer"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-700 block mb-1">Font Size (px)</label>
//               <Input
//                 type="number"
//                 min="12"
//                 max="40"
//                 value={fontSize}
//                 onChange={(e) => setFontSize(Number(e.target.value))}
//               />
//             </div>
//           </div>

//           {/* 🏢 Company Info Toggles */}
//           <div className="border-t pt-4">
//             <h3 className="font-semibold mb-2 flex items-center gap-2">
//               <Building className="w-4 h-4 text-blue-600" /> Company Info Display
//             </h3>
//             {Object.keys(showCompanyInfo).map((key) => (
//               <label key={key} className="flex items-center gap-2 mb-1 text-sm text-gray-700">
//                 <input
//                   type="checkbox"
//                   checked={showCompanyInfo[key]}
//                   onChange={(e) =>
//                     setShowCompanyInfo({
//                       ...showCompanyInfo,
//                       [key]: e.target.checked,
//                     })
//                   }
//                   className="rounded text-blue-600 focus:ring-blue-500"
//                 />
//                 <span className="capitalize">{key}</span>
//               </label>
//             ))}
//           </div>

//           {/* ➕ Field Type Buttons */}
//           <div className="space-y-2 border-t pt-4">
//             <h3 className="font-semibold mb-2">Add New Field</h3>
//             <Button
//               variant="outline"
//               className="w-full justify-start text-left"
//               onClick={() => handleAddField(FIELD_TYPES.TEXT)}
//             >
//               <Type className="mr-2 h-4 w-4 text-orange-500" /> Add Text Input
//             </Button>

//             <Button
//               variant="outline"
//               className="w-full justify-start text-left"
//               onClick={() => handleAddField(FIELD_TYPES.TEXTAREA)}
//             >
//               <FileText className="mr-2 h-4 w-4 text-purple-500" /> Add Textarea
//             </Button>

//             <Button
//               variant="outline"
//               className="w-full justify-start text-left"
//               onClick={() => handleAddField(FIELD_TYPES.SIGNATURE)}
//             >
//               <PenLine className="mr-2 h-4 w-4 text-green-500" /> Add Signature Pad
//             </Button>
//           </div>
          
//           {/* 💾 Save Button */}
//           <Button
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg mt-6"
//             onClick={handleSave}
//             disabled={loading}
//           >
//             <Save className="mr-2 h-4 w-4" />
//             {loading ? "Saving..." : "Save Template Changes"}
//           </Button>
//         </div>
//       </div>

//       {/* 🧩 Main Template Area */}
//       <div className="md:col-span-3 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner">
//         <h2 className="text-2xl font-extrabold mb-6 text-center text-gray-800">
//           📄 {template?.name || "Template"} Preview & Builder
//         </h2>

//         {template ? (
//           <div style={templateStyle} className="shadow-2xl mx-auto max-w-2xl">
//             {/* 🏢 Company Header */}
//             {template?.company && (
//               <div className="flex justify-between items-start mb-8 pb-4 border-b border-gray-200">
//                 <div>
//                   {showCompanyInfo.logo && template.company.companyLogo && (
//                     <img
//                       src={template.company.companyLogo}
//                       alt="Company Logo"
//                       className="w-16 h-16 object-contain mb-2"
//                     />
//                   )}
//                   <h3 className="text-xl font-bold text-gray-800">
//                     {template.company.name}
//                   </h3>
//                 </div>
//                 <div className="text-right text-sm text-gray-600 space-y-0.5">
//                   {showCompanyInfo.address && template.company.companyAddress && (
//                     <p>{template.company.companyAddress}</p>
//                   )}
//                   {showCompanyInfo.phone && template.company.companyPhoneNumber && (
//                     <p>📞 {template.company.companyPhoneNumber}</p>
//                   )}
//                   {showCompanyInfo.website && template.company.companyWebsite && (
//                     <p>
//                       🌐{" "}
//                       <a
//                         href={template.company.companyWebsite}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="underline text-blue-500"
//                       >
//                         {template.company.companyWebsite}
//                       </a>
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* ✏️ Editable & Draggable Fields */}
//             <DndContext
//               collisionDetection={closestCenter}
//               onDragEnd={handleDragEnd}
//             >
//               <SortableContext
//                 items={fields.map(f => f.id)} 
//                 strategy={verticalListSortingStrategy}
//               >
//                 {fields.map((field) => (
//                   <SortableField key={field.id} field={field} />
//                 ))}
//               </SortableContext>
//             </DndContext>
            
//             {fields.length === 0 && (
//                 <div className="text-center p-10 text-gray-400 border border-dashed border-gray-300 rounded-lg mt-4">
//                     <p>Add fields from the sidebar to start building your template.</p>
//                 </div>
//             )}
//           </div>
//         ) : (
//           <p className="text-center text-gray-500 p-20">Loading Template...</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TemplateEditorPage;

// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "next/navigation";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Type,
//   FileText,
//   PenLine,
//   Building,
//   Trash2,
//   Save,
// } from "lucide-react";
// import { DndContext, closestCenter } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";

// // 🎨 Field Types
// const FIELD_TYPES = {
//   TEXT: "text",
//   TEXTAREA: "textarea",
//   SIGNATURE: "signature",
// };

// const TemplateEditorPage = () => {
//   const { templateid } = useParams();
//   const [template, setTemplate] = useState(null);
//   const [fields, setFields] = useState([]);
//   const [background, setBackground] = useState("#ffffff");
//   const [fontSize, setFontSize] = useState(16);
//   const [loading, setLoading] = useState(false);
//   const [showCompanyInfo, setShowCompanyInfo] = useState({
//     logo: true,
//     address: true,
//     phone: true,
//     website: true,
//   });

//   // 🧠 Fetch Template Data
//   useEffect(() => {
//     const fetchTemplate = async () => {
//       try {
//         const res = await axios.get(`/api/get-template/${templateid}`); 
//         if (res.data.success) {
//           const { template: fetchedTemplate } = res.data;
//           setTemplate(fetchedTemplate);
//           setFields(fetchedTemplate.fields || []);
          
//           if (fetchedTemplate.background) setBackground(fetchedTemplate.background);
//           if (fetchedTemplate.fontSize) setFontSize(fetchedTemplate.fontSize);
//         } else {
//           toast.error("Template not found!");
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("Failed to fetch template data");
//       }
//     };
//     fetchTemplate();
//   }, [templateid]);

//   // ➕ Add New Field
//   const handleAddField = (type) => {
//     const newField = {
//       id: Date.now() + Math.random(), 
//       type,
//       label:
//         type === FIELD_TYPES.TEXT
//           ? "New Text Field"
//           : type === FIELD_TYPES.TEXTAREA
//           ? "New Textarea Field"
//           : "New Signature Field",
//       value: "",
//     };
//     setFields((prev) => [...prev, newField]);
//   };

//   // 🗑️ Delete Field
//   const handleDeleteField = (id) => {
//     setFields(fields.filter((f) => f.id !== id));
//     toast.success("Field deleted!");
//   };

//   // ✍️ Signature Component 
//   const SignaturePad = () => {
//     const canvasRef = useRef(null);

//     useEffect(() => {
//       const canvas = canvasRef.current;
//       if (!canvas) return;
//       const ctx = canvas.getContext("2d");
//       ctx.lineWidth = 2;
//       ctx.lineCap = "round";
//       ctx.strokeStyle = '#000000';
//       let drawing = false;

//       const getMousePos = (e) => {
//         const rect = canvas.getBoundingClientRect();
//         return {
//           x: e.clientX - rect.left,
//           y: e.clientY - rect.top,
//         };
//       };

//       const start = (e) => {
//         e.preventDefault(); 
//         drawing = true;
//         const pos = getMousePos(e);
//         ctx.beginPath();
//         ctx.moveTo(pos.x, pos.y);
//       };

//       const draw = (e) => {
//         if (!drawing) return;
//         const pos = getMousePos(e);
//         ctx.lineTo(pos.x, pos.y);
//         ctx.stroke();
//       };

//       const stop = () => (drawing = false);

//       // Mouse Listeners
//       canvas.addEventListener("mousedown", start);
//       canvas.addEventListener("mousemove", draw);
//       canvas.addEventListener("mouseup", stop);
//       canvas.addEventListener("mouseleave", stop);
      
//       // Touch Listeners for mobile
//       canvas.addEventListener('touchstart', (e) => start(e.touches[0]), { passive: false });
//       canvas.addEventListener('touchmove', (e) => draw(e.touches[0]), { passive: false });
//       canvas.addEventListener('touchend', stop);

//       // Cleanup
//       return () => {
//         canvas.removeEventListener("mousedown", start);
//         canvas.removeEventListener("mousemove", draw);
//         canvas.removeEventListener("mouseup", stop);
//         canvas.removeEventListener("mouseleave", stop);
//         canvas.removeEventListener('touchstart', (e) => start(e.touches[0]));
//         canvas.removeEventListener('touchmove', (e) => draw(e.touches[0]));
//         canvas.removeEventListener('touchend', stop);
//       };
//     }, []);

//     const clearSignature = () => {
//         const canvas = canvasRef.current;
//         if (canvas) {
//             const ctx = canvas.getContext("2d");
//             ctx.clearRect(0, 0, canvas.width, canvas.height);
//         }
//     }

//     return (
//       <div className="border rounded-md p-2 bg-gray-50 mt-2">
//         <canvas
//           ref={canvasRef}
//           width={400}
//           height={120}
//           className="border rounded-md w-full bg-white touch-none" 
//         />
//         <div className="flex justify-between items-center mt-2">
//             <p className="text-xs text-gray-500">Sign above ⬆️ (Click & Drag)</p>
//             <Button variant="ghost" size="sm" onClick={clearSignature} className="text-red-500 hover:text-red-700">Clear</Button>
//         </div>
//       </div>
//     );
//   };

//   // 🧱 Sortable Field Component (FIXED for fast typing)
//   const SortableField = ({ field }) => {
//     const { attributes, listeners, setNodeRef, transform, transition } =
//       useSortable({ id: field.id });

//     const style = {
//       transform: CSS.Transform.toString(transform),
//       transition,
//     };

//     // 🌟 FIX: Optimized updateField to prevent unnecessary re-renders
//     const updateField = (key, value) => {
//       setFields((prev) =>
//         prev.map((f) => {
//           // Only create a new object (and trigger re-render) if the value has actually changed
//           if (f.id === field.id && f[key] !== value) {
//             return { ...f, [key]: value };
//           }
//           return f; // Return unchanged field, preserving focus
//         })
//       );
//     };

//     const handleValueChange = (e) => {
//         updateField("value", e.target.value);
//     }

//     const handleLabelChange = (e) => {
//         updateField("label", e.target.value);
//     }

//     return (
//       <div
//         ref={setNodeRef}
//         style={style}
//         className="bg-white p-4 rounded-lg border shadow-sm mb-3"
//       >
//         <div className="flex justify-between items-center mb-3">
          
//           {/* === DRAG HANDLE (Listeners are here for drag only) === */}
//           <div 
//             className="cursor-grab p-2 -ml-2 -mt-2 mr-2 opacity-50 hover:opacity-100 transition-opacity"
//             {...attributes} 
//             {...listeners}
//             title="Drag to reorder"
//           >
//               <span className="text-gray-400 font-extrabold text-xl">⋮⋮</span>
//           </div>
//           {/* ====================================================== */}

//           <Input
//             value={field.label}
//             onChange={handleLabelChange} // Uses optimized handler
//             className="font-semibold text-gray-800 flex-grow mr-4"
//             placeholder="Field Label"
//           />
//           <Trash2
//             onClick={() => handleDeleteField(field.id)}
//             className="text-red-500 cursor-pointer hover:opacity-75 transition-opacity"
//             size={18}
//             title="Delete Field"
//           />
//         </div>

//         {/* Field Input Area (Now focuses correctly) */}
//         {field.type === FIELD_TYPES.TEXT && (
//           <Input
//             placeholder="[User will enter text here]"
//             value={field.value}
//             onChange={handleValueChange} // Uses optimized handler
//             className="w-full"
//           />
//         )}

//         {field.type === FIELD_TYPES.TEXTAREA && (
//           <textarea
//             className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//             rows={3}
//             placeholder="[User will enter a long text here]"
//             value={field.value}
//             onChange={handleValueChange} // Uses optimized handler
//           />
//         )}

//         {field.type === FIELD_TYPES.SIGNATURE && <SignaturePad />}
//       </div>
//     );
//   };

//   // 🪄 Handle drag reorder
//   const handleDragEnd = (event) => {
//     const { active, over } = event;
//     if (active.id !== over?.id) {
//       const activeId = active.id;
//       const overId = over.id;
      
//       const oldIndex = fields.findIndex((f) => f.id === activeId);
//       const newIndex = fields.findIndex((f) => f.id === overId);
//       setFields(arrayMove(fields, oldIndex, newIndex));
//     }
//   };

//   // 💾 Save Template to API
//   const handleSave = async () => {
//     if (!template) return toast.error("No template found to save!");
//     setLoading(true);
//     try {
//       const payload = {
//         fields,
//         background,
//         fontSize,
//       };
      
//       const res = await axios.put(`/api/update-template/${templateid}`, payload); 
      
//       if (res.data.success) {
//         toast.success("Template updated successfully! 🎉");
//       } else {
//         toast.error(res.data.message || "Failed to update template");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Error saving template. Check console for details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const templateStyle = {
//     background,
//     fontSize: `${fontSize}px`,
//     minHeight: "80vh",
//     border: "2px dashed #ccc",
//     borderRadius: "16px",
//     padding: "20px",
//   };

//   return (
//     <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
//       {/* 🎛️ Sidebar Controls */}
//       <div className="md:col-span-1 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-lg border h-fit sticky top-6">
//         <h2 className="text-lg font-bold mb-4 border-b pb-2">Editor Controls</h2>

//         <div className="space-y-6">
//           {/* 🎨 Style Controls */}
//           <div className="space-y-4">
//             <div>
//               <label className="text-sm font-medium text-gray-700 block mb-1">Background Color</label>
//               <Input
//                 type="color"
//                 value={background}
//                 onChange={(e) => setBackground(e.target.value)}
//                 className="h-10 p-0 cursor-pointer"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-700 block mb-1">Font Size (px)</label>
//               <Input
//                 type="number"
//                 min="12"
//                 max="40"
//                 value={fontSize}
//                 onChange={(e) => setFontSize(Number(e.target.value))}
//               />
//             </div>
//           </div>

//           {/* 🏢 Company Info Toggles */}
//           <div className="border-t pt-4">
//             <h3 className="font-semibold mb-2 flex items-center gap-2">
//               <Building className="w-4 h-4 text-blue-600" /> Company Info Display
//             </h3>
//             {Object.keys(showCompanyInfo).map((key) => (
//               <label key={key} className="flex items-center gap-2 mb-1 text-sm text-gray-700">
//                 <input
//                   type="checkbox"
//                   checked={showCompanyInfo[key]}
//                   onChange={(e) =>
//                     setShowCompanyInfo({
//                       ...showCompanyInfo,
//                       [key]: e.target.checked,
//                     })
//                   }
//                   className="rounded text-blue-600 focus:ring-blue-500"
//                 />
//                 <span className="capitalize">{key}</span>
//               </label>
//             ))}
//           </div>

//           {/* ➕ Field Type Buttons */}
//           <div className="space-y-2 border-t pt-4">
//             <h3 className="font-semibold mb-2">Add New Field</h3>
//             <Button
//               variant="outline"
//               className="w-full justify-start text-left"
//               onClick={() => handleAddField(FIELD_TYPES.TEXT)}
//             >
//               <Type className="mr-2 h-4 w-4 text-orange-500" /> Add Text Input
//             </Button>

//             <Button
//               variant="outline"
//               className="w-full justify-start text-left"
//               onClick={() => handleAddField(FIELD_TYPES.TEXTAREA)}
//             >
//               <FileText className="mr-2 h-4 w-4 text-purple-500" /> Add Textarea
//             </Button>

//             <Button
//               variant="outline"
//               className="w-full justify-start text-left"
//               onClick={() => handleAddField(FIELD_TYPES.SIGNATURE)}
//             >
//               <PenLine className="mr-2 h-4 w-4 text-green-500" /> Add Signature Pad
//             </Button>
//           </div>
          
//           {/* 💾 Save Button */}
//           <Button
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg mt-6"
//             onClick={handleSave}
//             disabled={loading}
//           >
//             <Save className="mr-2 h-4 w-4" />
//             {loading ? "Saving..." : "Save Template Changes"}
//           </Button>
//         </div>
//       </div>

//       {/* 🧩 Main Template Area */}
//       <div className="md:col-span-3 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner">
//         <h2 className="text-2xl font-extrabold mb-6 text-center text-gray-800">
//           📄 {template?.name || "Template"} Preview & Builder
//         </h2>

//         {template ? (
//           <div style={templateStyle} className="shadow-2xl mx-auto max-w-2xl">
//             {/* 🏢 Company Header */}
//             {template?.company && (
//               <div className="flex justify-between items-start mb-8 pb-4 border-b border-gray-200">
//                 <div>
//                   {showCompanyInfo.logo && template.company.companyLogo && (
//                     <img
//                       src={template.company.companyLogo}
//                       alt="Company Logo"
//                       className="w-16 h-16 object-contain mb-2"
//                     />
//                   )}
//                   <h3 className="text-xl font-bold text-gray-800">
//                     {template.company.name}
//                   </h3>
//                 </div>
//                 <div className="text-right text-sm text-gray-600 space-y-0.5">
//                   {showCompanyInfo.address && template.company.companyAddress && (
//                     <p>{template.company.companyAddress}</p>
//                   )}
//                   {showCompanyInfo.phone && template.company.companyPhoneNumber && (
//                     <p>📞 {template.company.companyPhoneNumber}</p>
//                   )}
//                   {showCompanyInfo.website && template.company.companyWebsite && (
//                     <p>
//                       🌐{" "}
//                       <a
//                         href={template.company.companyWebsite}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="underline text-blue-500"
//                       >
//                         {template.company.companyWebsite}
//                       </a>
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* ✏️ Editable & Draggable Fields */}
//             <DndContext
//               collisionDetection={closestCenter}
//               onDragEnd={handleDragEnd}
//             >
//               <SortableContext
//                 items={fields.map(f => f.id)} 
//                 strategy={verticalListSortingStrategy}
//               >
//                 {fields.map((field) => (
//                   <SortableField key={field.id} field={field} />
//                 ))}
//               </SortableContext>
//             </DndContext>
            
//             {fields.length === 0 && (
//                 <div className="text-center p-10 text-gray-400 border border-dashed border-gray-300 rounded-lg mt-4">
//                     <p>Add fields from the sidebar to start building your template.</p>
//                 </div>
//             )}
//           </div>
//         ) : (
//           <p className="text-center text-gray-500 p-20">Loading Template...</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TemplateEditorPage;

"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Type,
  FileText,
  PenLine,
  Building,
  Trash2,
  Save,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  MousePointerClick,
} from "lucide-react";

// Dnd Kit Imports
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// 🎨 Field Types
const FIELD_TYPES = {
  TEXT: "text",
  TEXTAREA: "textarea",
  SIGNATURE: "signature",
  BUTTON: "button", // New Field Type
  COMPANY_INFO_BLOCK: "company_info_block", // Internal DND block for header
};

// 🌟 New: Alignment map for Tailwind CSS classes
const ALIGNMENT_MAP = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

// 🌟 New: Width/Class map for layout control
const WIDTH_CLASSES = [
  { label: "Full Width", value: "w-full" },
  { label: "Half Width (1/2)", value: "w-1/2" },
  { label: "Third Width (1/3)", value: "w-1/3" },
];

const TemplateEditorPage = () => {
  const { templateid } = useParams();
  const [template, setTemplate] = useState(null);
  const [fields, setFields] = useState([]);
  const [background, setBackground] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(16);
  const [loading, setLoading] = useState(false);
  const [showCompanyInfo, setShowCompanyInfo] = useState({
    logo: true,
    address: true,
    phone: true,
    website: true,
  });

  // 🧠 Fetch Template Data
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await axios.get(`/api/get-template/${templateid}`);
        if (res.data.success) {
          const fetchedTemplate = res.data.template;
          setTemplate(fetchedTemplate);
          
          // 🌟 Initialization: Add Company Info block if fields are empty
          let initialFields = fetchedTemplate.fields || [];
          if (initialFields.length === 0 || !initialFields.some(f => f.type === FIELD_TYPES.COMPANY_INFO_BLOCK)) {
              initialFields = [{ id: 'company-header', type: FIELD_TYPES.COMPANY_INFO_BLOCK, label: 'Company Header', isFixed: true }, ...initialFields];
          }

          setFields(initialFields);
          if (fetchedTemplate.background) setBackground(fetchedTemplate.background);
          if (fetchedTemplate.fontSize) setFontSize(fetchedTemplate.fontSize);
        } else {
          toast.error("Template not found!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch template data");
      }
    };
    fetchTemplate();
  }, [templateid]);

  // ➕ Add New Field
  const handleAddField = (type) => {
    let newField;
    const commonProps = { id: Date.now() + Math.random(), type, isFixed: false, class: 'w-full' };
    
    if (type === FIELD_TYPES.BUTTON) {
      newField = { ...commonProps, label: "New Button", buttonText: "Click Me", link: "#", style: { variant: 'default' } };
    } else if (type === FIELD_TYPES.TEXT) {
      newField = { ...commonProps, label: "New Text Field", value: "", style: { isBold: false, isItalic: false, align: 'left' } };
    } else if (type === FIELD_TYPES.TEXTAREA) {
      newField = { ...commonProps, label: "New Textarea Field", value: "", style: { isBold: false, isItalic: false, align: 'left' } };
    } else if (type === FIELD_TYPES.SIGNATURE) {
      newField = { ...commonProps, label: "New Signature Field", value: "" };
    } else {
      return;
    }

    setFields((prev) => [...prev, newField]);
  };

  // 🗑️ Delete Field
  const handleDeleteField = (id) => {
    setFields(fields.filter((f) => f.id !== id));
    toast.success("Field deleted!");
  };

  // ✍️ Signature Component (Unchanged for drawing logic)
  const SignaturePad = () => {
    const canvasRef = useRef(null);
    // ... [SignaturePad useEffect logic remains the same] ... 
    // Simplified for brevity, assume it works.
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = '#000000';
      let drawing = false;

      const getMousePos = (e) => {
        const rect = canvas.getBoundingClientRect();
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      };

      const start = (e) => {
        e.preventDefault(); 
        drawing = true;
        const pos = getMousePos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
      };

      const draw = (e) => {
        if (!drawing) return;
        const pos = getMousePos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      };

      const stop = () => (drawing = false);

      canvas.addEventListener("mousedown", start);
      canvas.addEventListener("mousemove", draw);
      canvas.addEventListener("mouseup", stop);
      canvas.addEventListener("mouseleave", stop);
      
      canvas.addEventListener('touchstart', (e) => start(e.touches[0]), { passive: false });
      canvas.addEventListener('touchmove', (e) => draw(e.touches[0]), { passive: false });
      canvas.addEventListener('touchend', stop);

      return () => {
        canvas.removeEventListener("mousedown", start);
        canvas.removeEventListener("mousemove", draw);
        canvas.removeEventListener("mouseup", stop);
        canvas.removeEventListener("mouseleave", stop);
        canvas.removeEventListener('touchstart', (e) => start(e.touches[0]));
        canvas.removeEventListener('touchmove', (e) => draw(e.touches[0]));
        canvas.removeEventListener('touchend', stop);
      };
    }, []);

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    return (
      <div className="border rounded-md p-2 bg-gray-50 mt-2">
        <canvas
          ref={canvasRef}
          width={400}
          height={120}
          className="border rounded-md w-full bg-white touch-none"
        />
        <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">Sign above ⬆️</p>
            <Button variant="ghost" size="sm" onClick={clearSignature} className="text-red-500 hover:text-red-700">Clear</Button>
        </div>
      </div>
    );
  };
  
  // 🧱 Sortable Field Component (Main logic)
  const SortableField = ({ field }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: field.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      // 🌟 New: Apply width/class here
      width: field.class === 'w-1/2' ? '50%' : field.class === 'w-1/3' ? '33.3333%' : '100%',
      display: (field.class === 'w-1/2' || field.class === 'w-1/3') ? 'inline-block' : 'block',
      verticalAlign: 'top', // For inline blocks
    };
    
    // 🌟 FIX: Optimized updateField to prevent unnecessary re-renders (from previous request)
    const updateField = (key, value) => {
      setFields((prev) =>
        prev.map((f) => {
          if (f.id === field.id && f[key] !== value) {
            return { ...f, [key]: value };
          }
          return f; 
        })
      );
    };

    const handleStyleChange = (styleKey, styleValue) => {
        updateField('style', { ...field.style, [styleKey]: styleValue });
    }

    const isTextField = field.type === FIELD_TYPES.TEXT || field.type === FIELD_TYPES.TEXTAREA;
    const isMovable = field.type !== FIELD_TYPES.COMPANY_INFO_BLOCK; // Only custom fields are movable

    // 🏢 Company Info Block Renderer
    if (field.type === FIELD_TYPES.COMPANY_INFO_BLOCK) {
        return (
             <div
                ref={setNodeRef}
                style={style}
                className={`flex justify-between items-start mb-8 p-4  rounded-lg cursor-grab  transition-colors`}
                {...attributes} 
                {...listeners}
                title="Company Header (Drag to move its position)"
            >
                <div>
                    {showCompanyInfo.logo && template?.company?.companyLogo && (
                        <img
                            src={template.company.companyLogo}
                            alt="Company Logo"
                            className="w-16 h-10 object-contain mb-2"
                        />
                    )}
                    <h3 className="text-xl font-bold text-gray-800">
                        {template?.company?.name || "Company Name"}
                    </h3>
                </div>
                <div className="text-right text-sm text-gray-600 ">
                    {showCompanyInfo.address && template?.company?.companyAddress && (
                        <p>{template.company.companyAddress}</p>
                    )}
                    {showCompanyInfo.phone && template?.company?.companyPhoneNumber && (
                        <p>📞 {template.company.companyPhoneNumber}</p>
                    )}
                    { template?.company?.companyWebsite && (
                        <p>
                       🌐{" "}
                   <a
                        href={template.company.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-blue-500"
                      >
                        {template.company.companyWebsite}
                      </a>
                    </p>
                    )}
                    {/* ... other info ... */}
                </div>
            </div>
        );
    }


    // Regular Field Editor UI
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-white p-4 rounded-lg border shadow-sm mb-3"
      >
        <div className="flex justify-between items-center mb-3">
          
          {/* === DRAG HANDLE === */}
          <div 
            className={`p-2 -ml-2 -mt-2 mr-2 opacity-50 hover:opacity-100 transition-opacity ${isMovable ? 'cursor-grab' : 'cursor-not-allowed'}`}
            // Only apply listeners/attributes if it's a movable field
            {...(isMovable ? attributes : {})} 
            {...(isMovable ? listeners : {})}
            title={isMovable ? "Drag to reorder" : "Cannot move this element"}
          >
              <span className="text-gray-400 font-extrabold text-xl">⋮⋮</span>
          </div>
          {/* =================== */}

          <Input
            value={field.label}
            onChange={(e) => updateField("label", e.target.value)}
            className="font-semibold text-gray-800 flex-grow mr-4"
            placeholder="Field Label"
          />
          <Trash2
            onClick={() => handleDeleteField(field.id)}
            className="text-red-500 cursor-pointer hover:opacity-75 transition-opacity"
            size={18}
            title="Delete Field"
          />
        </div>

        {/* 🛠️ Style/Layout Controls */}
        {(isTextField || field.type === FIELD_TYPES.BUTTON) && (
            <div className="flex items-center space-x-2 border-t pt-2 mb-3">
                
                {/* 📐 Width/Class Dropdown */}
                <select
                    value={field.class}
                    onChange={(e) => updateField('class', e.target.value)}
                    className="p-1 border rounded text-sm bg-gray-50"
                    title="Field Width/Layout Class"
                >
                    {WIDTH_CLASSES.map(cls => (
                        <option key={cls.value} value={cls.value}>{cls.label}</option>
                    ))}
                </select>

                {/* 🔡 Text Styling Buttons */}
                {isTextField && (
                    <>
                        <Button size="icon" variant={field.style?.isBold ? 'default' : 'outline'} 
                                onClick={() => handleStyleChange('isBold', !field.style?.isBold)} title="Bold">
                            <Bold size={16} />
                        </Button>
                        <Button size="icon" variant={field.style?.isItalic ? 'default' : 'outline'} 
                                onClick={() => handleStyleChange('isItalic', !field.style?.isItalic)} title="Italic">
                            <Italic size={16} />
                        </Button>
                        
                        {/* ↔️ Alignment Buttons */}
                        {[
                            { align: 'left', Icon: AlignLeft },
                            { align: 'center', Icon: AlignCenter },
                            { align: 'right', Icon: AlignRight },
                        ].map(({ align, Icon }) => (
                            <Button key={align} size="icon" 
                                variant={field.style?.align === align ? 'default' : 'outline'}
                                onClick={() => handleStyleChange('align', align)} title={`${align} Align`}>
                                <Icon size={16} />
                            </Button>
                        ))}
                    </>
                )}
            </div>
        )}


        {/* 📝 Input/Content Area */}
        {field.type === FIELD_TYPES.TEXT && (
          <Input
            placeholder="[User will enter text here]"
            value={field.value}
            onChange={(e) => updateField("value", e.target.value)}
            // 🌟 Apply styles to input/preview
            className={`w-full ${field.style?.isBold ? 'font-bold' : ''} ${field.style?.isItalic ? 'italic' : ''} ${ALIGNMENT_MAP[field.style?.align || 'left']}`}
          />
        )}

        {field.type === FIELD_TYPES.TEXTAREA && (
          <textarea
            rows={3}
            placeholder="[User will enter a long text here]"
            value={field.value}
            onChange={(e) => updateField("value", e.target.value)}
             // 🌟 Apply styles to textarea/preview
            className={`w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${field.style?.isBold ? 'font-bold' : ''} ${field.style?.isItalic ? 'italic' : ''} ${ALIGNMENT_MAP[field.style?.align || 'left']}`}
          />
        )}

        {field.type === FIELD_TYPES.SIGNATURE && <SignaturePad />}

        {/* 🖱️ Button Field Options */}
        {field.type === FIELD_TYPES.BUTTON && (
            <div className="space-y-2">
                <Input
                    placeholder="Button Text"
                    value={field.buttonText}
                    onChange={(e) => updateField("buttonText", e.target.value)}
                    className="w-full"
                />
                <Input
                    placeholder="Link URL (e.g., https://example.com)"
                    value={field.link}
                    onChange={(e) => updateField("link", e.target.value)}
                    className="w-full"
                />
                <Button className="w-full" variant={field.style?.variant}>
                    {field.buttonText || "Button Preview"}
                </Button>
            </div>
        )}
      </div>
    );
  };

  // 🪄 Handle drag reorder
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      
      // Ensure the Company Info block stays, but allow its position to be moved
      // Note: Dragging logic already handles this reordering via arrayMove
      setFields(arrayMove(fields, oldIndex, newIndex));
    }
  };

  // 💾 Save Template to API
  const handleSave = async () => {
    if (!template) return toast.error("No template found to save!");
    setLoading(true);
    try {
      const payload = {
        // 🌟 Send only fields and styles, excluding temporary local states
        fields: fields.filter(f => f.type !== FIELD_TYPES.COMPANY_INFO_BLOCK), // Filter out company block for clean storage
        background,
        fontSize,
      };
      
      const res = await axios.put(`/api/update-template/${templateid}`, payload); 
      
      if (res.data.success) {
        toast.success("Template updated successfully! 🎉");
      } else {
        toast.error(res.data.message || "Failed to update template");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving template. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const templateStyle = {
    background,
    fontSize: `${fontSize}px`,
    minHeight: "80vh",
    border: "2px dashed #ccc",
    borderRadius: "16px",
    padding: "20px",
  };

  // Extract ID's for DndContext
  const sortableIds = fields.map(f => f.id);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* 🎛️ Sidebar Controls */}
      <div className="md:col-span-1 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-lg border h-fit sticky top-6">
        <h2 className="text-lg font-bold mb-4 border-b pb-2">Editor Controls</h2>

        <div className="space-y-6">
          {/* 🎨 Style Controls */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Background Color</label>
              <Input
                type="color"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="h-10 p-0 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Font Size (px)</label>
              <Input
                type="number"
                min="12"
                max="40"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
              />
            </div>
          </div>

          {/* 🏢 Company Info Toggles */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" /> Company Info Display
            </h3>
            {Object.keys(showCompanyInfo).map((key) => (
              <label key={key} className="flex items-center gap-2 mb-1 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={showCompanyInfo[key]}
                  onChange={(e) =>
                    setShowCompanyInfo({
                      ...showCompanyInfo,
                      [key]: e.target.checked,
                    })
                  }
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="capitalize">{key}</span>
              </label>
            ))}
          </div>

          {/* ➕ Field Type Buttons */}
          <div className="space-y-2 border-t pt-4">
            <h3 className="font-semibold mb-2">Add New Field/Element</h3>
            <Button
              variant="outline"
              className="w-full justify-start text-left"
              onClick={() => handleAddField(FIELD_TYPES.TEXT)}
            >
              <Type className="mr-2 h-4 w-4 text-orange-500" /> Add Text Input
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start text-left"
              onClick={() => handleAddField(FIELD_TYPES.TEXTAREA)}
            >
              <FileText className="mr-2 h-4 w-4 text-purple-500" /> Add Textarea
            </Button>
            
             <Button
              variant="outline"
              className="w-full justify-start text-left"
              onClick={() => handleAddField(FIELD_TYPES.BUTTON)} // New Button Field
            >
              <MousePointerClick className="mr-2 h-4 w-4 text-blue-500" /> Add Button
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start text-left"
              onClick={() => handleAddField(FIELD_TYPES.SIGNATURE)}
            >
              <PenLine className="mr-2 h-4 w-4 text-green-500" /> Add Signature Pad
            </Button>
          </div>
          
          {/* 💾 Save Button */}
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg mt-6"
            onClick={handleSave}
            disabled={loading}
          >
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Saving..." : "Save Template Changes"}
          </Button>
        </div>
      </div>

      {/* 🧩 Main Template Area */}
      <div className="md:col-span-3 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner">
        <h2 className="text-2xl font-extrabold mb-6 text-center text-gray-800">
          📄 {template?.name || "Template"} Builder
        </h2>

        {template ? (
          <div style={templateStyle} className="shadow-2xl mx-auto max-w-2xl">
            
            {/* ✏️ Editable & Draggable Fields */}
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sortableIds} // Use the extracted IDs
                strategy={verticalListSortingStrategy}
              >
                {fields.map((field) => (
                  <SortableField key={field.id} field={field} />
                ))}
              </SortableContext>
            </DndContext>
            
            {fields.length <= 1 && ( // Show message if only company header exists
                <div className="text-center p-10 text-gray-400 border border-dashed border-gray-300 rounded-lg mt-4">
                    <p>Add fields from the sidebar to start building your template.</p>
                </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500 p-20">Loading Template...</p>
        )}
      </div>
    </div>
  );
};

export default TemplateEditorPage;