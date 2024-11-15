"use client";

import { Check, Clipboard } from "lucide-react";
import { useState } from "react";

export default function ShareSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-card mb-8 rounded-lg border p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Share this poll</h2>

      <div className="flex items-center gap-2">
        <input
          readOnly
          value={typeof window !== "undefined" ? window.location.href : ""}
          className="bg-muted h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
        />
        <button
          className="bg-background hover:bg-muted inline-flex h-10 w-10 items-center justify-center rounded-md border transition-colors focus:outline-none"
          onClick={handleCopyLink}
          aria-label="Copy link"
        >
          {copied ? (
            <Check className="text-primary h-4 w-4" />
          ) : (
            <Clipboard className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
