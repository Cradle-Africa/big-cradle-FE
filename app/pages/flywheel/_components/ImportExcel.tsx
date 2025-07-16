"use client";
import { Upload } from "lucide-react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

interface ImportExcelProps {
    data: any;
    setEntries: (entries: Record<string, any>[]) => void;
}

export const ImportExcel = ({ data, setEntries }: ImportExcelProps) => {
    const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !data?.field) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target?.result;
            const workbook = XLSX.read(bstr, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

            const validEntries: Record<string, any>[] = [];
            const skipped: number[] = [];

            jsonData.forEach((row, i) => {
                const entry: Record<string, any> = {};
                let isValid = true;

                data.field.forEach((field: any) => {
                    const val = row[field.label] ?? row[field.key] ?? "";
                    if (field.required && !val) {
                        isValid = false;
                    }
                    entry[field.key] = field.type === "checkbox" && typeof val === "string"
                        ? val.split(",").map((v) => v.trim())
                        : val;
                });

                if (isValid) validEntries.push(entry);
                else skipped.push(i + 2);
            });

            if (validEntries.length) {
                setEntries(validEntries);
                toast.success(`Imported ${validEntries.length} entries`);
            }
            if (skipped.length) {
                toast.error(`Skipped rows: ${skipped.join(", ")} (missing required fields)`);
            }
        };
        reader.readAsBinaryString(file);
    };

    return (
        <label className="flex items-center gap-1 text-sm text-blue-700 border border-blue-600 px-1 py-[6px] rounded cursor-pointer hover:bg-blue-50">
            <Upload size={14} />
            Import
            <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleImportExcel}
                className="hidden"
            />
        </label>
    );
};
