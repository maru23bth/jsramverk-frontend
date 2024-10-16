"use client"
/**
 * Auth functions
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'



const URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:1337/auth';
// const URL = 'http://localhost:3000/auth';


export const useUserStore = create(
    persist(
        (set, get) => ({
            user: null,  // Initial state of the user
            token: null,  // Initial state of the token
            setUser: (user) => set({ user }),  // Sets the user
            logoutUser: () => set({ user: null, token: null }),  // Logs out the user
            setToken: (token) => set({ token }),  // Sets the token
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ token: state.token }),
            onRehydrateStorage: (state) => {
                console.log('Rehydrated state:', state);
                return (state) => {
                    console.log('Rehydrated state 2:', state);
                    setTimeout(() => fetchSetUserState(), 0); // Delay to after the store is rehydrated
                }
            }
        }
    )
);



// Providers for the sign in page
export const providers = [{ id: 'credentials', name: 'Email and Password' }];

/**
 * Sign in function used by the sign in page
 * @param {object} provider 
 * @param {FormData} formData 
 * @returns {Promise<Object|void>} Error message or void.
 */
export const signIn = async (provider, formData) => {

    try {

        const json = await fetchAuth('/', 'POST', {
            username: formData?.get('email'),
            password: formData?.get('password'),
        });

        // Store token in localStorage
        localStorage.setItem('authToken', json.token);

        useUserStore.getState().setToken(json.token);

        await fetchSetUserState();


    } catch (error) {
        return {
            type: 'CredentialsSignin',
            error: error.message || 'Invalid credentials.',
        };
    }
};

/**
 * Fetch the user state from the server and set it in the store.
 * @param {string} token Will use the token from the store if not provided.
 * @returns void
 */
async function fetchSetUserState(token=null) {
    try {
        const user = await fetchAuth();
        console.log('fetchSetUserState:', user);
        if (user.username && !user.name) // Set name if not set.
            user.name = user.username;

        // Save user in the store
        useUserStore.getState().setUser(user);
    } catch (error) {
        // If the token is invalid, remove it from the store
        console.error('fetchSetUserState:', error);
        useUserStore.getState().setToken(null);
        useUserStore.getState().setUser(null);
    }
}

/**
 * Sign up function used by the sign up page
 * @param {object} provider 
 * @param {FormData} formData 
 * @returns {Promise<Object|void>} Error message or void.
 */
export const signUp = async (provider, formData) => {

    try {

        const json = await fetchAuth('/', 'PUT', {
            username: formData?.get('email').split('@')[0],
            email: formData?.get('email'),
            password: formData?.get('password'),
        });


        return {
            type: 'CredentialsSignin',
            error: 'User created. Please sign in.',
        };


    } catch (error) {
        return {
            type: 'CredentialsSignin',
            error: error.message || 'Invalid credentials.',
        };
    }
};

/**
 * Send an invite to the email.
 * @param {string} email Send invite to this email.
 * @returns 
 */
export async function sendInvite(email) {
    try {
        const json = await fetchAuth('/invite', 'POST', {
            email,
        });
        return 'Invite sent';
    } catch (error) {
        return error.message || 'Failed to send invite';
    }
}

/**
 * Fetch data from the server.
 * @param {string} path Path on server.
 * @param {string} method GET, POST, PUT, DELETE
 * @param {string} bodyData Data to send to the server.
 * @param {string} token The token to use for authentication, if not provided, the token from the store will be used.
 * @returns {Promise<Object>} Data from the server.
 * @throws {Error} Will throw an error if the request fails.
 */
async function fetchAuth(path = '/', method = 'GET', bodyData = null, token=null) {
    const response = await fetch(`${URL}${path}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token || useUserStore.getState().token,
        },
        body: bodyData ? JSON.stringify(bodyData) : null,
    });

    const json = await response.json();

    if (!response.ok) {
        throw new Error(json?.error);
    }
    return json;
}

