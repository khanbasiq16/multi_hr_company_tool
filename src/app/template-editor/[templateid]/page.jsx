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
  Plus,
  Copy,
  Eye,
  Edit3,
  CheckSquare,
  Circle,
} from "lucide-react";

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
  BUTTON: "button",
  COMPANY_INFO_BLOCK: "company_info_block",
  MULTIPLE_CHOICE: "multiple_choice", 
  CHECKBOXES: "checkboxes", 
};

const ALIGNMENT_MAP = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const WIDTH_CLASSES = [
  { label: "Full Width", value: "w-full" },
  { label: "Half Width (1/2)", value: "w-1/2" },
  { label: "Third Width (1/3)", value: "w-1/3" },
];

const createEmptyField = (type) => {
  const base = {
    id: Date.now() + Math.random(),
    type,
    isFixed: false,
    class: "w-full",
    label: "",
    required: false,
  };

  switch (type) {
    case FIELD_TYPES.BUTTON:
      return { ...base, label: "Button", buttonText: "Click Me", link: "#" , style: { variant: "default" }};
    case FIELD_TYPES.TEXT:
      return { ...base, label: "Untitled Question", value: "", style: { isBold: false, isItalic: false, align: "left" } };
    case FIELD_TYPES.TEXTAREA:
      return { ...base, label: "Untitled Question", value: "", style: { isBold: false, isItalic: false, align: "left" } };
    case FIELD_TYPES.SIGNATURE:
      return { ...base, label: "Signature" , value: "" };
    case FIELD_TYPES.MULTIPLE_CHOICE:
      return { ...base, label: "Multiple Choice Question", options: ["Option 1", "Option 2"], choiceType: "radio" };
    case FIELD_TYPES.CHECKBOXES:
      return { ...base, label: "Checkboxes Question", options: ["Option 1", "Option 2"], choiceType: "checkbox" };
    default:
      return base;
  }
};

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
  const [previewMode, setPreviewMode] = useState(false);

  // 🧠 Fetch Template Data
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await axios.get(`/api/get-template/${templateid}`);
        if (res.data.success) {
          const fetchedTemplate = res.data.template;
          setTemplate(fetchedTemplate);

          let initialFields = fetchedTemplate.fields || [];
          if (
            initialFields.length === 0 ||
            !initialFields.some((f) => f.type === FIELD_TYPES.COMPANY_INFO_BLOCK)
          ) {
            initialFields = [
              {
                id: "company-header",
                type: FIELD_TYPES.COMPANY_INFO_BLOCK,
                label: "Company Header",
                isFixed: true,
              },
              ...initialFields,
            ];
          }

          // Normalize missing props for compatibility
          initialFields = initialFields.map((f) => {
            if (f.type === FIELD_TYPES.MULTIPLE_CHOICE || f.type === FIELD_TYPES.CHECKBOXES) {
              return { ...f, options: f.options || ["Option 1"], required: f.required || false };
            }
            return { ...f, required: f.required || false, style: f.style || {} };
          });

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

  // ➕ Add Field
  const handleAddField = (type) => {
    const newField = createEmptyField(type);
    setFields((prev) => [...prev, newField]);
    // Scroll to bottom or focus could be done here if desired
  };

  // 🗑️ Delete Field
  const handleDeleteField = (id) => {
    setFields(fields.filter((f) => f.id !== id));
    toast.success("Field deleted!");
  };

  const duplicateField = (field) => {
    const copy = { ...field, id: Date.now() + Math.random() };
    setFields((prev) => {
      const idx = prev.findIndex((p) => p.id === field.id);
      const newArr = [...prev];
      newArr.splice(idx + 1, 0, copy);
      return newArr;
    });
    toast.success("Field duplicated");
  };

  const SignaturePad = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000000";
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

      canvas.addEventListener("touchstart", (e) => start(e.touches[0]), {
        passive: false,
      });
      canvas.addEventListener("touchmove", (e) => draw(e.touches[0]), {
        passive: false,
      });
      canvas.addEventListener("touchend", stop);

      return () => {
        canvas.removeEventListener("mousedown", start);
        canvas.removeEventListener("mousemove", draw);
        canvas.removeEventListener("mouseup", stop);
        canvas.removeEventListener("mouseleave", stop);
        canvas.removeEventListener("touchstart", (e) => start(e.touches[0]));
        canvas.removeEventListener("touchmove", (e) => draw(e.touches[0]));
        canvas.removeEventListener("touchend", stop);
      };
    }, []);

    const clearSignature = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

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
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSignature}
            className="text-red-500 hover:text-red-700"
          >
            Clear
          </Button>
        </div>
      </div>
    );
  };

  // 🧱 Sortable Field
  const SortableField = ({ field }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: field.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      width:
        field.class === "w-1/2"
          ? "50%"
          : field.class === "w-1/3"
          ? "33.3333%"
          : "100%",
      display:
        field.class === "w-1/2" || field.class === "w-1/3"
          ? "inline-block"
          : "block",
    };

    const updateField = (key, value) => {
      setFields((prev) =>
        prev.map((f) => (f.id === field.id ? { ...f, [key]: value } : f))
      );
    };

    const handleStyleChange = (styleKey, styleValue) => {
      updateField("style", { ...field.style, [styleKey]: styleValue });
    };

    const isTextField =
      field.type === FIELD_TYPES.TEXT || field.type === FIELD_TYPES.TEXTAREA;
    const isMovable = field.type !== FIELD_TYPES.COMPANY_INFO_BLOCK;

    // Options handlers for multiple choice / checkboxes
    const addOption = () => {
      updateField("options", [...(field.options || []), `Option ${field.options ? field.options.length + 1 : 1}`]);
    };

    const updateOption = (idx, val) => {
      updateField("options", field.options.map((o, i) => (i === idx ? val : o)));
    };

    const removeOption = (idx) => {
      const newOpts = field.options.filter((_, i) => i !== idx);
      updateField("options", newOpts);
    };

    // 🏢 Company Info Block
    if (field.type === FIELD_TYPES.COMPANY_INFO_BLOCK) {
      return (
        <div
          ref={setNodeRef}
          style={style}
          className="flex  justify-between items-center rounded-lg cursor-grab transition-colors gap-4 p-4 bg-white"
          {...attributes}
          {...listeners}
        >

          <div className="w-full flex justify-between">

        
         
          <div className="flex flex-col justify-center gap-1">
            {showCompanyInfo.logo && template?.company?.companyLogo && (
              <img
                src={template.company.companyLogo}
                alt="Company Logo"
                className="w-12 h-12 object-contain"
              />
            )}
            <h3 className="text-xl font-bold text-gray-800">
              {template?.company?.name || "Company Name"}
            </h3>
          </div>

       
          <div className="flex flex-col  items-end  gap-2 text-sm text-gray-600">
            {showCompanyInfo.address &&
              template?.company?.companyAddress && (
                <span>{template.company.companyAddress}</span>
              )}
            {showCompanyInfo.phone &&
              template?.company?.companyPhoneNumber && (
                <span>📞 {template.company.companyPhoneNumber}</span>
              )}
            {showCompanyInfo.website &&
              template?.company?.companyWebsite && (
                <span>
                  🌐{" "}
                  <a
                    href={template.company.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-500"
                  >
                    {template.company.companyWebsite.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '')}
                  </a>
                </span>
              )}
          </div>

            </div>
        </div>
      );
    }

   
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`bg-white p-4 rounded-lg border shadow-sm mb-3 transition-colors ${previewMode ? "cursor-default" : ""}`}
      >
        <div className="flex justify-between items-start mb-3 gap-3">
          <div
            className={`p-2 -ml-2 -mt-2 mr-2 opacity-50 hover:opacity-100 transition-opacity ${isMovable ? "cursor-grab" : "cursor-not-allowed"}`}
            {...(isMovable ? attributes : {})}
            {...(isMovable ? listeners : {})}
          >
            <span className="text-gray-400 font-extrabold text-xl">⋮⋮</span>
          </div>

          <div className="flex-1">
            {/* Inline editable label */}
            {previewMode ? (
              <div className="flex items-center gap-2">
                <h4 className="text-md font-medium">{field.label}</h4>
                {field.required && <span className="text-red-500">*</span>}
              </div>
            ) : (
              <div className="flex gap-3">
                <Input
                  value={field.label}
                  onChange={(e) => updateField("label", e.target.value)}
                  className="font-semibold text-gray-800 flex-grow mr-4"
                  placeholder="Question title"
                />
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 rounded hover:bg-gray-100"
                    title="Duplicate"
                    onClick={() => duplicateField(field)}
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    className="p-2 rounded hover:bg-gray-100"
                    title="Preview field"
                    onClick={() => toast.success("Preview toggled via top Preview button")}
                  >
                    <Eye size={16} />
                  </button>
                  <Trash2
                    onClick={() => handleDeleteField(field.id)}
                    className="text-red-500 cursor-pointer hover:opacity-75 transition-opacity"
                    size={18}
                  />
                </div>
              </div>
            )}

            {/* Controls row (only in edit mode) */}
            {!previewMode && (
              <div className="flex items-center space-x-2 border-t pt-2 mb-3 mt-3">
                <select
                  value={field.class}
                  onChange={(e) => updateField("class", e.target.value)}
                  className="p-1 border rounded text-sm bg-gray-50"
                >
                  {WIDTH_CLASSES.map((cls) => (
                    <option key={cls.value} value={cls.value}>
                      {cls.label}
                    </option>
                  ))}
                </select>

                {isTextField && (
                  <>
                    <Button
                      size="icon"
                      variant={field.style?.isBold ? "default" : "outline"}
                      onClick={() =>
                        handleStyleChange("isBold", !field.style?.isBold)
                      }
                    >
                      <Bold size={16} />
                    </Button>
                    <Button
                      size="icon"
                      variant={field.style?.isItalic ? "default" : "outline"}
                      onClick={() =>
                        handleStyleChange("isItalic", !field.style?.isItalic)
                      }
                    >
                      <Italic size={16} />
                    </Button>

                    {[ 
                      { align: "left", Icon: AlignLeft },
                      { align: "center", Icon: AlignCenter },
                      { align: "right", Icon: AlignRight },
                    ].map(({ align, Icon }) => (
                      <Button
                        key={align}
                        size="icon"
                        variant={
                          field.style?.align === align ? "default" : "outline"
                        }
                        onClick={() => handleStyleChange("align", align)}
                      >
                        <Icon size={16} />
                      </Button>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* Field preview / input rendering */}
            <div className="mt-2">
              {/* Short answer */}
              {field.type === FIELD_TYPES.TEXT && (
                <>
                  {previewMode ? (
                    <input className="mt-3 border-b w-full p-2" placeholder="Short answer text" disabled />
                  ) : (
                    <Input
                      placeholder="[User will enter text here]"
                      value={field.value}
                      onChange={(e) => updateField("value", e.target.value)}
                      className={`w-full ${field.style?.isBold ? "font-bold" : ""} ${field.style?.isItalic ? "italic" : ""} ${ALIGNMENT_MAP[field.style?.align || "left"]}`}
                    />
                  )}
                </>
              )}

              {/* Paragraph */}
              {field.type === FIELD_TYPES.TEXTAREA && (
                <>
                  {previewMode ? (
                    <textarea rows={3} className="w-full border rounded-md p-2" placeholder="Long answer text" disabled />
                  ) : (
                    <textarea
                      rows={3}
                      placeholder="[User will enter a long text here]"
                      value={field.value}
                      onChange={(e) => updateField("value", e.target.value)}
                      className={`w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${field.style?.isBold ? "font-bold" : ""} ${field.style?.isItalic ? "italic" : ""} ${ALIGNMENT_MAP[field.style?.align || "left"]}`}
                    />
                  )}
                </>
              )}

              {/* Signature */}
              {field.type === FIELD_TYPES.SIGNATURE && <SignaturePad />}

              {/* Button */}
              {field.type === FIELD_TYPES.BUTTON && (
                <div className="space-y-2">
                  {!previewMode && (
                    <>
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
                    </>
                  )}
                  <Button className="w-full" variant={field.style?.variant}>
                    {field.buttonText || "Button Preview"}
                  </Button>
                </div>
              )}

              {/* Multiple choice / radio */}
              {(field.type === FIELD_TYPES.MULTIPLE_CHOICE || field.type === FIELD_TYPES.CHECKBOXES) && (
                <div className="mt-2 space-y-2">
                  {previewMode ? (
                    <div className="space-y-2">
                      {(field.options || []).map((opt, idx) => (
                        <label key={idx} className="flex items-center gap-2 text-sm">
                          {field.type === FIELD_TYPES.MULTIPLE_CHOICE ? (
                            <input type="radio" name={`q-${field.id}`} />
                          ) : (
                            <input type="checkbox" />
                          )}
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div>
                      {(field.options || []).map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-2 mb-2">
                          <div className="w-6">
                            {field.type === FIELD_TYPES.MULTIPLE_CHOICE ? <Circle size={16} /> : <CheckSquare size={16} />}
                          </div>
                          <Input
                            value={opt}
                            onChange={(e) => updateOption(idx, e.target.value)}
                            className="flex-1"
                          />
                          <button
                            onClick={() => removeOption(idx)}
                            className="p-2 rounded hover:bg-gray-100"
                            title="Remove option"
                          >
                            <Trash2 size={16} className="text-red-500" />
                          </button>
                        </div>
                      ))}
                      <div className="mt-2">
                        <Button size="sm" onClick={addOption}>
                          <Plus size={14} className="mr-1" /> Add option
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* required toggle (edit mode) */}
            {!previewMode && (
              <div className="flex justify-between items-center mt-3 border-t pt-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => updateField("required", e.target.checked)}
                  />
                  Required
                </label>
                <div className="text-sm text-gray-500">Type: {field.type}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Drag End
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      setFields(arrayMove(fields, oldIndex, newIndex));
    }
  };

  // Save Template
  const handleSave = async () => {
    if (!template) return toast.error("No template found to save!");
    setLoading(true);
    try {
      const payload = {
        // persist everything except the fixed company info block (server can re-add it)
        fields: fields.filter((f) => f.type !== FIELD_TYPES.COMPANY_INFO_BLOCK).map(f => {
          // ensure safe payload shape
          const copy = { ...f };
          // remove internal-only properties if present
          return copy;
        }),
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
      toast.error("Error saving template.");
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

  const sortableIds = fields.map((f) => f.id);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="md:col-span-1 bg-white p-4 rounded-xl shadow-lg border h-fit sticky top-6">
        <h2 className="text-lg font-bold mb-4 border-b pb-2 flex items-center justify-between">
          <span>Editor Controls</span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setPreviewMode(!previewMode)}>
              <Edit3 size={16} /> {previewMode ? "Edit" : "Preview"}
            </Button>
          </div>
        </h2>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">Background Color</label>
              <Input
                type="color"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="h-10 p-0 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Font Size (px)</label>
              <Input
                type="number"
                min="12"
                max="40"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" /> Company Info Display
            </h3>
            {Object.keys(showCompanyInfo).map((key) => (
              <label key={key} className="flex items-center gap-2 mb-1 text-sm">
                <input
                  type="checkbox"
                  checked={showCompanyInfo[key]}
                  onChange={(e) =>
                    setShowCompanyInfo({
                      ...showCompanyInfo,
                      [key]: e.target.checked,
                    })
                  }
                />
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
            ))}
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Add Question</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => handleAddField(FIELD_TYPES.TEXT)}>
                <Type size={16} className="mr-1" /> Short
              </Button>
              <Button onClick={() => handleAddField(FIELD_TYPES.TEXTAREA)}>
                <FileText size={16} className="mr-1" /> Paragraph
              </Button>
              <Button onClick={() => handleAddField(FIELD_TYPES.MULTIPLE_CHOICE)}>
                <Circle size={16} className="mr-1" /> Multiple choice
              </Button>
              <Button onClick={() => handleAddField(FIELD_TYPES.CHECKBOXES)}>
                <CheckSquare size={16} className="mr-1" /> Checkboxes
              </Button>
              <Button onClick={() => handleAddField(FIELD_TYPES.SIGNATURE)}>
                <PenLine size={16} className="mr-1" /> Signature
              </Button>
              <Button onClick={() => handleAddField(FIELD_TYPES.BUTTON)}>
                <MousePointerClick size={16} className="mr-1" /> Button
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="w-full font-semibold flex items-center justify-center gap-2"
            >
              <Save size={18} /> {loading ? "Saving..." : "Save Template"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div
        className="md:col-span-3 p-6 bg-gray-50 rounded-xl shadow-inner relative"
        style={templateStyle}
      >
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
            {fields.map((field) => (
              <SortableField key={field.id} field={field} />
            ))}
          </SortableContext>
        </DndContext>

        {/* Floating add question button */}
        <div className="fixed right-8 bottom-8 z-40">
          <div className="flex flex-col gap-2 items-end">
            <Button
              onClick={() => handleAddField(FIELD_TYPES.TEXT)}
              className="rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
              title="Add Short answer"
            >
              <Type />
            </Button>
            <Button
              onClick={() => handleAddField(FIELD_TYPES.MULTIPLE_CHOICE)}
              className="rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
              title="Add Multiple choice"
            >
              <Circle />
            </Button>
            <Button
              onClick={() => handleAddField(FIELD_TYPES.CHECKBOXES)}
              className="rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
              title="Add Checkboxes"
            >
              <CheckSquare />
            </Button>
            <Button
              onClick={() => handleAddField(FIELD_TYPES.TEXTAREA)}
              className="rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
              title="Add Paragraph"
            >
              <FileText />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditorPage;
