import axios from 'axios';
import { BASE_URL } from "../base";

import {
    SuperAdminSignUpPayload,
    BusinessSignUpPayload,
    EmployeeSignUpPayload,
    AdminForm,
    SignInPayload,
    VerifyOtpPayload,
    ResendOtpPayload,
    ForgotPassswordPayload,
    ResetPassswordPayload,
    SuspendUserPayload,
    DeleteUserPayload,
} from "../../pages/user/types/User";

export const SuperAdminSignUpService = async (payload: SuperAdminSignUpPayload) => {
    try {
        const response = await axios.post(`${BASE_URL}/super-admin-auth/sign-up`, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Signup failed');
    }
};

export const BusinessSignUpService = async (payload: BusinessSignUpPayload) => {
    try {
        const response = await axios.post(`${BASE_URL}/business-auth/sign-up`, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Signup failed');
    }
};

export const AdminSignUpService = async (payload: AdminForm) => {
    try {
        const response = await axios.post(`${BASE_URL}/admin-auth/sign-up`, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Signup failed');
    }
};

export const EmployeeSignUpService = async (payload: EmployeeSignUpPayload, signUpToken: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/manage-employee/complete-employee-signup?token=${signUpToken}`, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Signup failed');
    }
};

export const signInService = async (payload: SignInPayload) => {
    try {
        const response = await axios.post(`${BASE_URL}/authentication/sign-in`, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Signin failed');
    }
};

export const verifyOtpService = async (payload: VerifyOtpPayload) => {
    try {
        const response = await axios.post(`${BASE_URL}/authentication/verify-otp`, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'OTP verification failed');
    }
};

export const resendOtpService = async (payload: ResendOtpPayload) => {
    try {
        const response = await axios.post(`${BASE_URL}/authentication/resend-otp`, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Resend OTP failed');
    }
};

export const suspendUserService = async (payload: SuspendUserPayload) => {
    try {
        const response = await axios.post(`${BASE_URL}/suspend-user`, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Fail to suspend a user');
    }
};

export const deleteUserService = async (payload: DeleteUserPayload) => {
    try {
        const response = await axios.post(`${BASE_URL}/delete-user`, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Fail to delete the user');
    }
};

export const forgotPasswordService = async (payload: ForgotPassswordPayload) => {
    try {
        const response = await axios.post(`${BASE_URL}/authentication/forgot-password`, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Request Failed');
    }
};

export const resetPasswordService = async (payload: ResetPassswordPayload) => {
    try {
        const response = await axios.post(`${BASE_URL}/authentication/reset-password`, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Request Failed');
    }
};