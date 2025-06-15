import { useState } from "react";
import Resizer from "react-image-file-resizer";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import Image from "next/image";

interface ImageUploaderProps {
    onChange: (name: string, value: string) => void;
    text: string;
    id: string;
    name: string;
}

const PdfUploader: React.FC<ImageUploaderProps> = ({ onChange, text, id, name }) => {
    const [preview, setPreview] = useState<string | null>(null);

    const handleImageUpload = (file: File) => {
        Resizer.imageFileResizer(
            file,
            100,
            100,
            "JPEG",
            80,
            0,
            (resizedImage) => {
                const base64WithPrefix = resizedImage as string;
                onChange(name, base64WithPrefix);
                setPreview(base64WithPrefix);
            },
            "base64"
        );
    };

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!(file instanceof Blob)) {
            console.error("Invalid file object received");
            return;
        }

        if (file.type === "application/pdf") {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result as string;
                onChange(name, base64);
                setPreview(base64);
            };
            reader.readAsDataURL(file); 
        } else if (file.type.startsWith("image/")) {
            handleImageUpload(file);
        } else {
            alert("Unsupported file type. Please upload an image or PDF.");
        }
    };


    const removeImage = () => {
        setPreview(null);
        onChange(name, ""); // Clear uploaded file
    };

    return (
        <div className="rounded-lg w-full py-2 bg-gray-100 text-gray-500 p-1 flex flex-col items-center">
            {!preview ? (
                <>
                    <input
                        type="file"
                        id={id}
                        name={name}
                        accept="application/pdf,image/*"
                        className="hidden"
                        onChange={onFileChange}
                    />
                    <label htmlFor={id} className="cursor-pointer flex flex-row items-center gap-x-3">
                        <AiOutlineCloudUpload size={15} />
                        <p className="text-sm">{text}</p>
                    </label>
                </>
            ) : (
                <div className="relative w-full flex flex-col justify-center items-center">
                    {preview.startsWith("data:image") ? (
                        <Image src={preview} alt="Preview" width={100} height={100} className="h-auto rounded-lg" />
                    ) : (
                        <p className="text-sm italic">PDF uploaded</p>
                    )}
                    <button
                        onClick={removeImage}
                        className="absolute right-2 text-red-500 rounded-full p-1 hover:cursor-pointer"
                    >
                        <MdClose size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default PdfUploader;
