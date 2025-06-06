import createApiClient from './client'; // Adjust path as needed

// Create a single instance of the API client.
// This instance will have all your interceptors configured.
const apiClient = createApiClient();

/**
 * Sends an OTP (One-Time Password) to the specified destination.
 * @param {object} data - The payload for sending OTP (e.g., { email: 'user@example.com' } or { phone_number: '+1234567890' }).
 * @returns {Promise<AxiosResponse>} - The Axios response object.
 */
export const sendOtp = (data) => {
    return apiClient.post('/otp/send', data, { useAppToken: true }); // Likely needs app token for this endpoint
};

/**
 * Verifies an OTP.
 * @param {object} data - The payload for verifying OTP (e.g., { email: 'user@example.com', otp: '123456' }).
 * @returns {Promise<AxiosResponse>} - The Axios response object.
 */
export const verifyOtp = (data) => {
    return apiClient.post('/otp/verify', data, { useAppToken: true }); // Likely needs app token for this endpoint
};

/**
 * Logs in a user with email and password.
 * @param {object} credentials - User login credentials ({ email, password }).
 * @returns {Promise<AxiosResponse>} - The Axios response object containing tokens etc.
 */
export const login = (credentials) => {
    return apiClient.post('/auth/login', credentials, { useAppToken: true }); // Login often uses app token
};

/**
 * Registers a new user/company.
 * @param {object} data - Registration data.
 * @returns {Promise<AxiosResponse>}
 */
export const registerCompany = (data) => {
    return apiClient.post('/auth/register/company', data, { useAppToken: true });
};
