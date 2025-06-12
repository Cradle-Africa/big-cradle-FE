'use client';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { apiPostService } from '../../services/apiService';
import { convertToBase64 } from '../../utils/covertToBase64';
import { FormPopupProps, OptionType } from './types/PopUp';
import { validateFields } from './validation/formValidator';
import { FileImage } from 'lucide-react';

const FormPopup: React.FC<FormPopupProps> = ({
    setOpen,
    title,
    endPoint,
    method,
    fields,
    defaultValues = {},
}) => {
    const [formData, setFormData] = useState<Record<string, any>>(defaultValues);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [dynamicOptions, setDynamicOptions] = useState<Record<string, OptionType[]>>({});

    useEffect(() => {
        setFormData({ ...defaultValues });

        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);

        // Load dynamic options
        fields.forEach(async field => {
            if (field.type === 'select' && field.fetchOptions) {
                const options = await field.fetchOptions();
                setDynamicOptions(prev => ({ ...prev, [field.name]: options }));
            }
        });

        return () => document.removeEventListener('mousedown', handler);
    }, [setOpen, defaultValues, fields]);

    const validate = () => {
        const newErrors = validateFields(fields, formData);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
            const files = e.target.files;
            if (files && files.length > 0) {
                setFormData(prev => ({ ...prev, [name]: files[0] }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        setIsSubmitting(true);
        try {
            toast.loading('Submitting...');
            const payload: Record<string, any> = {};
            // Handle non-file fields
            fields.forEach(field => {
                if (field.type !== 'file' && formData[field.name] !== undefined && formData[field.name] !== null) {
                    payload[field.name] = String(formData[field.name]).trim();
                }
            });
            // Handle image field
            const imageField = fields.find(f => f.type === 'file');
            if (imageField && formData[imageField.name]) {
                const base64Image = await convertToBase64(formData[imageField.name]);
                payload[imageField.name] = base64Image;
            }

            await apiPostService(endPoint, method, payload);
            toast.dismiss();
            toast.success('Operation successful!');
            setOpen(false);
        } catch (error: any) {
            toast.dismiss();
            toast.error(error?.message || 'Submission failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/40 z-40" />
            <div className="bg-white p-6 rounded-md shadow-md w-82 md:w-full max-w-md z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" ref={menuRef}>
                <h2 className="text-center text-md font-semibold text-gray-700 mb-2">{title}</h2>
                <form onSubmit={handleSubmit} className="space-y-4 mt-5">
                    {fields.map(field => (
                        <div key={field.name}>
                            <label className="block text-sm text-gray-600 mb-1">{field.label}</label>
                            {field.type === 'file' ? (
                                <div className='relative bg-gray-100 rounded'>
                                    <input
                                        type="file"
                                        name={field.name}
                                        onChange={handleChange}
                                        className="ml-5 w-full px-3 py-2 text-sm outline-none cursor-pointer"
                                    />
                                    <FileImage size={15} className='absolute top-1/3 ml-2 mt-[-2px]' />
                                </div>
                            ) : field.type === 'select' ? (
                                <select
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none"
                                >
                                    <option value="">Select {field.label}</option>
                                    {(field.options || dynamicOptions[field.name] || []).map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none"
                                />
                            )}

                            {errors[field.name] && (
                                <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                            )}


                        </div>
                    ))}

                    <div className="flex gap-5 justify-center mt-6">
                        <button
                            type="button"
                            className="w-full bg-gray-300 text-gray-600 py-2 rounded-md hover:bg-gradient-to-br hover:from-[#578CFF] hover:to-[#0546D2] hover:opacity-90 hover:cursor-pointer hover:text-white"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-2 rounded-md bg-gray-300 text-gray-600 hover:text-white hover:bg-gradient-to-br hover:from-[#578CFF] hover:to-[#0546D2] hover:cursor-pointer hover:opacity-90 "
                        >
                            {isSubmitting ? 'Processing...' : title}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default FormPopup;