// components/QuillEditor.jsx

"use client"; // This component must be client-side

import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill CSS

// Wrapper component to use ReactQuill
const QuillEditor = ({ field, updateField, modules, formats }) => {
    return (
        <ReactQuill
            theme="snow"
            value={field.value}
            onChange={(newValue) => updateField(field.id, newValue)}
            modules={modules}
            formats={formats}
            className="mb-4"
        />
    );
};

export default QuillEditor;