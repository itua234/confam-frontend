import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// For web, use localStorage instead of AsyncStorage
// If you need more complex storage (e.g., IndexedDB, Web SQL), consider a library like localforage
const storage = {
    getItem: async (key) => localStorage.getItem(key),
    setItem: async (key, value) => localStorage.setItem(key, value),
    multiRemove: async (keys) => {
        keys.forEach(key => localStorage.removeItem(key));
    },
};

// request cancellation setup (still valid, but AbortController is the modern way)
const cancelTokenSource = axios.CancelToken.source();

// Uncomment and use environment variables in a real-world scenario
// Note: process.env.EXPO_PUBLIC_APP_TOKEN is an Expo-specific way to access public env variables.
// In a standard React Native setup, you might use react-native-dotenv or similar.
const appToken = import.meta.env.REACT_APP_TOKEN;

const createApiClient = (baseURL = "http://localhost:8080/api/v1/") => {
    const client = axios.create({
        baseURL: baseURL,
        timeout: 10000, // 10 seconds
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        cancelToken: cancelTokenSource.token // Keep this for now, but consider AbortController
    });

    const refresh_token = async (error) => { // Removed 'any' type annotation
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = await storage.getItem('refresh_token'); // Use web storage
            if (refreshToken) {
                try {
                    const { data } = await client.post(
                        '/auth/refresh-token',
                        { refresh_token: refreshToken },
                        { useAppToken: true }
                    );
                    await storage.setItem('user_token', data.results.token); // Use web storage
                    await storage.setItem('refresh_token', data.results.refresh_token); // Use web storage
                    originalRequest.headers.Authorization = `Bearer ${data.results.token}`;
                    console.log("token has been refreshed");
                    return client(originalRequest);
                } catch (refreshError) {
                    console.log('Token refresh failed:', refreshError);
                    // Handle failed refresh (e.g., logout user)
                    await storage.multiRemove(['user_token', 'refresh_token']); // Use web storage
                    // IMPORTANT: In a React component, you would typically trigger
                    // a global state change (e.g., context, Redux) here to
                    // redirect the user to the login page. This utility file
                    // should ideally not handle navigation directly.
                    return Promise.reject(refreshError); // Propagate the refresh error
                }
            }else {
                // No refresh token found, force logout
                await storage.multiRemove(['user_token', 'refresh_token']);
                return Promise.reject(error); // Reject the original error as no refresh is possible
            }
        }
        // For other 401 errors (e.g., token already refreshed on a previous attempt, or not a token issue)
        // or if _retry is already true, simply reject the original error
        return Promise.reject(error);
    };

    // Add a request interceptor
    client.interceptors.request.use(
        async (config) => { 
            // Check if a custom token is provided directly in the request config headers
            // or via a custom 'customAuthToken' property
            const customToken = config.headers?.Authorization?.startsWith('Bearer ')
                ? config.headers.Authorization.split(' ')[1]
                    : config.customAuthToken;
            
            // Flags to determine token source for refresh logic
            config._authSource = null;
            if (customToken) {
                // If a custom token is explicitly provided, use it and skip default logic
                config.headers.Authorization = `Bearer ${customToken}`;
                config._authSource = 'custom';
            } else if (config.useAppToken && appToken) {
                // If useAppToken is true, use the static appToken
                config.headers.Authorization = `Bearer ${appToken}`;
                config._authSource = 'app';
            }
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );

    // Add a response interceptor to handle errors globally
    client.interceptors.response.use(
        //log.info(`Response: ${response.status} ${response.config.url}`);
        (response) => response, // Removed 'AxiosResponse' type annotation
        async (error) => { // Removed 'AxiosError' type annotation (though you could keep it if `axios.AxiosError` is imported)
            if (axios.isAxiosError(error)) { // Use axios.isAxiosError for runtime check
                if (error.response) {
                    // Handle specific HTTP error codes
                    switch (error.response.status) {
                        case 401:
                            console.log('Unauthorized: Redirect to login');
                            //await refresh_token(error);
                            break;
                        case 404:
                            console.warn('Resource not found:', error.config.url); // Use warn for non-critical errors
                            break;
                        case 500:
                            console.error('Server error:', error.response.data);
                            break;
                        case 422:
                            console.log('Validation error:', error.response.data);
                            break;
                        default:
                            console.log('An error occurred:', {
                                message: error.message,
                                status: error.response.status,
                                data: error.response.data,
                                url: error.config.url
                            });
                    }
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log('No response received:', error.request);
                } else {
                    // Something happened in setting up the request
                    console.log('Request setup error:', error.message);
                }
            } else {
                // Handle non-Axios errors
                console.log('An unexpected error occurred:', error);
            }
            // Propagate the error to the .catch() block of the request
            return Promise.reject(error);
        }
    );

    return client;
}

export default createApiClient;