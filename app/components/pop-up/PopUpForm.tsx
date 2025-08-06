'use client';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { apiPostService } from '../../services/apiService';
import { convertToBase64 } from '../../utils/covertToBase64';
import { FormPopupProps, OptionType } from './types/PopUp';
import { validateFields } from './validation/formValidator';
import ImageUpload from '../form/ImageUploader';
import { Spinner } from '@radix-ui/themes';
import { Check } from 'lucide-react';

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
        setFormData(prev => {
            const isSame = JSON.stringify(prev) === JSON.stringify(defaultValues);
            return isSame ? prev : { ...defaultValues };
        });

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

    const handleInputChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
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
                const value = formData[imageField.name];
                payload[imageField.name] = typeof value === 'string' && value.startsWith('data:')
                    ? value
                    : await convertToBase64(value);
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
            <div className="bg-white p-6 rounded-md shadow-md w-82 md:w-full max-w-xl z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" ref={menuRef}>
                <h2 className="text-center text-md font-semibold text-black mb-2">{title}</h2>
                <form onSubmit={handleSubmit} className="space-y-4 mt-5">
                    {fields.map(field => (
                        <div key={field.name}>
                            <label className="block text-md text-black mb-1">{field.label}</label>
                            {field.type === 'file' ? (
                                <div className=''>
                                    <ImageUpload
                                        onChange={handleInputChange}
                                        text="Upload Certificate of corporation"
                                        id="image"
                                        name={field.name}
                                    />
                                </div>
                            ) : field.type === 'select' ? (
                                <select
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-4 py-2 text-sm outline-none"
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
                            className="w-1/2 py-2 rounded-md bg-gray-100 text-black hover:bg-blue-600 hover:text-white hover:cursor-pointer"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-1/2 flex justify-center items-center py-2 rounded-md text-white bg-blue-600 hover:cursor-pointer`} 
                            >
                            {isSubmitting ? (
                                <Spinner className='inline mr-1' />
                            ) : (
                                <Check size={14} className="inline mr-1" />
                            )
                            }
                            {isSubmitting ? 'Processing...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default FormPopup;