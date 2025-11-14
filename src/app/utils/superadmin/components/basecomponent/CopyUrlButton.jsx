"use client";
import { useState } from "react";

const { Check, Copy } = require("lucide-react");

const CopyUrlButton = ({ url }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="px-3 py-2 hover:bg-gray-200 rounded transition flex gap-2 items-center justify-center"
    >
      {copied ? (
        <Check className="text-green-600" size={18} />
      ) : (
        <Copy size={18} />
      )}

        {copied ? "Copied!" : "Copy Link"}
    </button>
  );
};


export default CopyUrlButton;