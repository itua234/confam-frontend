import { useState, useEffect } from 'react';
import { maskEmail } from '../lib/utils'; 
import { Smartphone, Mail } from 'lucide-react';
import loader from '../assets/loader.gif'
import { sendOtp } from "../api/request";

export const SendOtpBottomSheet = ({ 
  email,
  phoneNumber,
  onFinish
}) => {
    const [sendingMethod, setSendingMethod] = useState(null);
    
    const handleSendOTP = async (method) => {
        setSendingMethod(method); 
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log(`OTP sent via ${method} to ${method === 'sms' ? phoneNumber : email}`);
            
            onFinish();
        } catch (error) {
            console.log(`Error sending OTP via ${method}:`, error);
            alert(`Failed to send OTP via ${method}. Please try again.`); // User feedback for error
        } finally {
            setSendingMethod(null); 
        }
    };
    const isSending = sendingMethod !== null;

    return (
        <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white px-6 py-[40px] shadow-lg z-[1001] rounded-[12px] animate-slide-up">
            <div className="flex flex-col items-center mb-4">
                <h5 className="text-xl font-semibold">How will you receive your OTP?</h5>
                <p className="text-[14px]">Choose from the options below</p>
            </div>
            <div className="mt-6 flex flex-col gap-4">
                <button
                    onClick={() => handleSendOTP('sms')} 
                    disabled={isSending}
                    className="group w-full px-4 py-[10px] border-2 border-[#E5E5E5] bg-gray-100 rounded-lg text-lg font-medium"
                >
                    <div className="flex items-center justify-between group-hover:text-blue-500 transition-colors duration-200 ease-in-out">
                    <div className="flex items-center justify-center">
                        <div className="flex items-center justify-center w-[35px] h-[35px] rounded-full bg-white mr-[15px]">
                        <Smartphone size="18" />
                        </div>
                        <p className="text-[16px]">Phone: ****{phoneNumber && phoneNumber.slice(-4)}</p>
                    </div>
                    {sendingMethod === 'sms' ? (
                        <img src={loader} alt="Sending..." className="w-[20px] h-[20px]" />
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20" height="20" viewBox="0 0 15 15"
                            className="group-hover:text-blue-500 transition-colors duration-200 ease-in-out"
                        >
                            <path fill="currentColor" fillRule="evenodd" d="M6.182 4.182a.45.45 0 0 1 .636 0l3 3a.45.45 0 0 1 0 .636l-3 3a.45.45 0 1 1-.636-.636L8.864 7.5L6.182 4.818a.45.45 0 0 1 0-.636" clipRule="evenodd"/>
                        </svg>
                    )}
                    </div>
                </button>

                <button
                    onClick={() => handleSendOTP('email')} 
                    disabled={isSending}
                    className="group w-full px-4 py-[10px] border-2 border-[#E5E5E5] bg-gray-100 rounded-lg text-lg font-medium"
                >
                    <div className="flex items-center justify-between group-hover:text-blue-500 transition-colors duration-200 ease-in-out">
                        <div className="flex items-center justify-center">
                            <div className="flex items-center justify-center w-[35px] h-[35px] rounded-full bg-white mr-[15px]">
                                <Mail size="18" />
                            </div>
                            <p className="text-[16px]">Email: {maskEmail(email)}</p>
                        </div>
                        {sendingMethod === 'email' ? (
                            <img src={loader} alt="Sending..." className="w-[20px] h-[20px]" />
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20" height="20" viewBox="0 0 15 15"
                                className="group-hover:text-blue-500 transition-colors duration-200 ease-in-out"
                            >
                                <path fill="currentColor" fillRule="evenodd" d="M6.182 4.182a.45.45 0 0 1 .636 0l3 3a.45.45 0 0 1 0 .636l-3 3a.45.45 0 1 1-.636-.636L8.864 7.5L6.182 4.818a.45.45 0 0 1 0-.636" clipRule="evenodd"/>
                            </svg>
                        )}
                    </div>
                </button>
            </div>
        </div>
    )
}