import { useState, useEffect } from 'react';
import { useOTP } from '../hooks/useOTP'; 
import { useResendTimer } from '../hooks/useResendTimer';
import ButtonWithLoader from './ButtonWithLoader';
import { maskEmail } from '../lib/utils'; 

export const AccessTypeSheet = ({ 
    accessType,
    setAccessType,
    onClose,
    goToStep
}) => {
    const [activeLoadingType, setActiveLoadingType] = useState(null);
    const handleAccessSelection = async (type) => {
        setActiveLoadingType(type); // Set the type that is now loading
        try {
            // Simulate an asynchronous operation (e.g., API call)
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log(`${type} Access selected`);
            setAccessType(type);
            goToStep(2);
            onClose(); // Close the sheet
        } catch (error) {
            console.error(`Error selecting ${type} access:`, error);
        } finally {
            setActiveLoadingType(null); // Reset loading state
        }
    };
    const isAnyLoading = activeLoadingType !== null;

    return (
        <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white px-6 py-[30px] z-[1001] rounded-[12px] animate-slide-up">
            <div className="flex flex-col items-center">
                <h3 className="mb-2 text-center text-bold">Choose Access Type</h3>
                <p className="text-[12px] text-center">Would you like to give Confam recurring access to fetch your identity details?</p>
            </div>
            <div className="flex flex-col mt-3 gap-2">
                <ButtonWithLoader
                    onClick={() => handleAccessSelection('continuous')}
                    isLoading={activeLoadingType === 'continuous'}
                    className="w-full"
                    disabled={isAnyLoading}
                >
                    Continuous Access
                </ButtonWithLoader>
                <ButtonWithLoader
                    onClick={() => handleAccessSelection('one-time')}
                    isLoading={activeLoadingType === 'one-time'} 
                    className="w-full bg-gray-100 text-black"
                    disabled={isAnyLoading}
                >
                    One-time Access
                </ButtonWithLoader>
            </div>
        </div>
    )
}