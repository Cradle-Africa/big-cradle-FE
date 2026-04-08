"use client";
import { FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import { DataEntry } from "@/app/lib/type";
import { formatDate } from "@/app/utils/formatDate";

interface ExportToExcelProps {
    entries: DataEntry[];
    datapoints: any;
    dataPointName: string;
}

export const ExportToExcel = ({ entries, datapoints, dataPointName }: ExportToExcelProps) => {
    const handleExportToExcel = () => {
        if (!entries.length || !datapoints?.field) return;

        const exportData = entries.map((entry) => {
            const row: Record<string, any> = {};
            row["Created at"] = formatDate(entry.createdAt ?? "");
            datapoints.field.forEach((field: any) => {
                const val = entry.data?.[field.key];
                row[field.label] = Array.isArray(val) ? val.join(", ") : val;
            });
            return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Entries");
        XLSX.writeFile(workbook, `${dataPointName} bulk-data-entries.xlsx`);
    };

    return (
        <button
            type="button"
            onClick={handleExportToExcel}
            className="flex items-center gap-1 text-sm text-blue-600 border border-blue-600 px-1 py-[6px] rounded cursor-pointer hover:bg-blue-50"
        >
            <FileDown size={14} />
            Export
        </button>
    );
};
