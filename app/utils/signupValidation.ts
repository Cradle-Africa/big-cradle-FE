export interface SignUpFormData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface SignInFormData {
    email: string;
    password: string;
}

export const validateSignUp = (data: SignUpFormData): { [key: string]: string } => {
    const errors: { [key: string]: string } = {};

    if (!data.fullName.trim()) errors.fullName = 'Full name is required';
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