"use client";

import axios, { INTERNAL_URL } from "@/app/lib/axios";
import { Copy, Share2, X } from "lucide-react";
import { useFetchSingleDataPoint } from "../_features/hook";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { shortenWithTinyURL } from "@/app/utils/shortenLink";
import { Spinner } from "@radix-ui/themes";
import { getUser } from "@/app/utils/user/userData";
import { useFetchSingleBusiness } from "../../user/business/_features/hook";

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
    const user = getUser();
    const [isGeneratingLink, setIsGeneratingLink] = useState(false);

    // Get single data point
    const { isLoading: isDataPointLoading } = useFetchSingleDataPoint({
        axios,
        id: uniqueId,
        enabled: shareDataPoint,
    });

    // Get single business for employees
    const {
        data: singleBusiness,
        isLoading: isBusinessLoading,
        isSuccess: isBusinessSuccess,
    } = useFetchSingleBusiness({
        axios,
        businessUserId: user?.businessUserId ?? "",
        enabled: shareDataPoint && user?.role === "employee" && !!user?.businessUserId,
    });

    const getBusinessName = () => {
        if (user?.role === "business") return user?.businessName ?? "";
        if (user?.role === "employee") return singleBusiness?.businessName ?? "";
        return "";
    };

    const businessName = getBusinessName();
    const [copied, setCopied] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const encodedId = typeof window !== "undefined" ? btoa(uniqueId) : "";
    const [shareUrl, setShareUrl] = useState("");

    useEffect(() => {
        const generateLink = async () => {
            if (!encodedId || !businessName || typeof window === "undefined") return;
            
            setIsGeneratingLink(true);
            try {
                const fullUrl = `${INTERNAL_URL}/shared-data-point/${encodeURIComponent(businessName)}?data-point=${encodedId}`;
                const shortUrl = await shortenWithTinyURL(fullUrl);
                setShareUrl(shortUrl ?? fullUrl);
            } catch (error) {
                console.error("Error generating share link:", error);
                setShareUrl("");
            } finally {
                setIsGeneratingLink(false);
            }
        };

        // Only generate link when we have all required data
        const hasBusinessName = user?.role === "business" || 
                              (user?.role === "employee" && isBusinessSuccess);
        
        if (encodedId && hasBusinessName) {
            generateLink();
        }
    }, [encodedId, businessName, user?.role, isBusinessSuccess]);

    const handleCopy = async () => {
        if (!shareUrl) return;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success("Link copied to clipboard!");
        } catch {
            toast.error("Failed to copy link.");
        }
    };

    // Close modal on outside click
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

    useEffect(() => {
        setCopied(false);
    }, [uniqueId, shareDataPoint]);

    if (!shareDataPoint) return null;

    const isLoading = isDataPointLoading || 
                    (user?.role === "employee" && isBusinessLoading) ||
                    isGeneratingLink;

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
                        <Share2 size={18} /> Share Data Point: {dataPointName}
                    </h2>

                    {isLoading ? (
                        <div className="flex justify-center py-6">
                            <Spinner size="3" />
                        </div>
                    ) : (
                        <>
                            <div className="w-full">
                                <div className="break-all px-4 py-4 bg-blue-600 text-white rounded-xl">
                                    {shareUrl || "Generating share link..."}
                                </div>
                            </div>
                            <div className="pt-2 flex justify-center mt-6">
                                <button
                                    type="button"
                                    className={`flex items-center gap-2 ${shareUrl ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} text-white px-4 py-2 rounded-lg font-medium`}
                                    onClick={handleCopy}
                                    disabled={!shareUrl}
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