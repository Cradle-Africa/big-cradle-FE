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
    return localStorage.getItem('token');
};


// Add user data to local storage
export const addUser = (user: User) => {
    console.log('Adding user to local storage:', user);
    localStorage.setItem(key, JSON.stringify(user));
};

// Add access token to local storage
export const addToken = (token: string) => {
    console.log('Adding token to local storage:', token);
    localStorage.setItem('token', token);
};

// Remove user data from local storage
export const removeUser = (): void => {
    localStorage.removeItem('token');
    window.location.href = '/user/signin';
};
