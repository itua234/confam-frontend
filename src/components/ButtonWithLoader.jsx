// components/ui/ButtonWithLoader.jsx
import React from 'react';
import { cn } from "@/lib/utils"; // Assuming you have this utility for conditional class names

const ButtonWithLoader = ({
  children,
  onClick,
  isLoading = false, // Default to false
  disabled = false,  // Default to false
  className,         // Allow custom classes to be passed
  ...rest            // Capture any other standard button props (e.g., type="submit")
}) => {
    // Combine internal disabled state with external disabled prop
    const isDisabled = disabled || isLoading;

    return (
        <button
        onClick={onClick}
        disabled={isDisabled}
        className={cn(
            "primary-button flex items-center justify-center gap-2", // Base styles for your button
            "transition-all duration-200 ease-in-out", // Smooth transitions for disabled state
            "disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed", // Tailwind disabled styles
            className, // Apply any additional custom classes
        )}
        {...rest} // Spread any other props like type="submit"
        >
            {isLoading ? (
                // Simple spinner animation using Tailwind CSS
                <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
                </svg>
            ) : (
                children // Show button text/content when not loading
            )}
        </button>
    );
};

export default ButtonWithLoader;