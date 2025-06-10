import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAppLoading: true,
    appIsReady: false,
    hasError: false,
    isAuthenticated: false,
    errorMessage: '',
    currentStep: 0,
    totalSteps: 5,
    loading: false,
    otpMethod: null
};

const uiSlice = createSlice({
    name: 'ui',
    initialState: initialState,
    reducers: {
        setIsAppLoading: (state, action) => {
            state.isAppLoading = action.payload;
        },
        setAppIsReady: (state, action) => {
            state.appIsReady = action.payload;
        },
        setisAuthenticated: (state, action) => {
            state.isAuthenticated = !!action.payload;
        },
        setAppError: (state, action) => {
            state.hasError = action.payload.hasError;
            state.errorMessage = action.payload.message;
        },
        setCurrentStep: (state, action) => {
            state.currentStep = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setOtpMethod: (state, action) => {
            state.otpMethod = action.payload;
        },
        nextStep: (state) => {
            if (state.currentStep < state.totalSteps) {
                state.currentStep += 1;
            }
        },
        prevStep: (state) => {
            if (state.currentStep > 1) {
                state.currentStep -= 1;
            }
        },
        resetAppUI: (state) => {
            // Reset UI state to initial values, useful after an error or completion
            state.isAppLoading = false; 
            state.hasError = false;
            state.errorMessage = '';
            state.currentStep = 0;
        }
    },
});

export const {
    setIsAppLoading,
    setAppIsReady,
    setisAuthenticated,
    setAppError,
    setCurrentStep,
    setLoading,
    setOtpMethod,
    nextStep,
    prevStep,
    resetAppUI
} = uiSlice.actions;
export default uiSlice.reducer;