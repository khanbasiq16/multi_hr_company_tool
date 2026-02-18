// "use client";
// import { useParams } from "next/navigation";
// import React, { useState, useEffect, useCallback, useRef } from "react";
// import axios from "axios";
// import { Copy, Trash2, GripVertical } from "lucide-react";
// import TextEditor from "@/app/utils/basecomponents/TextEditor";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import SignatureCanvas from "react-signature-canvas";

// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@/components/ui/dropdown-menu";

// const initialTemplate = [
//   {
//     id: 1,
//     type: "text",
//     label: "Agreement Intro",
//     value:
//       "This agreement is made between [Client Name] located at [Client Address], and [Company Name] on this [FIELD:DATE:1] day. The client's phone number is [Client Phone].",
//   },
//   {
//     id: 2,
//     type: "text",
//     label: "Scope of Work",
//     value:
//       "The services provided by [Company Name] will include web development and design as detailed in Appendix A. Any changes to the scope must be agreed upon in writing by both parties.",
//   },
// ];


// const TemplateEditor = () => {
//   const { templateid } = useParams();
//   const [fields, setFields] = useState(initialTemplate);

//   const [openSignatureMenu, setOpenSignatureMenu] = useState(null);
//   const [formname, setFormName] = useState("Untitled Form");
//   const [shortcodes, setShortcodes] = useState({
//     "Client Name": "[Client Name]",
//     "Client Address": "[Client Address]",
//     "Client Phone": "[Client Phone]",
//     "Client Website": "[Client Website]",
//     "Client Email": "[Client Email]",
//   });


//   const [data] = useState(shortcodes);

//   const dragItem = useRef(null);
//   const dragOverItem = useRef(null);

//   const [company, setCompany] = useState({
//     name: "Tech Solutions Pvt. Ltd.",
//     companyAddress: "Bangalore, India",
//     companyEmail: "info@techsolutions.com",
//     companyLogo: "/icons/icon-512x512.png",
//   });

//   useEffect(() => {
//     if (!templateid) return;

//     const fetchTemplate = async () => {
//       try {
//         const res = await axios.get(`/api/get-template/${templateid}`);

//         if (res.data.success) {
//           const fetchedTemplate = res.data.template;

//           setCompany(fetchedTemplate.company || company);
//           setFormName(fetchedTemplate.templateName || "Untitled Form");

//           setShortcodes((prev) => ({
//             ...prev,
//             CompanyName: fetchedTemplate.company.name,
//             CompanyAddress: fetchedTemplate.company.companyAddress,
//             CompanyPhone: fetchedTemplate.company.companyPhoneNumber,
//             CompanyWebsite: fetchedTemplate.company.companyWebsite,
//             CompanyEmail: fetchedTemplate.company.companyEmail,
//           }));

//           setFields(
//             (fetchedTemplate.fields || []).map((f) => ({
//               ...f,
//               value: f.value || "",
//             }))
//           );
//         }
//       } catch (error) {
//         console.error("Error fetching template:", error);
//       }
//     };

//     fetchTemplate();
//   }, []);

//   const addBlock = (type) => {
//     setFields((prev) => [
//       ...prev,
//       { id: Date.now(), type, label: `${type} Field`, value: "" },
//     ]);
//   };

//   // 🔥 FIXED: useCallback (PREVENTS EDITOR FREEZING)
//   const updateField = useCallback((id, newValue) => {
//     setFields((prev) =>
//       prev.map((f) => (f.id === id ? { ...f, value: newValue } : f))
//     );
//   }, []);

//   const insertShortcode = (id, shortcode) => {
//     setFields((prev) =>
//       prev.map((f) =>
//         f.id === id ? { ...f, value: `${f.value} [${shortcode}] ` } : f
//       )
//     );
//   };

//   const insertSpecialField = (id, type) => {
//     let fieldType = type;

//     if (type === "SIGNATURE_TYPED") fieldType = "SIGNATURE:text";
//     if (type === "SIGNATURE_PAD") fieldType = "SIGNATURE:pad";

//     setFields((prev) =>
//       prev.map((f) =>
//         f.id === id
//           ? { ...f, value: `${f.value} [FIELD:${fieldType}:${Date.now()}] ` }
//           : f
//       )
//     );
//   };



//   const handleDragStart = (e, index) => {
//     dragItem.current = index;
//     e.currentTarget.classList.add("opacity-50", "border-dashed", "border-2", "border-blue-500");
//   };

//   const handleDragEnter = (e, index) => {
//     dragOverItem.current = index;
//     e.currentTarget.classList.add("bg-blue-50");
//   };

//   const handleDragLeave = (e) => {
//     e.currentTarget.classList.remove("bg-blue-50");
//   };

//   const handleDragEnd = (e) => {
//     e.currentTarget.classList.remove("opacity-50", "border-dashed", "border-2", "border-blue-500");
//     document.querySelectorAll(".bg-blue-50").forEach(el => el.classList.remove("bg-blue-50"));
//     dragItem.current = null;
//     dragOverItem.current = null;
//   }

//   const handleDrop = (e) => {
//     e.preventDefault();


//     e.currentTarget.classList.remove("bg-blue-50");

//     const draggedIndex = dragItem.current;
//     const droppedIndex = dragOverItem.current;

//     if (draggedIndex !== null && droppedIndex !== null && draggedIndex !== droppedIndex) {
//       setFields((prevFields) => {
//         const newFields = [...prevFields];
//         // 1. Get the item being dragged
//         const [reorderedItem] = newFields.splice(draggedIndex, 1);
//         // 2. Insert it into the new position
//         newFields.splice(droppedIndex, 0, reorderedItem);
//         return newFields;
//       });
//     }

//   };



//   const renderTemplate = () => {
//     let html = `
//     <div class="relative w-full min-h-[600px]">
//       <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
//         <img src="${company.companyLogo}" class="max-w-[50%] object-contain" />
//       </div>

//       <div class="relative z-10 mb-12">
//         <div class="flex items-center gap-3">
//           <img src="${company.companyLogo}" class="w-20" />
//           <div>
//             <h1 class="text-2xl font-bold">${company.name}</h1>
//             <p class="text-gray-700 text-sm">${company.companyAddress}</p>
//             <p class="text-gray-700 text-sm">${company.companyemail}</p>
//           </div>
//         </div>
//         <div class="mt-6 border-b border-gray-300"></div>
//       </div>

//       <div class="relative z-10 text-[17px] leading-8"> 
//   `;

//     fields.forEach((field) => {
//       let val = field.value || "";
//       console.log(val);

//       // Replace shortcodes like [Client Name]
//       Object.keys(shortcodes).forEach((key) => {
//         val = val.replace(
//           new RegExp(`\\[${key}\\]`, "g"),
//           `<span class="text-blue-800 font-semibold">${shortcodes[key]}</span>`
//         );
//       });

//       val = val.replace(
//         /\[FIELD:DATE:\d+\]/g,
//         `<input type="date" class="border p-2 rounded w-44 mt-2 mb-2" />`
//       );

//       val = val.replace(
//         /\[FIELD:SIGNATURE(?::(text|pad))?:\d+\]/gi,
//         (match, type) => {
//           if (type === "text") {
//             return `
//         <div class="flex flex-col gap-2 mt-2">
//           <div class="flex gap-2">
//             <select 
//               class="w-40 border border-gray-300 rounded px-2 py-1"
//               id="signatureFontSelect_${Date.now()}"
//             >
//               <option value="allura" style="font-family: var(--font-allura)">Allura</option>
//               <option value="greatVibes" style="font-family: var(--font-great-vibes)">Great Vibes</option>
//               <option value="dancingScript" style="font-family: var(--font-dancing-script)">Dancing Script</option>
//             </select>
//             <input type="text" placeholder="Type Signature" class="border p-2 rounded w-60" id="signatureInput_${Date.now()}" />
//           </div>
//           <p id="signaturePreview_${Date.now()}" class="border p-2 rounded w-60 text-gray-700">Your signature will appear here</p>
//         </div>

//         <script>
//           const input = document.getElementById('signatureInput_${Date.now()}');
//           const select = document.getElementById('signatureFontSelect_${Date.now()}');
//           const preview = document.getElementById('signaturePreview_${Date.now()}');
//           function updateSignature() {
//             preview.textContent = input.value || 'Your signature will appear here';
//             preview.style.fontFamily = 'var(--font-' + select.value + ')';
//           }
//           input.addEventListener('input', updateSignature);
//           select.addEventListener('change', updateSignature);
//         </script>
//       `;
//           }
//           if (type === "pad") {
//             return `<div class="border-2 border-dashed p-4 mt-4 w-60 rounded text-gray-500">
//             Signature Pad
//           </div>`;
//           }
//           return `<div class="border-2 border-dashed p-4 mt-4 w-60 rounded text-gray-500">
//           Signature
//         </div>`;
//         }
//       );

//       html += `<div>${val.replace(/\n/g, "<br/>")}</div>`;
//     });

//     html += `</div></div>`;
//     return html;
//   };

//   return (
//     <div className="w-full flex gap-6 p-4">
//       {/* LEFT PANEL */}
//       <div className="w-[32%] h-[90vh] bg-white overflow-y-scroll custom-scroll fixed top-7 z-50  p-2 rounded-lg flex flex-col gap-2 ">
//         <h1 className="text-2xl font-bold">Text Editor</h1>

//         <Input type="text" value={formname} className={"bg-white py-4 "} onChange={(e) => setFormName(e.target.value)} />

//         {/* {fields.map((field, index) => (
//           <div
//             key={field.id}
//             className="bg-white p-5 border rounded-lg shadow-sm"
//             draggable
//             onDragStart={(e) => handleDragStart(e, index)}
//             onDragEnter={(e) => handleDragEnter(e, index)}
//             onDragLeave={handleDragLeave}
//             onDragOver={(e) => e.preventDefault()}
//             onDrop={handleDrop}
//             onDragEnd={handleDragEnd}
//           >
//             <div className="flex justify-between items-center mb-3">

//               <div className="cursor-grab text-gray-400 mr-1 cursor-grab">
//                 <GripVertical size={20} />
//               </div>

//               <Input
//                 type="text"
//                 className="text-xl border-none rounded- font-semibold border-b w-full pb-1 outline-none"
//                 value={field.label}
//                 onChange={(e) =>
//                   setFields((prev) =>
//                     prev.map((f) =>
//                       f.id === field.id ? { ...f, label: e.target.value } : f
//                     )
//                   )
//                 }
//               />


//               {field.label !== "Appendix" && (
//                 <div className="flex gap-2 ml-4">

//                   <button
//                     onClick={() => {
//                       const baseLabel = field.label.replace(/\s*-\s*Copy$/, "");
//                       const copyField = {
//                         ...field,
//                         id: Date.now(),
//                         label: `${baseLabel} - Copy`,
//                       };
//                       setFields((prev) => {
//                         const arr = [...prev];
//                         arr.splice(index + 1, 0, copyField);
//                         return arr;
//                       });
//                     }}
//                     className="px-3 py-1 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition"
//                   >
//                     <Copy size={16} />
//                   </button>

//                   <button
//                     onClick={() =>
//                       setFields((prev) => prev.filter((f) => f.id !== field.id))
//                     }
//                     className="w-8 h-8 bg-red-600 text-white rounded-full flex justify-center items-center hover:bg-red-700 transition"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               )}
//             </div>

//             <TextEditor field={field} updateField={updateField} />

//             <div className="flex flex-wrap gap-2 mt-2">
//               <div className="flex flex-wrap gap-2">
//                 {Object.keys(shortcodes).map((key) => (
//                   <button
//                     key={key}
//                     onClick={() => insertShortcode(field.id, key)}
//                     className="px-2 py-1 bg-blue-100 text-blue-800 rounded-xs text-xs font-medium  hover:bg-blue-200 transition"
//                   >
//                     [{key}]
//                   </button>
//                 ))}
//               </div>

//             </div>

//             <div className="mt-3 flex gap-2">
//               <Button
//                 onClick={() => insertSpecialField(field.id, "DATE")}
//                 className="px-4 py-2 bg-white text-blue-600 font-medium rounded-sm border shadow-sm 
//                    hover:bg-gray-100 hover:text-blue-600 transition-all duration-200"
//               >
//                 Add Date
//               </Button>


//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button className="px-4 py-2 bg-white text-red-600 font-medium rounded-sm border shadow-sm 
//                    hover:bg-gray-100 hover:text-red-600 transition-all duration-200">
//                     Add Signature
//                   </Button>

//                 </DropdownMenuTrigger>

//                 <DropdownMenuContent className="w-44 bg-white shadow-lg border rounded-lg p-1">
//                   <DropdownMenuItem
//                     className="hover:bg-gray-100 rounded-md"
//                     onClick={() => insertSpecialField(field.id, "SIGNATURE_TYPED")}
//                   >
//                     Typed Signature
//                   </DropdownMenuItem>

//                   <DropdownMenuItem
//                     className="hover:bg-gray-100 rounded-md"
//                     onClick={() => insertSpecialField(field.id, "SIGNATURE_PAD")}
//                   >
//                     Signature Pad
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>
//         ))} */}


//         {fields.map((field, index) => (
//           <div
//             key={field.id}
//             className="bg-white p-5 border rounded-lg shadow-sm"
//             draggable
//             onDragStart={(e) => handleDragStart(e, index)}
//             onDragEnter={(e) => handleDragEnter(e, index)}
//             onDragLeave={handleDragLeave}
//             onDragOver={(e) => e.preventDefault()}
//             onDrop={handleDrop}
//             onDragEnd={handleDragEnd}
//           >
//             {/* Label + Controls */}
//             <div className="flex justify-between items-center mb-3">
//               <div className="cursor-grab text-gray-400 mr-1">
//                 <GripVertical size={20} />
//               </div>

//               <Input
//                 type="text"
//                 className="text-xl border-none rounded font-semibold border-b w-full pb-1 outline-none"
//                 value={field.label}
//                 onChange={(e) =>
//                   setFields((prev) =>
//                     prev.map((f) =>
//                       f.id === field.id ? { ...f, label: e.target.value } : f
//                     )
//                   )
//                 }
//               />

//               {field.label !== "Appendix" && (
//                 <div className="flex gap-2 ml-4">
//                   <button
//                     onClick={() => {
//                       const baseLabel = field.label.replace(/\s*-\s*Copy$/, "");
//                       const copyField = {
//                         ...field,
//                         id: Date.now(),
//                         label: `${baseLabel} - Copy`,
//                       };
//                       setFields((prev) => {
//                         const arr = [...prev];
//                         arr.splice(index + 1, 0, copyField);
//                         return arr;
//                       });
//                     }}
//                     className="px-3 py-1 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition"
//                   >
//                     <Copy size={16} />
//                   </button>

//                   <button
//                     onClick={() =>
//                       setFields((prev) => prev.filter((f) => f.id !== field.id))
//                     }
//                     className="w-8 h-8 bg-red-600 text-white rounded-full flex justify-center items-center hover:bg-red-700 transition"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Conditional Input */}
//             {field.type === "date" ? (
//               <input
//                 type="date"
//                 className="border-b w-full text-lg pb-1 outline-none"
//                 value={field.answer || ""}
//                 onChange={(e) =>
//                   setFields((prev) =>
//                     prev.map((f) =>
//                       f.id === field.id ? { ...f, answer: e.target.value } : f
//                     )
//                   )
//                 }
//               />
//             ) : field.type === "signature" ? (
//               field.signatureType === "pad" ? (
//                 <div className="border p-2 mt-2">
//                   {/* Signature Pad Component */}
//                   <SignatureCanvas
//                     value={field.answer || ""}
//                     onChange={(sig) =>
//                       setFields((prev) =>
//                         prev.map((f) =>
//                           f.id === field.id ? { ...f, answer: sig } : f
//                         )
//                       )
//                     }
//                   />
//                 </div>
//               ) : field.signatureType === "typed" ? (
//                 <input
//                   type="text"
//                   placeholder="Type signature..."
//                   className="border-b w-full text-lg pb-1 outline-none mt-2"
//                   value={field.answer || ""}
//                   onChange={(e) =>
//                     setFields((prev) =>
//                       prev.map((f) =>
//                         f.id === field.id ? { ...f, answer: e.target.value } : f
//                       )
//                     )
//                   }
//                 />
//               ) : (
//                 <p className="text-gray-400 mt-2">Select signature type above</p>
//               )
//             ) : (
//               <>
//                 <TextEditor field={field} updateField={updateField} />
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {Object.keys(shortcodes).map((key) => (
//                     <button
//                       key={key}
//                       onClick={() => insertShortcode(field.id, key)}
//                       className="px-2 py-1 bg-blue-100 text-blue-800 rounded-xs text-xs font-medium hover:bg-blue-200 transition"
//                     >
//                       [{key}]
//                     </button>
//                   ))}
//                 </div>
//               </>
//             )}

//             {/* Shortcodes */}

//             {/* Buttons to add Date or Signature */}

//           </div>
//         ))}


//       </div>

//       {/* RIGHT SIDE PREVIEW */}
//       <div className="relative left-[26rem] w-2/3">

//         <div className="flex justify-between  mb-4 items-center w-full  gap-2">
//           <h1 className="text-2xl font-bold "> Live Template Preview</h1>
//           <div className="flex items-center justify-center gap-2">
//             <Button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Save</Button>
//             <Button
//               onClick={() => addBlock("text")}
//               className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
//             >
//               ➕ Add New Text Block
//             </Button>

//           </div>
//         </div>




//         <div
//           className="border bg-white shadow p-10 rounded"
//           dangerouslySetInnerHTML={{ __html: renderTemplate() }}
//         />
//       </div>
//     </div>



//   );
// };

// export default TemplateEditor;


"use client"
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { createtemplate } from '@/features/Slice/TemplateSlice'
import axios from 'axios'

const page = () => {

  const {templateid} = useParams()

  const dispatch = useDispatch()

  useEffect(() => {
    fetchTemplate()
  }, [])

  const fetchTemplate = async () => {
    try {
      const res = await axios.get(`/api/get-template/${templateid}`);
      if (res.data.success) {
        console.log(res?.data?.template);
        dispatch(createtemplate(res?.data?.template || []));
      }
    } catch (error) {
      console.error("Error fetching template:", error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div>page</div>
  )
}

export default page