"use client";
import { Check } from "lucide-react";
import { useState } from "react";



const NewDataPoint = () => {

    const [formData, setFormData] = useState<{
        dataPointName: string;
        dataPointDescription: string;
    }>({
        dataPointName: "",
        dataPointDescription: "",
    });
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    return (
        <div className="mt-10">
            <h2 className="text-gray-800 text-lg font-normal">
                New Data Point
            </h2>
            <form className="lg:w-3/4">
                <input
                    type="text"
                    placeholder="Data point name"
                    value=""
                    name="dataPointName"
					onChange={handleChange}
                    className="mt-5 w-full border border-gray-200 rounded px-3 py-2 outline-none "
                />

                <input
                    type="text"
                    placeholder="Data point Description"
                    value=""
                    name="dataPointDescription"
					onChange={handleChange}
                    className="mt-5 w-full border border-gray-200 rounded px-3 py-2 outline-none "
                />

                <button
                    type="submit"
                    className="mt-5 flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer"
                >
                    <Check size={16} className="mr-1" />
                    Submit
                </button>
            </form>

        </div>
    );
};

export default NewDataPoint;
