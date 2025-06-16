'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { validateSignUp } from '../../pages/user/validation/userValidation';
import { SuperAdminSignUpService } from '../../services/user/userService';
import AccountVerification from '@/app/components/user/AccountVerification';
import toast from 'react-hot-toast';
import CredentialDetails from '../form/CredentialDetails';

export default function SuperAdminSignUp() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'super admin',
        profilePicture: '',
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAccountVerification, setShowAccountVerification] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleCredentialChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validateSignUp(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        setIsSubmitting(true);
        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            role: formData.role,
            password: formData.password,
            profilePicture: formData.profilePicture,
            confirmPassword: formData.confirmPassword,
        };

        try {
            toast.loading('Loading...');
            await SuperAdminSignUpService(payload);
            toast.dismiss();
            toast.success('Account created successfully!');
            setShowAccountVerification(true);
        } catch (error: unknown) {
            toast.dismiss();
            if (error instanceof Error) {
                toast.error(error.message || 'Sign up failed. Please try again.');
            } else {
                toast.error('Sign up failed, please try again')
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-h-screen flex justify-between md:py-0 bg-white">
            {showAccountVerification && (
                <AccountVerification
                    showAccountVerification={showAccountVerification}
                    setShowAccountVerification={setShowAccountVerification}
                    email={formData.email}
                />
            )}

            <div className="w-full py-4 bg-white">
                <div className="w-full max-w-md space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <>
                            <div className='md:flex justify-between gap-2'>
                                <div className='w-full md:w-1/2'>
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                                    />
                                    {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                                </div>

                                <div className='mt-4 md:mt-0 w-full md:w-1/2 '>
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                                    />
                                    {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                                </div>
                            </div>
                            <CredentialDetails formData={formData} onChange={handleCredentialChange} errors={errors} />

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-2 rounded-md hover:cursor-pointer text-gray-400 bg-gray-200 ${isSubmitting ? 'bg-gray-300' : 'shadow-md hover:text-white hover:bg-gradient-to-br hover:from-[#578CFF] hover:to-[#0546D2] hover:opacity-90'}`}
                            >
                                {isSubmitting ? 'Submitting...' : 'Create account'}
                            </button>
                        </>
                    </form>
                </div>
            </div>
        </div >
    );
}
