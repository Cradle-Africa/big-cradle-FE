'use client';

import { EmployeeSignUpPayload } from '@/app/pages/user/types/User';
import { ChangeEvent, useState } from 'react';
import toast from 'react-hot-toast';
import CredentialDetails from '../../components/form/CredentialDetails';
import AccountVerification from '../../components/user/AccountVerification';
import { validateEmployeeSignUp } from '../../pages/user/validation/userValidation';
import { EmployeeSignUpService } from '../../services/user/userService';
import { Spinner } from '@radix-ui/themes';
import { Check } from 'lucide-react';

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

    const handleCredentialChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validateEmployeeSignUp(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;
        setIsSubmitting(true);

        try {
            toast.loading('Loading...');
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
                        <div className='w-full'>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="Enter Your First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                            />
                            {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                        </div>

                        <div className='mt-4 w-full'>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Enter Your Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                            />
                            {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                        </div>

                        <CredentialDetails formData={formData} onChange={handleCredentialChange} errors={errors} />

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-2 rounded-md hover:cursor-pointer text-white bg-blue-700`}
                        >
                            {isSubmitting ? (
                                <Spinner className='inline mr-1' />
                            ) : (
                                <Check size={14} className="inline mr-1" />
                            )
                            }
                            {isSubmitting ? 'Submitting...' : 'Create account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
