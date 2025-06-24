"use client";

import axios from "@/app/lib/axios";
import { Copy, Share2, X } from "lucide-react";
import { useFetchSinglePipeline } from "../_features/hook";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface PopUpProps {
    shareDataPoint: boolean;
    onClose: () => void;
    uniqueId: string;
}

const ShareDataPoint: React.FC<PopUpProps> = ({
    shareDataPoint,
    onClose,
    uniqueId,
}) => {
    const { isLoading } = useFetchSinglePipeline({
        axios,
        id: uniqueId,
        enabled: shareDataPoint,
    });

    const [copied, setCopied] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    //Encode uniqueId using Base64 for public sharing
    const encodedId = typeof window !== "undefined" ? btoa(uniqueId) : "";
    const [shareUrl, setShareUrl] = useState("");
    useEffect(() => {
        if (encodedId && typeof window !== "undefined") {
            const fullUrl = `${window.location.origin}/pages/flywheel/data-entry/shared?data-point=${encodedId}`;
            setShareUrl(fullUrl);
        }
    }, [encodedId]);
    // Copy link handler
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success("Link copied to clipboard!");
        } catch {
            toast.error("Failed to copy link.");
        }
    };

    //Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (shareDataPoint) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [shareDataPoint, onClose]);

    // Reset "copied" state when modal opens or ID changes
    useEffect(() => {
        setCopied(false);
    }, [uniqueId, shareDataPoint]);

    if (!shareDataPoint) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/20 z-40" />

            <div className="fixed z-50 inset-0 flex items-center justify-center px-4">
                <div
                    ref={modalRef}
                    className="relative w-full bg-white rounded-xl shadow-xl max-w-2xl p-5"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-7 text-gray-400 hover:text-blue-600 cursor-pointer text-xl"
                    >
                        <X />
                    </button>

                    <h2 className="text-blue-600 text-xl font-semibold mb-6 flex items-center gap-2">
                        <Share2 size={18} /> Share Data Point
                    </h2>

                    {isLoading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : (
                        <>
                            <div className="w-full">
                                <div className="break-all px-4 py-4 bg-blue-600 text-white rounded-xl">
                                    {shareUrl}
                                </div>
                            </div>

                            <div className="pt-2 flex justify-center mt-6">
                                <button
                                    type="button"
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer"
                                    onClick={handleCopy}
                                >
                                    <Copy size={16} />
                                    {copied ? "Copied!" : "Copy link"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default ShareDataPoint;
