"use client";

import { X, FileText, ImageOff } from "lucide-react";

type KycViewerModalProps = {
  url: string | null;
  title?: string;
  onClose: () => void;
};

function isPdf(url: string): boolean {
  return url.toLowerCase().includes(".pdf");
}

export default function KycViewerModal({ url, title = "KYC Document", onClose }: KycViewerModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-blue-600" />
            <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden bg-gray-50 flex items-center justify-center">
          {!url ? (
            <div className="flex flex-col items-center gap-3 text-gray-400">
              <ImageOff size={40} className="text-gray-300" />
              <p className="text-sm font-medium">No document uploaded yet</p>
              <p className="text-xs text-gray-400">This user has not submitted a KYC document.</p>
            </div>
          ) : isPdf(url) ? (
            <embed
              src={url}
              type="application/pdf"
              className="w-full h-full"
              title={title}
            />
          ) : (
            <img
              src={url}
              alt={title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
            />
          )}
        </div>
      </div>
    </div>
  );
}
