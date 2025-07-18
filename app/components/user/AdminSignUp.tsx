'use client';

import { useState, ChangeEvent } from 'react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import AccountVerification from '@/app/components/user/AccountVerification';
import { AdminForm } from '@/app/pages/user/types/User';
import { validateAdminSignUp, validateAdminStep } from '../../pages/user/validation/userValidation';
import CountryCodeSelect from '@/app/components/form/CountryCodeSelect';
import { AdminSignUpService } from '../../services/user/userService';
import { removeEmptyProperties } from '../../utils/clean-data';
import CredentialDetails from '../form/CredentialDetails';
import { CountrySelect, StateSelect } from 'react-country-state-city';
import "react-country-state-city/dist/react-country-state-city.css";
import { Spinner } from '@radix-ui/themes';

export default function AdminSignUp() {
    const [step, setStep] = useState<number>(1);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showVerification, setShowVerification] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [form, setForm] = useState<AdminForm>({
        businessName: '',
        firstName: '',
        lastName: '',
        email: '',
        userType: '',
        countryCode: '',
        phoneNumber: '',
        address: '',
        city: '',
        state: '',
        country: '',
        adminCountryCode: 0,
        adminStateCode: 0,
        role: 'admin',
        password: '',
        confirmPassword: '',
        image: '',
    });

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, files } = e.target as HTMLInputElement;
        if (files && files.length > 0) {
            const reader = new FileReader();
            reader.onloadend = () =>
                setForm((prev) => ({ ...prev, [name]: reader.result as string }));
            reader.readAsDataURL(files[0]);
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };


    const handleCredentialChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const next = () => {
        const validationErrors = validateAdminStep(step, form);
        setErrors(validationErrors);


        if (Object.keys(validationErrors).length === 0) {
            setStep((s) => s + 1);
        }
    };

    const back = () => setStep((s) => s - 1);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validateAdminSignUp(form);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        setIsSubmitting(true);
        try {
            const clean_form = removeEmptyProperties(form) as AdminForm;
            toast.loading('Loading...');
            await AdminSignUpService(clean_form);
            toast.dismiss()
            toast.success('Admin registered successfully!');
            setShowVerification(true);
        } catch (error) {
            toast.dismiss();
            toast.error(error instanceof Error ? error.message : 'Registration failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-h-80 flex bg-white">
            {showVerification && (
                <AccountVerification
                    showAccountVerification={showVerification}
                    setShowAccountVerification={setShowVerification}
                    email={form.email}
                />
            )}

            <div className="w-full py-4 bg-white">
                <div className="w-full space-y-6">
                    <form onSubmit={handleSubmit} className="">
                        {/* Step 1 */}
                        {step === 1 && (
                            <>
                                <div>
                                    <select
                                        name="userType"
                                        value={form.userType}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                                    >
                                        <option value="">Select User type</option>
                                        <option value="corporate">corporate</option>
                                        <option value="individual">individual</option>
                                    </select>
                                    {errors.userType && <p className="text-red-500 text-xs">{errors.userType}</p>}
                                </div>
                                {form.userType === 'corporate' && (
                                    <div className='mt-5'>
                                        <input name="businessName" value={form.businessName} onChange={handleChange} placeholder="Business Name" className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none" />
                                        {errors.businessName && <p className="text-red-500 text-xs">{errors.businessName}</p>}
                                    </div>
                                )}

                                {form.userType === 'individual' && (
                                    <>
                                        <div className='mt-5'>
                                            <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none" />
                                            {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                                        </div>

                                        <div className='mt-5'>
                                            <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none" />
                                            {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                                        </div>
                                    </>
                                )}

                                <div className="md:flex w-full gap-2 mt-5">
                                    <div className='md:w-2/3'>
                                        <CountryCodeSelect
                                            value={form.countryCode}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                                        />
                                        {errors.countryCode && <p className="text-red-500 text-xs">{errors.countryCode}</p>}
                                    </div>
                                    <div className='mt-5 md:mt-0 w-full md:w-2/3'>
                                        <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Phone Number" className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none" />
                                        {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}
                                    </div>
                                </div>

                                <div className="flex justify-start mt-2 border-b border-gray-200 py-1 italic text-sm">
									Step {step} out of 3
								</div>
                                <button type="button" onClick={next}
                                    className="flex w-full items-center justify-center mt-5 rounded px-2 py-2 bg-blue-600 text-white hover:cursor-pointer">
                                    Next
                                    <ChevronRight size={14} className="inline ml-1" />
                                </button>
                            </>
                        )}

                        {/* Step 2 */}
                        {step === 2 && (
                            <>
                                <div className='mt-5 w-full'>
                                    <CountrySelect
                                        onChange={(country: any) => {
                                            setForm((prev) => ({
                                                ...prev,
                                                country: country.name,
                                                adminCountryCode: country.id,
                                                state: "",
                                                adminStateCode: 0,
                                                city: "",
                                            }));
                                        }}
                                        value={form.country}
                                        placeHolder="Select Country"
                                        className="mb-1 border-none"
                                        containerClassName="relative w-full !border-none"
                                        inputClassName="w-full !border-none rounded-md px-3 !py-1 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.country && <p className="text-red-500 text-xs">{errors.country}</p>}
                                </div>

                                <div className='w-full mt-5'>
                                    <StateSelect
                                        countryid={form.adminCountryCode}
                                        onChange={(state: any) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                state: state.name,
                                                adminStateCode: state.id,
                                                city: "",
                                            }))
                                        }
                                        value={form.state}
                                        placeHolder="Select State"
                                        className="mb-1 border-none"
                                        containerClassName="relative w-full !border-none"
                                        inputClassName="w-full !border-none rounded-md px-3 !py-1 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}
                                </div>

                                <div className="w-full mt-5">
                                    <input
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        placeholder="City"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none" />
                                    {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
                                    {/* <CitySelect
                                        countryid={form.adminCountryCode}
                                        stateid={form.adminStateCode}
                                        onChange={(city: any) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                city: city.name,
                                            }))
                                        }
                                        value={form.city}
                                        placeHolder="Select City"
                                        className="mb-1 border-none"
										containerClassName="relative w-full !border-none"
										inputClassName="w-full !border-none rounded-md px-3 !py-1 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                    {errors.businessCity && <p className="text-red-500 text-xs">{errors.businessCity}</p>} */}
                                </div>

                                <div className="w-full mt-5">
                                    <input
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        placeholder="Address"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                                    />
                                    {errors.address && (
                                        <p className="text-red-500 text-xs">
                                            {errors.address}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-between gap-2 mt-5">
                                    <button
                                        type="button"
                                        onClick={back}
                                        className="flex items-center justify-center w-1/2 px-2 py-2 rounded text-black bg-gray-100 hover:cursor-pointer hover:bg-blue-600 hover:text-white"
                                    >
                                        <ChevronLeft size={14} className="inline ml-1" />
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={next}
                                        className="flex items-center justify-center w-1/2 rounded px-2 py-2 hover:cursor-pointer bg-blue-600 text-white"
                                    >
                                        Next
                                        <ChevronRight size={14} className="inline ml-1" />
                                    </button>
                                </div>

                                <div className="flex justify-start mt-2 border-b border-gray-200 py-1 italic text-sm">
									Step {step} out of 3
								</div>
                            </>
                        )}

                        {/* Step 3 */}
                        {step === 3 && (
                            <>

                                <CredentialDetails formData={form} onChange={handleCredentialChange} errors={errors} />

                                <div className="flex justify-start mt-2 border-b border-gray-200 py-1 italic text-sm">
									Step {step} out of 3
								</div>
                                <div className="flex justify-between gap-2 mt-5">
                                    <button type="button" onClick={back}
                                        className="flex items-center justify-center w-1/2 px-2 py-2 rounded text-black bg-gray-100 hover:cursor-pointer hover:bg-blue-600 hover:text-white"                                    >
                                        <ChevronLeft size={14} className="inline ml-2" />
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-1/2 flex justify-center items-center py-2 rounded-md text-white bg-blue-600 hover:cursor-pointer "
                                            }`} >
                                        {isSubmitting ? (
                                            <Spinner className='inline mr-1' />
                                        ) : (
                                            <Check size={14} className="inline mr-1" />
                                        )
                                        }
                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>
                            </>
                        )}

                    </form>
                </div>
            </div>
        </div>
    );
}
