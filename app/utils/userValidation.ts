export interface SignUpFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface SignInFormData {
    email: string;
    password: string;
}

export interface ResetPasswordFormData {
    password: string;
    confirmPassword: string;
}

export const validateSignUp = (data: SignUpFormData): { [key: string]: string } => {
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


export const validateSignIn = (data: SignInFormData): { [key: string]: string } => {
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