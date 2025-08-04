"use client";

import axios, { INTERNAL_URL } from "@/app/lib/axios";
import { Copy, Share2, X } from "lucide-react";
import { useFetchSingleDataPoint } from "../_features/hook";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { shortenWithTinyURL } from "@/app/utils/shortenLink";
import { Spinner } from "@radix-ui/themes";
import { getUser } from "@/app/utils/user/userData";

interface PopUpProps {
    shareDataPoint: boolean;
    onClose: () => void;
    uniqueId: string;
    dataPointName: string;
}

const ShareDataPoint: React.FC<PopUpProps> = ({
    shareDataPoint,
    onClose,
    uniqueId,
    dataPointName,
}) => {
    const { isLoading } = useFetchSingleDataPoint({
        axios,
        id: uniqueId,
        enabled: shareDataPoint,
    });

    const user = getUser()
    let businessName = '';
    if (user?.role === 'business') {
        businessName = user?.businessName;
    };

    const [copied, setCopied] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    //Encode uniqueId using Base64 for public sharing
    const encodedId = typeof window !== "undefined" ? btoa(uniqueId) : "";
    const [shareUrl, setShareUrl] = useState("");

    useEffect(() => {
        const generateLink = async () => {
            if (encodedId && typeof window !== "undefined") {
                const fullUrl = `${INTERNAL_URL}/shared-data-point/${businessName}?data-point=${encodedId}`;
                const shortUrl = await shortenWithTinyURL(fullUrl);
                setShareUrl(shortUrl ?? fullUrl);
            }
        };

        generateLink();
    }, [encodedId, businessName]);


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
                        <Share2 size={18} />  {'Share Data Point'}: {dataPointName}

                    </h2>

                    {isLoading ? (
                        <p className="text-gray-500"> <Spinner /></p>
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
