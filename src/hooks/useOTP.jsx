import { useState, useRef, useEffect, useCallback } from 'react';

export const useOTP = ({ length, currentStep }) => {
    const [otp, setOtp] = useState(Array(length).fill(''));
    const [focusedInput, setFocusedInput] = useState(null);
    // Use an array of refs for web inputs
    const inputRefs = useRef([]);
    // Initialize the refs array
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, length);
        for (let i = 0; i < length; i++) {
            if (!inputRefs.current[i]) {
                inputRefs.current[i] = { current: null }; // Initialize with a mutable object
            }
        }
    }, [length]);

    const handleOTPInputChange = useCallback((index, value, e) => {
        const newOtp = [...otp];
        const isWebBackspace = e && e.key === 'Backspace'; // For React web

        if ((isWebBackspace) && value === '' && index > 0) {
            newOtp[index] = ''; // Clear current input on backspace if empty
            if (inputRefs.current[index - 1]?.current) {
                inputRefs.current[index - 1].current.focus();
            }
        } else if (value.length > 1) {
            // Handle pasting: fill multiple digits
            const pastedDigits = value.split('').slice(0, length - index);
            pastedDigits.forEach((digit, i) => {
                if (index + i < length) {
                    newOtp[index + i] = digit;
                }
            });
            // Move focus to the last pasted digit or the end
            const nextFocusIndex = Math.min(length - 1, index + pastedDigits.length - 1);
            if (inputRefs.current[nextFocusIndex]?.current) {
                inputRefs.current[nextFocusIndex].current.focus();
            }
        } else {
            // Normal single digit input
            newOtp[index] = value;
            if (value !== '' && index < length - 1 && inputRefs.current[index + 1]?.current) {
                inputRefs.current[index + 1].current.focus();
            } else if (value !== '' && index === length - 1) {
                // If last input is filled, unfocus (optional)
                inputRefs.current[index].current.blur();
            }
        }
        setOtp(newOtp);
    }, [otp, length]);

    const handleKeyDown = useCallback((index, e) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            // Prevents clearing the previous input when backspace is pressed on an empty input
            // and moves focus back. The `handleOTPInputChange` will handle clearing
            // the previous input's value.
            inputRefs.current[index - 1]?.current?.focus();
        }
    }, [otp]);

    useEffect(() => {
        const timer = setTimeout(() => {
            // Focus the first input on mount
            if (inputRefs.current[0]?.current) {
                inputRefs.current[0].current.focus();
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [currentStep]); // Run only once on mount

    return {
        otp,
        //setOtp, // Added setOtp to allow external control if needed
        focusedInput,
        setFocusedInput,
        inputRefs, // Renamed 'inputs' to 'inputRefs' for clarity in React web context
        handleOTPInputChange,
        handleKeyDown,
        isComplete: otp.every((digit) => digit !== '')
    };
};