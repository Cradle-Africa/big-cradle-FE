export interface ApiRequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: HeadersInit;
	body?: Record<string, unknown>;

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

export interface SignUpPayload {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    password: string;
    profilePicture: string;
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