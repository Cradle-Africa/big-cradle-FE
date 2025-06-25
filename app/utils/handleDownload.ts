// utils/analyse/handleDownload.ts
import jsPDF from "jspdf";

export const handleDownloadAnalysis = (rawContent: string) => {
    if (!rawContent) return;

    // Strip markdown formatting
    const plainText = rawContent
        .replace(/\*\*(.*?)\*\*/g, '$1')       // bold **text**
        .replace(/\*(.*?)\*/g, '$1')           // italics *text*
        .replace(/__(.*?)__/g, '$1')           // bold __text__
        .replace(/_(.*?)_/g, '$1')             // italics _text_
        .replace(/^#{1,6}\s*(.*)/gm, '$1')     // headings
        .replace(/^\s*-\s*/gm, '- ')           // bullets
        .replace(/`{1,3}(.*?)`{1,3}/g, '$1')   // inline code
        .replace(/^\s*>+\s?/gm, '')            // blockquotes
        .replace(/\r?\n\s*\r?\n/g, '\n\n');    // spacing

    const doc = new jsPDF();
    const lines = doc.splitTextToSize(plainText, 180);
    doc.text(lines, 10, 10);

    const today = new Date();
    const dateStr = today.toISOString().split("T")[0];
    doc.save(`analysis-${dateStr}.pdf`);
};
