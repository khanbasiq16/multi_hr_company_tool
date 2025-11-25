"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Type,
  FileText,
  PenLine,
  CheckSquare,
  Circle,
  List,
  Calendar,
  Save,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableField from "@/app/utils/basecomponents/SortableField";
import FormPreview from "@/app/utils/basecomponents/FormPreview";
import { useRouter } from "next/navigation";

const FIELD_TYPES = {
  SHORT_ANSWER: "short_answer",
  PARAGRAPH: "paragraph",
  MULTIPLE_CHOICE: "multiple_choice",
  CHECKBOXES: "checkboxes",
  DROPDOWN: "dropdown",
  DATE: "date",
  SIGNATURE: "signature",
  COMPANY_INFO_BLOCK: "company_info_block",
  APPENDIX: "appendix",
};

const TemplateEditorPage = () => {
  const { templateid } = useParams();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [templateName, setTemplateName] = useState("Untitled Form");
  const [isPreview, setIsPreview] = useState(false);
  const [company, setCompany] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!templateid) return;
    const fetchTemplate = async () => {
      try {
        const res = await axios.get(`/api/get-template/${templateid}`);
        if (res.data.success) {
          const fetchedTemplate = res.data.template;

          setCompany(fetchedTemplate.company || {});
          let initialFields = fetchedTemplate.fields || [];

          
          if (
            initialFields.length === 0 ||
            !initialFields.some(
              (f) => f.type === FIELD_TYPES.COMPANY_INFO_BLOCK
            )
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
          setFields(initialFields);
          setTemplateName(fetchedTemplate.templateName || "Untitled Form");
        }
      } catch {
        toast.error("Failed to load template");
      }
    };
    fetchTemplate();
  }, [templateid]);

  const handleAddField = (type) => {
    if (isPreview) return;
    const newField = {
      id: Date.now(),
      type,
      question: "Untitled question",
      description: "",
      options:
        type === FIELD_TYPES.MULTIPLE_CHOICE ||
        type === FIELD_TYPES.CHECKBOXES ||
        type === FIELD_TYPES.DROPDOWN
          ? ["Option 1"]
          : [],
      required: false,
    };
    setFields((prev) => [...prev, newField]);
  };

  const handleDeleteField = (id) => {
    if (isPreview) return;
    setFields(fields.filter((f) => f.id !== id));
  };

  const handleDuplicateField = (field) => {
    if (isPreview) return;
    const duplicate = {
      ...field,
      id: Date.now(),
      question: `${field.question} (Copy)`,
    };
    setFields((prev) => [...prev, duplicate]);
  };

  const handleUpdateField = (id, updated) => {
    if (isPreview) return;
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updated } : f)));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const slug = templateName.trim().toLowerCase().replace(/\s+/g, "_");

      console.log(fields);

      const res = await axios.post(`/api/update-template/${templateid}`, {
        templateName,
        fields,
        slug,
      });

      if (res.data.success) {
        toast.success(res?.data?.message);
      }
    } catch {
      toast.error("Failed to save template");
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event) => {
    if (isPreview) return;
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      setFields((prev) => {
        const oldIndex = prev.findIndex((f) => f.id === active.id);
        const newIndex = prev.findIndex((f) => f.id === over.id);
        const updated = [...prev];
        const [moved] = updated.splice(oldIndex, 1);
        updated.splice(newIndex, 0, moved);
        return updated;
      });
    }
  };

  const handleexit = () => {
    router.push("/admin/templates");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className="space-y-6 bg-white p-4 rounded-xl shadow-md">
        <div>
          <h2 className="text-lg font-semibold mb-2">Form Info</h2>
          <Input
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Form title"
          />
        </div>

        <div>
          <h3 className="font-semibold mb-3">Add Question</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Type, label: "Short", type: FIELD_TYPES.SHORT_ANSWER },
              {
                icon: FileText,
                label: "Paragraph",
                type: FIELD_TYPES.PARAGRAPH,
              },
              {
                icon: Circle,
                label: "Choice",
                type: FIELD_TYPES.MULTIPLE_CHOICE,
              },
              {
                icon: CheckSquare,
                label: "Checkbox",
                type: FIELD_TYPES.CHECKBOXES,
              },
              { icon: List, label: "Dropdown", type: FIELD_TYPES.DROPDOWN },
              { icon: Calendar, label: "Date", type: FIELD_TYPES.DATE },
              {
                icon: PenLine,
                label: "Signature",
                type: FIELD_TYPES.SIGNATURE,
              },
            ].map(({ icon: Icon, label, type }) => (
              <Button
                key={type}
                onClick={!isPreview ? () => handleAddField(type) : undefined}
                className={`flex items-center gap-2 ${
                  isPreview ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Icon size={14} /> {label}
              </Button>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 space-y-2 ">
          <Button
            onClick={handleSave}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 `}
          >
            <Save size={16} />{" "}
            {loading ? (
              <>
                <Loader2 className="animate-spin" /> Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
          <Button
            onClick={() => setIsPreview((prev) => !prev)}
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
          >
            {isPreview ? <EyeOff size={16} /> : <Eye size={16} />}{" "}
            {isPreview ? "Close Preview" : "Preview"}
          </Button>

          <Button onClick={handleexit} className={"bottom-0 mt-5 w-full "}>
            Exit to Editor
          </Button>
        </div>
      </div>

      {/* Main area */}
      <div className="md:col-span-3 bg-gray-50 p-6 rounded-xl shadow-inner">
        {isPreview ? (
          <FormPreview fields={fields} company={company} />
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fields.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field) => (
                <SortableField
                  key={field.id}
                  field={field}
                  onDelete={handleDeleteField}
                  onUpdate={handleUpdateField}
                  onDuplicate={handleDuplicateField}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default TemplateEditorPage;
