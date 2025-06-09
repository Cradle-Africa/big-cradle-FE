import { SuperAdminSignUpPayload, BusinessForm, SignInPayload } from '../types/User';


export interface ResetPasswordFormData {
    password: string;
    confirmPassword: string;
}

export const validateBusinessAdminSignUp = (data: BusinessForm): { [key: string]: string } => {
    const errors: { [key: string]: string } = {};

    if (!data.businessName.trim()) errors.businessName = 'Business name is required';
    if (!data.contactPersonFirstName.trim()) errors.contactPersonFirstName = 'First name is required';
    if (!data.contactPersonLastName.trim()) errors.contactPersonLastName = 'Last name is required';
    if (!data.contactName.trim()) errors.contactName = 'Contact name is required';
    if (!data.countryCode.trim()) errors.countryCode = 'Country code is required';
    if (!data.contactNumber.trim()) errors.contactNumber = 'Phone number is required';
    if (!data.businessAddress.trim()) errors.businessAddress = 'Address is required';
    if (!data.businessCountry.trim()) errors.businessCountry = 'Country is required';
    if (!data.businessCity.trim()) errors.businessCity = 'City is required';
    if (!data.businessState.trim()) errors.businessState = 'State is required';
    if (!data.sector.trim()) errors.sector = 'Sector is required';
    if (!data.organizationSize.trim()) errors.organizationSize = 'Organization size is required';
    if (!data.email.trim()) errors.email = 'Email is required';
    if (!data.password || data.password.length < 8)
        errors.password = 'Password must be at least 8 characters';
    if (!data.confirmPassword)
        errors.confirmPassword = 'Please confirm your password';
    else if (data.password !== data.confirmPassword)
        errors.confirmPassword = 'Passwords do not match';
    if (!data.businessLogo.trim()) errors.businessLogo = 'Business logo is required';
    if (!data.certificateOfIncorporation.trim()) errors.certificateOfIncorporation = 'Certificate of incorporation is required';

    return errors;
};


export const validateStep = (step: number, form: BusinessForm) => {
    const errors: { [key: string]: string } = {};

    if (step === 1) {
        if (!form.businessName) errors.businessName = 'Business name is required';
        if (!form.contactName) errors.contactName = 'Contact name is required';
        if (!form.contactPersonFirstName) errors.contactPersonFirstName = 'First name is required';
        if (!form.contactPersonLastName) errors.contactPersonLastName = 'Last name is required';
        if (!form.contactNumber) errors.contactNumber = 'Contact number is required';
    }

    if (step === 2) {
        if (!form.businessCountry) errors.businessCountry = 'Country is required';
        if (!form.businessState) errors.businessState = 'State is required';
        if (!form.businessAddress) errors.businessAddress = 'Address is required';
        if (!form.businessCity) errors.businessCity = 'City is required';
        if (!form.sector) errors.sector = 'Sector is required';
        if (!form.organizationSize) errors.organizationSize = 'Organization size is required';
    }

    if (step === 3) {
        if (!form.email) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Email is invalid';
        if (!form.password) errors.password = 'Password is required';
        if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
};



export const validateSignUp = (data: SuperAdminSignUpPayload): { [key: string]: string } => {
    const errors: { [key: string]: string } = {};

    if (!data.firstName.trim()) errors.firstName = 'First name is required';
    if (!data.lastName.trim()) errors.lastName = 'Last name is required';
    if (!data.email.trim()) errors.email = 'Email is required';
    if (!data.password || data.password.length < 6)
        errors.password = 'Password must be at least 6 characters';
    if (!data.confirmPassword)
        errors.confirmPassword = 'Please confirm your password';
    else if (data.password !== data.confirmPassword)
        errors.confirmPassword = 'Passwords do not match';

    return errors;
};


export const validateSignIn = (data: SignInPayload): { [key: string]: string } => {
    const errors: { [key: string]: string } = {};

    if (!data.email.trim()) errors.email = 'Email is required';
    if (!data.password || data.password.length < 8)
        errors.password = 'Password must be at least 8 characters';

    return errors;
};

export const validateResetPassword = (data: ResetPasswordFormData): { [key: string]: string } => {
    const errors: { [key: string]: string } = {};

    if (!data.password || data.password.length < 6)
        errors.password = 'Password must be at least 6 characters';
    if (!data.confirmPassword)
        errors.confirmPassword = 'Please confirm your password';
    else if (data.password !== data.confirmPassword)
        errors.confirmPassword = 'Passwords do not match';

    return errors;
};