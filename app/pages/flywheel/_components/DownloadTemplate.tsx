"use client";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

interface DownloadTemplateProps {
    data: any;
    dataPointName: string;
}

export const DownloadTemplate = ({ data, dataPointName }: DownloadTemplateProps) => {
    const handleDownloadTemplate = () => {
        if (!data?.field) return;

        const headers = data.field.map((f: any) => f.label || f.key);
        const sampleRow = data.field.reduce((acc: any, f: any) => {
            acc[f.label] = f.type === "checkbox" ? "Option1, Option2" : f.label;
            return acc;
        }, {});
        const worksheet = XLSX.utils.json_to_sheet([sampleRow], { header: headers });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
        XLSX.writeFile(workbook, `${dataPointName} data-entry-template.xlsx`);
    };

    return (
        <button
            type="button"
            onClick={handleDownloadTemplate}
            className="flex items-center gap-1 text-sm text-blue-700 border border-blue-600 px-1  py-[6px] rounded cursor-pointer hover:bg-blue-50"
        >
            <Download size={14} />
            Template
        </button>
    );
};