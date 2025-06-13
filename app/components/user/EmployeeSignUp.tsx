'use client';

import { useState, ChangeEvent } from 'react';
import { validateEmployeeSignUp } from '../../utils/user/userValidation';
import { EmployeeSignUpService } from '../../services/user/userService';
import toast from 'react-hot-toast';
import { File, Eye, EyeOff } from 'lucide-react';
import { EmployeeSignUpPayload } from '@/app/types/User';
import AccountVerification from '../../components/user/AccountVerification';
import ImageUploader from '../ImageUploader';

interface EmployeeSignUpProps {
    signUpToken: any;
    employeeEmail: any;
    businessUserId: any;
}

export default function EmployeeSignUp({ signUpToken, employeeEmail, businessUserId }: EmployeeSignUpProps) {

    const [formData, setFormData] = useState<EmployeeSignUpPayload>({
        firstName: '',
        lastName: '',
        email: employeeEmail,
        businessUserId: businessUserId,
        image: '',
        password: '',
        confirmPassword: '',
        role: 'employee',
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showVerification, setShowVerification] = useState<boolean>(false);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, files } = e.target as HTMLInputElement;
        if (files && files.length > 0) {
            const reader = new FileReader();
            reader.onloadend = () =>
                setFormData((prev) => ({ ...prev, [name]: reader.result as string }));
            reader.readAsDataURL(files[0]);
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validateEmployeeSignUp(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;
        setIsSubmitting(true);

        try {
            await EmployeeSignUpService(formData, signUpToken);
            toast.dismiss();
            toast.success('Signed up successfully!');
            setShowVerification(true)
        } catch (error: unknown) {
            toast.dismiss();
            if (error instanceof Error) {
                toast.error(error.message || 'Request failed');
            } else {
                toast.error('Request failed, please try again')
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-h-screen w-full flex justify-between md:py-0 bg-white">
            {showVerification && (
                <AccountVerification
                    showAccountVerification={showVerification}
                    setShowAccountVerification={setShowVerification}
                    email={formData.email}
                />
            )}
            <div className="w-full py-4 bg-white">
                <div className="w-full max-w-md space-y-6">
                    <form onSubmit={handleSubmit} className="w-full space-y-4">
                        <div className='md:flex w-full justify-between gap-2'>
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

                        <div className='mt-5'>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                            />
                            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                        </div>

                        <div className='relative mt-5'>
                            <label>Profile picture</label>
                            <ImageUploader
                                onChange={handleFileChange}
                                text="Upload Profile Image"
                                id="image"
                                name="image"
                            />
                            {errors.image && <p className="text-red-500 text-xs">{errors.image}</p>}
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 outline-none"
                            />
                            <div className="absolute right-3 top-2.5 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </div>
                            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                        </div>

                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 outline-none"
                            />
                            <div className="absolute right-3 top-2.5 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-2 rounded-md hover:cursor-pointer text-gray-400 bg-gray-200 ${isSubmitting ? 'bg-gray-300' : 'shadow-md hover:text-white hover:bg-gradient-to-br hover:from-[#578CFF] hover:to-[#0546D2] hover:opacity-90'}`}

                        >
                            {isSubmitting ? 'Submitting...' : 'Create account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
