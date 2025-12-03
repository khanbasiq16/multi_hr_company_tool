"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import JoditEditor from "jodit-react";

const TemplateEditor = ({ field, updateField, placeholder }) => {
    const editor = useRef(null);
    const [content, setContent] = useState(field.value);


    useEffect(() => {
        if (field.value !== content) {
            setContent(field.value);
        }
    }, [field.value]);

    const handleChange = (newContent) => {
        setContent(newContent);
        updateField(field.id, newContent);
    };


    const config = useMemo(() => ({
        readonly: false,
        placeholder: placeholder || "Start typing...",
        height: 150,
        // you can add more options here
    }), [placeholder]);

    return (
        <JoditEditor
            ref={editor}
            value={content}
            config={config}
            onChange={handleChange}
        />
    );
};

export default TemplateEditor;
