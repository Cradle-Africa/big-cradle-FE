"use client";

import { useState, ChangeEvent } from "react";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import toast from "react-hot-toast";
import AccountVerification from "@/app/components/user/AccountVerification";
import { BusinessForm } from "@/app/pages/user/types/User";
import {
  validateBusinessSignUp,
  validateBusinessStep,
} from "../../pages/user/validation/userValidation";
import CountryCodeSelect from "@/app/components/form/CountryCodeSelect";
import CountrySelect from "@/app/components/form/CountrySelect";
import { BusinessSignUpService } from "../../services/user/userService";
import SearchSelect from "../form/SearchSelect";
import cities from "../../utils/data/cities.json";
import CredentialDetails from "../../components/form/CredentialDetails";

export default function BusinessSignUp() {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showVerification, setShowVerification] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [form, setForm] = useState<BusinessForm>({
    businessName: "",
    contactPersonFirstName: "",
    contactPersonLastName: "",
    contactName: "",
    countryCode: "",
    contactNumber: "",
    businessAddress: "",
    businessCity: "",
    businessState: "",
    businessCountry: "",
    sector: "",
    organizationSize: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessLogo: "",
    role: "business",
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

  const handleSelectChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // const handleInputChange = (name: string, value: string) => {
  //   setForm((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const handleCredentialChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const next = () => {
    const validationErrors = validateBusinessStep(step, form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setStep((s) => s + 1);
    }
  };

  const back = () => setStep((s) => s - 1);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateBusinessSignUp(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      toast.loading("Loading...");
      await BusinessSignUpService(form);
      toast.dismiss();
      toast.success("Business registered successfully!");
      setShowVerification(true);
    } catch (error) {
      toast.dismiss();
      toast.error(
        error instanceof Error ? error.message : "Registration failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-h-screen flex bg-white">
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
                  <input
                    name="businessName"
                    value={form.businessName}
                    onChange={handleChange}
                    placeholder="Business Name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                  />
                  {errors.businessName && (
                    <p className="text-red-500 text-xs">
                      {errors.businessName}
                    </p>
                  )}
                </div>

                <div className="mt-5">
                  <input
                    name="contactName"
                    value={form.contactName}
                    onChange={handleChange}
                    placeholder="Contact Name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                  />
                  {errors.contactName && (
                    <p className="text-red-500 text-xs">{errors.contactName}</p>
                  )}
                </div>
                <div className="mt-5">
                  <input
                    name="contactPersonFirstName"
                    value={form.contactPersonFirstName}
                    onChange={handleChange}
                    placeholder="Contact First Name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                  />
                  {errors.contactPersonFirstName && (
                    <p className="text-red-500 text-xs">
                      {errors.contactPersonFirstName}
                    </p>
                  )}
                </div>

                <div className="mt-5">
                  <input
                    name="contactPersonLastName"
                    value={form.contactPersonLastName}
                    onChange={handleChange}
                    placeholder="Contact Last Name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                  />
                  {errors.contactPersonLastName && (
                    <p className="text-red-500 text-xs">
                      {errors.contactPersonLastName}
                    </p>
                  )}
                </div>
                <div className="md:flex w-full gap-2 mt-5">
                  <div className="md:w-2/3">
                    <CountryCodeSelect
                      value={form.countryCode}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                    />

                    {errors.countryCode && (
                      <p className="text-red-500 text-xs">
                        {errors.countryCode}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 md:mt-0 w-full md:w-2/3">
                    <input
                      name="contactNumber"
                      value={form.contactNumber}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                    />
                    {errors.contactNumber && (
                      <p className="text-red-500 text-xs">
                        {errors.contactNumber}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end mt-5">
                  <button
                    type="button"
                    onClick={next}
                    className="bg-gray-300 text-gray-500 rounded px-2 py-2 hover:cursor-pointer hover:bg-gradient-to-br hover:from-[#578CFF] hover:to-[#0546D2] hover:text-white"
                  >
                    Next
                    <ChevronRight size={14} className="inline ml-1" />
                  </button>
                </div>
              </>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <>
                <div className="md:flex w-full justify-between gap-2 mt-5">
                  <div className="w-full md:w-1/2">
                    <CountrySelect
                      value={form.businessCountry}
                      onChange={handleChange}
                      name="businessCountry"
                      className="border border-gray-300 rounded-md px-3 py-2 outline-none"
                    />
                    {errors.businessCountry && (
                      <p className="text-red-500 text-xs">
                        {errors.businessCountry}
                      </p>
                    )}
                  </div>

                  <div className="w-full md:w-1/2">
                    <input
                      name="businessState"
                      value={form.businessState}
                      onChange={handleChange}
                      placeholder="State"
                      className="w-full mt-5 md:mt-0 border border-gray-300 rounded-md px-3 py-2 outline-none"
                    />
                    {errors.businessState && (
                      <p className="text-red-500 text-xs">
                        {errors.businessState}
                      </p>
                    )}
                  </div>
                </div>
                <div className="md:flex w-full justify-between gap-2 mt-5">
                  <div className="w-full md:w-1/2">
                    <input
                      name="businessAddress"
                      value={form.businessAddress}
                      onChange={handleChange}
                      placeholder="Address"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                    />
                    {errors.businessAddress && (
                      <p className="text-red-500 text-xs">
                        {errors.businessAddress}
                      </p>
                    )}
                  </div>
                  <div className="w-full md:w-1/2 mt-5 md:mt-0">
                    <SearchSelect
                      data={cities}
                      value={form.businessCity}
                      onSelect={(value) =>
                        handleSelectChange("businessCity", value)
                      }
                      placeholder="Search for a city..."
                      name="businessCity"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                    />
                    {errors.businessCity && (
                      <p className="text-red-500 text-xs">
                        {errors.businessCity}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  <input
                    name="sector"
                    value={form.sector}
                    onChange={handleChange}
                    placeholder="Sector"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                  />
                  {errors.sector && (
                    <p className="text-red-500 text-xs">{errors.sector}</p>
                  )}
                </div>

                <div className="mt-5">
                  <select
                    name="organizationSize"
                    value={form.organizationSize}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                  >
                    <option value="">Select Organization Size</option>
                    <option value="1-10">Small</option>
                    <option value="11-50">Medium</option>
                    <option value="51-200">Large</option>
                  </select>
                  {errors.organizationSize && (
                    <p className="text-red-500 text-xs">
                      {errors.organizationSize}
                    </p>
                  )}
                </div>

                <div className="flex justify-between gap-2 mt-5">
                  <button
                    type="button"
                    onClick={back}
                    className="bg-gray-300 text-gray-500 px-2 py-2 rounded hover:cursor-pointer hover:bg-gradient-to-br hover:from-[#578CFF] hover:to-[#0546D2] hover:text-white"
                  >
                    <ChevronLeft size={14} className="inline ml-1" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="bg-gray-300 text-gray-500 rounded px-2 py-2 hover:cursor-pointer hover:bg-gradient-to-br hover:from-[#578CFF] hover:to-[#0546D2] hover:text-white"
                  >
                    Next
                    <ChevronRight size={14} className="inline ml-1" />
                  </button>
                </div>
              </>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <>
                <CredentialDetails
                  formData={form}
                  onChange={handleCredentialChange}
                  errors={errors}
                />

                {/* <div className="flex justify-between gap-2 mt-5">
                  <button
                    type="button"
                    onClick={back}
                    className="bg-gray-300 text-gray-500 px-2 py-2 rounded hover:cursor-pointer hover:bg-gradient-to-br hover:from-[#578CFF] hover:to-[#0546D2] hover:text-white"
                  >
                    <ChevronLeft size={14} className="inline ml-1" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="bg-gray-300 text-gray-500 rounded px-2 py-2 hover:cursor-pointer hover:bg-gradient-to-br hover:from-[#578CFF] hover:to-[#0546D2] hover:text-white"
                  >
                    Next
                    <ChevronRight size={14} className="inline ml-1" />
                  </button>
                </div> */}

                <div className="flex justify-between gap-2 mt-5">
                  <button
                    type="button"
                    onClick={back}
                    className="bg-gray-300 text-gray-500 px-2 py-2 rounded hover:cursor-pointer hover:bg-gradient-to-br hover:from-[#578CFF] hover:to-[#0546D2] hover:text-white"
                  >
                    <ChevronLeft size={14} className="inline ml-1" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded px-2 py-2 hover:cursor-pointer bg-gradient-to-br from-[#578CFF] to-[#0546D2] text-white"
                  >
                    <Check size={14} className="inline mr-1" />
                    {isSubmitting ? "Submitting..." : "Create Account"}
                  </button>
                </div>
              </>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <>
                {/* <div className="relative mt-5">
                  <label>Business Logo</label>
                  <ImageUploader
                    onChange={handleInputChange}
                    text="Upload Business Logo"
                    id="businessLogo"
                    name="businessLogo"
                  />
                  {errors.businessLogo && (
                    <p className="text-red-500 text-xs">
                      {errors.businessLogo}
                    </p>
                  )}
                </div> */}
                
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
