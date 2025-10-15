"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const EmailDialog = ({ open, setOpen, onSubmit , client  }) => {
  const [toEmail, setToEmail] = useState(client.clientEmail);
  const [subject, setSubject] = useState("");
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

 useEffect(() => {
  if (open) {
    const timer = setTimeout(() => {
      if (editorRef.current && !quillInstance.current) {
        quillInstance.current = new Quill(editorRef.current, {
          theme: "snow",
          placeholder: "Write your message...",
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
              ["clean"],
            ],
          },
        });
      }
    }, 100); // wait 100ms for DOM to render

    return () => clearTimeout(timer);
  }
}, [open]);

  const handleSend = () => {
    const message = quillInstance.current
      ? quillInstance.current.root.innerHTML
      : "";

    onSubmit({ toEmail, subject, message });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Compose Email</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <div>
            <Label>To</Label>
            <Input
              type="email"
              placeholder="Enter recipient email"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
            />
          </div>

          <div>
            <Label>Subject</Label>
            <Input
              type="text"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div>
            <Label>Message</Label>
            <div
              ref={editorRef}
              className="border rounded-md h-[100px] overflow-y-auto"
            ></div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSend} className="bg-blue-600 text-white">
              Send
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailDialog;
