export interface ApiRequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: HeadersInit;
    body?: Record<string, unknown> | FormData;
}

export interface User {
    id: string;
    fullName: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    isVerified: boolean;
    otp: string;
    otpExpiresAt: string;
    profilePicture: string;
    __v: number;
};

export interface BusinessForm {
    businessName: string;
    contactPersonFirstName: string;
    contactPersonLastName: string;
    contactName: string;
    countryCode: string;
    contactNumber: string;
    businessAddress: string;
    businessCity: string;
    businessState: string;
    businessCountry: string;
    sector: string;
    organizationSize: string;
    email: string;
    password: string;
    confirmPassword: string;
    businessLogo: string;
    certificateOfIncorporation: string;
    role: string;
}

export interface AdminForm {
    businessName: string;
    firstName: string;
    lastName: string;
    email: string;
    userType: string;
    countryCode: string;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    country: string;
    role: string;
    password: string;
    confirmPassword: string;
    image: string;
}

export interface SuperAdminSignUpPayload {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    profilePicture: string;
    confirmPassword: string;
    password: string;
}

export interface EmployeeSignUpPayload {
    firstName: string;
    lastName: string;
    email: string;
    departmentId: string;
    image: string;
    role: string;
    password: string;
    confirmPassword: string;
}

export interface BusinessSignUpPayload {
    businessName: string;
    contactPersonFirstName: string;
    contactPersonLastName: string;
    contactName: string;
    countryCode: string;
    contactNumber: string;
    businessAddress: string;
    businessCity: string;
    businessState: string;
    businessCountry: string;
    sector: string;
    organizationSize: string;
    email: string;
    password: string;
    confirmPassword: string;
    businessLogo?: string;
    certificateOfIncorporation?: string;
}

export interface SignInPayload {
    email: string;
    password: string;
}

export interface VerifyOtpPayload {
    email: string;
    otp: string;
}

export interface ResendOtpPayload {
    email: string;
}

export interface ForgotPassswordPayload {
    email: string;
}

export interface SuspendUserPayload {
    id: string;
}

export interface DeleteUserPayload {
    id: string;
}

export interface ResetPassswordPayload {
    email: string;
    resetToken: string;
    newPassword: string;
}