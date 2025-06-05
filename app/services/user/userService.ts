import { BASE_URL } from "../base";

import { 
    SignUpSuperAdminPayload, 
    SignInSuperAdminPayload, 
    VerifyOtpPayload, 
    ResendOtpPayload  
} from "../../types/User";



export const signUpSuperAdminService = async (payload: SignUpSuperAdminPayload) => {
    const response = await fetch(`${BASE_URL}/super-admin-auth/sign-up`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
    }
    return data;
};

export const signInSuperAdminService = async (payload: SignInSuperAdminPayload) => {
    const response = await fetch(`${BASE_URL}/super-admin-auth/sign-in`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Signin failed');
    }
    return data;
};


export const verifyOtpSuperAdminService = async (payload: VerifyOtpPayload) => {
    const response = await fetch(`${BASE_URL}/super-admin-auth/verify-otp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
    }
    return data;
};  

export const resendOtpSuperAdminService = async (payload: ResendOtpPayload) => {
    const response = await fetch(`${BASE_URL}/super-admin-auth/resend-otp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Resend OTP failed');
    }
    return data;
};

