import { headers } from 'next/headers';
import { User } from '../../types/User';
const key = 'user';

// Get the user data from local storage
export const getUser = (): User | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(key);
    return user ? JSON.parse(user) as User : null;
};

// Get the accessToken from local storage
export const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};


// Get the accessToken from local storage
export const getBusinessId = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('businessId');
    }
    return null;
};



// Add user data to local storage
export const addUser = (user: User) => {
    localStorage.setItem(key, JSON.stringify(user));
};

// Add access token to local storage
export const addToken = (token: string) => {
    localStorage.setItem('token', token);
};

// Remove user data from local storage
export const removeUser = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('businessId');
    window.location.href = '/user/signin';
};

export const updateUserKycStatus = (endPoint: string): void => {
    if (endPoint === 'business-auth/upload-certificate-of-incorporation') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                user.kycStatus = 'submitted';
                localStorage.setItem('user', JSON.stringify(user));
                window.location.href = '/'
            } catch (error) {
                console.error('Failed to update user in localStorage:', error);
            }
        }
    }
}
