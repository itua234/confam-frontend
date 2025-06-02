import { maskEmail } from '../lib/utils'; 
import { Smartphone, Mail } from 'lucide-react';

export const SendOtpBottomSheet = ({ 
  email,
  phoneNumber,
  onClose
}) => {
    return (
        <div className="bg-white px-6 py-[40px] shadow-lg z-[1001] rounded-[12px] animate-slide-up">
            <div className="flex flex-col items-center mb-4">
                <h5 className="text-xl font-semibold">How will you receive your OTP?</h5>
                <p className="text-[14px]">Choose from the options below</p>
            </div>
            <div className="mt-6 flex flex-col gap-4"> {/* Added gap-4 for vertical spacing */}
                <button
                    onClick={() => console.log("button clicked")} // Click handler for SMS
                    className="group w-full px-4 py-[10px] border-2 border-[#E5E5E5] bg-gray-100 rounded-lg text-lg font-medium"
                >
                    <div className="flex items-center justify-between group-hover:text-blue-500 transition-colors duration-200 ease-in-out">
                    <div className="flex items-center justify-center">
                        <div className="flex items-center justify-center w-[35px] h-[35px] rounded-full bg-white mr-[15px]">
                        <Smartphone size="18" />
                        </div>
                        <p className="text-[16px]">Phone: ****{phoneNumber && phoneNumber.slice(-4)}</p>
                    </div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20" height="20" viewBox="0 0 15 15" 
                        className="group-hover:text-blue-500 transition-colors duration-200 ease-in-out"
                    >
                        <path fill="currentColor" fill-rule="evenodd" d="M6.182 4.182a.45.45 0 0 1 .636 0l3 3a.45.45 0 0 1 0 .636l-3 3a.45.45 0 1 1-.636-.636L8.864 7.5L6.182 4.818a.45.45 0 0 1 0-.636" clip-rule="evenodd"/>
                    </svg>
                    </div>
                </button>

                <button
                    onClick={() => console.log("button clicked")} // Click handler for WhatsApp
                    className="group w-full px-4 py-[10px] border-2 border-[#E5E5E5] bg-gray-100 rounded-lg text-lg font-medium"
                >
                    <div className="flex items-center justify-between group-hover:text-blue-500 transition-colors duration-200 ease-in-out">
                        <div className="flex items-center justify-center">
                            <div className="flex items-center justify-center w-[35px] h-[35px] rounded-full bg-white mr-[15px]">
                                <Mail size="18" />
                            </div>
                            <p className="text-[16px]">Email: {maskEmail(email)}</p>
                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20" height="20" viewBox="0 0 15 15" 
                            className="group-hover:text-blue-500 transition-colors duration-200 ease-in-out"
                        >
                            <path fill="currentColor" fill-rule="evenodd" d="M6.182 4.182a.45.45 0 0 1 .636 0l3 3a.45.45 0 0 1 0 .636l-3 3a.45.45 0 1 1-.636-.636L8.864 7.5L6.182 4.818a.45.45 0 0 1 0-.636" clip-rule="evenodd"/>
                        </svg>
                    </div>
                </button>
            </div>
        </div>
    )
}