import { useState, useRef, useEffect, useCallback } from 'react';

export const useOTP = ({ length, currentStep }) => {
    const [otp, setOtp] = useState(Array(length).fill(''));
    const inputRefs = useRef([]); // This is the correct setup for inputRefs.current as an array of DOM elements
    const [focusedInput, setFocusedInput] = useState(null); // Keep track of the currently focused input

    // Ensure inputRefs.current has the correct number of elements (initialized to null)
    // This is crucial if the 'length' prop can change
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, length);
        for (let i = inputRefs.current.length; i < length; i++) {
            inputRefs.current[i] = null; // Initialize missing refs
        }
    }, [length]);


    const handleOTPInputChange = useCallback((index, value, e) => {
        const newOtp = [...otp];
        // Ensure only one digit is kept and it's numeric
        const sanitizedValue = value.replace(/[^0-9]/g, '').slice(0, 1);
        newOtp[index] = sanitizedValue;
        setOtp(newOtp);

        // Logic to move focus to the next input
        if (sanitizedValue && index < length - 1) { // If a digit was entered and it's not the last input
            // RequestAnimationFrame ensures the DOM is updated before trying to focus
            requestAnimationFrame(() => {
                inputRefs.current[index + 1]?.focus();
            });
        }
    }, [otp, length]); // Add otp and length to dependencies

    const handleKeyDown = useCallback((index, e) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            // If backspace is pressed on an empty input, move focus to the previous input
            requestAnimationFrame(() => {
                inputRefs.current[index - 1]?.focus();
            });
        }
    }, [otp]); // Add otp to dependencies

    // This part is important for initial focus or when step changes
    useEffect(() => {
        // You might want to focus the first input when the component mounts or currentStep changes
        // Or focus the first empty input
        const firstEmptyIndex = otp.findIndex(digit => digit === '');
        if (inputRefs.current[firstEmptyIndex] && firstEmptyIndex !== -1) {
             requestAnimationFrame(() => {
                inputRefs.current[firstEmptyIndex].focus();
            });
        } else if (inputRefs.current[0] && length > 0) { // Fallback to first input if all filled or no empty
            requestAnimationFrame(() => {
                inputRefs.current[0].focus();
            });
        }
    }, [currentStep, length]); // Re-run effect when currentStep or length changes

    const isComplete = otp.every(digit => digit !== '');

    return {
        otp,
        inputRefs,
        handleOTPInputChange,
        handleKeyDown,
        isComplete,
        focusedInput,
        setFocusedInput
    };
};