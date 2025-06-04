import { User } from '../types/User';
const key = 'user';

// Get the user data from local storage
export const getUser = (): User | null => {
    if (typeof window === 'undefined') return null; 
    const user = localStorage.getItem(key);
    return user ? JSON.parse(user) as User : null;
};

// Add user data to local storage
export const addUser = (user: User) => {
    console.log('Adding user to local storage:', user);
    localStorage.setItem(key, JSON.stringify(user));
};

// Remove user data from local storage
export const removeUser = (): void => {
    localStorage.removeItem(key);
};
