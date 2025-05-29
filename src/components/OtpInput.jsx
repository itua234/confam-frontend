import { useState, useEffect } from 'react';
import { useOTP } from '../hooks/useOTP'; 
import { useResendTimer } from '../hooks/useResendTimer';

export const OtpInput = ({ 
  phoneNumber,
  otp, 
  inputRefs,
  focusedInput,
  onContinue,
  setFocusedInput,
  handleOTPInputChange,
  handleKeyDown,
  otpMethod
}) => {
    const {
        resendIsDisabled,
        formattedTime,
        resetTimer
    } = useResendTimer(120);
    const [isResending, setIsResending] = useState(false); // New state to manage loading for resend
    
    const handleResendOTP = async () => {
        setIsResending(true); // Set loading state to true
        try{
        // For now, simulate a successful API call with a delay
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate 2-second API delay
        //console.log(`OTP resent to ${phoneNumber} via ${otpMethod}.`);
        alert('New OTP sent!'); // User feedback
        resetTimer(); // Reset the timer ONLY after a successful API call
        // --- End Simulate API Request ---
        }catch (error) {
            console.error('Error resending OTP:', error);
            alert('Failed to resend OTP. Please try again.'); // User feedback for error
        } finally {
            setIsResending(false); // Reset loading state
        }
    };

    return (
        <div className="h-full flex flex-col items-center">
            <h3 className="mb-4">Enter OTP</h3>
            <p className="text-center mb-6">A verification code has been sent to your {otpMethod === 'sms' ? 'phone number' : 'email address'}.</p>
            <div className="h-full flex flex-col pb-[20px]">
                <div className="flex justify-between">
                    {otp.map((digit, index) => (
                        <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                            // Only allow numeric input
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            handleOTPInputChange(index, value, e);
                        }}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onFocus={() => setFocusedInput(index)}
                        onBlur={() => setFocusedInput(null)}
                        ref={el => inputRefs.current[index].current = el}
                        //ref={el => (inputRefs.current[index] = el)}
                        //ref={inputRefs[index]}
                        className={`border-2 ${
                            focusedInput == index
                                ? 'border-primary' 
                                : 'border-[#89ABD940]'
                        } rounded-[5px] w-[15%] h-[60px] text-center text-[20px] font-primary text-primary`}
                        />
                    ))}
                </div>

                <div className="">
                    <p className="text-sm text-gray-500 mt-4">
                        Did not receive the code? 
                        <button
                        type="button"
                        disabled={resendIsDisabled}
                        onClick={handleResendOTP}
                        className="cursor-pointer text-blue-600 ml-1 bg-transparent border-none p-0 font-inherit">
                        {/* {otpMethod === 'sms' ? 'Resend via SMS' : 'Resend via Email'}  */}
                            {isResending ? 'Sending...' : 'Resend code'}
                        </button>
                        <span className="ml-1">
                        in {formattedTime}
                        </span>
                    </p>
                </div>

                <button 
                onClick={onContinue} 
                disabled={!otp.every(digit => digit !== '')} // Disable if any input is empty
                className="primary-button mt-auto w-full disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed mt-auto w-full">
                    Verify OTP
                </button>
            </div>
        </div>
    )
}