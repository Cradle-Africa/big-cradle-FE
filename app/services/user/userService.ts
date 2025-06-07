import { BASE_URL } from "../base";

import {
    SignUpPayload,
    SignInPayload,
    VerifyOtpPayload,
    ResendOtpPayload,
    ForgotPassswordPayload,
    ResetPassswordPayload,
    SuspendUserPayload,
    DeleteUserPayload,
    ApiRequestOptions
} from "../../types/User";

export const apiService = async (endPoint: string, method: string, payload: ApiRequestOptions) => {
    const response = await fetch(`${BASE_URL}/${endPoint}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'request failed');
    }
    return data;
};

export const signUpService = async (payload: SignUpPayload) => {
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

export const signInService = async (payload: SignInPayload) => {
    const response = await fetch(`${BASE_URL}/authentication/sign-in`, {
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

export const verifyOtpService = async (payload: VerifyOtpPayload) => {
    const response = await fetch(`${BASE_URL}/authentication/verify-otp`, {
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

export const resendOtpService = async (payload: ResendOtpPayload) => {
    const response = await fetch(`${BASE_URL}/authentication/resend-otp`, {
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

export const suspendUserService = async (payload: SuspendUserPayload) => {
    const response = await fetch(`${BASE_URL}/suspend-user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Fail to suspend a user');
    }
    return data;
};


export const deleteUserService = async (payload: DeleteUserPayload) => {
    const response = await fetch(`${BASE_URL}/delete-user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Fail to delete the user');
    }
    return data;
};

export const forgotPasswordService = async (payload: ForgotPassswordPayload) => {
    const response = await fetch(`${BASE_URL}/authentication/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Request Failed');
    }
    return data;
};

export const resetPasswordService = async (payload: ResetPassswordPayload) => {
    const response = await fetch(`${BASE_URL}/authentication/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Request Failed');
    }
    return data;
};





