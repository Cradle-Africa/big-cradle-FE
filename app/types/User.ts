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
    fullName: string;
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