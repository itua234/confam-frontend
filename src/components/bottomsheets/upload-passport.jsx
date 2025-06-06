

import { useState, useEffect } from 'react';
import ButtonWithLoader from '../ButtonWithLoader';
import { CloudUpload, Plus } from 'lucide-react';

export const UploadPassportSheet = ({ 
  
}) => {
    
    
    return (
        <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white px-6 py-[30px] shadow-lg z-[1001] rounded-[12px] animate-slide-up">
            <div className="flex flex-col items-center">
                <h3 className="mb-2 text-center">Enter your Passport ID</h3>
                <p className="text-center mb-4 text-[12px]">Your details are securely stored and never shared without your permission.</p>
                <div className="w-full">
                    <div className="">
                        <label
                            htmlFor="passport"
                            id="passport"
                            className="flex items-center justify-center"
                            >
                                <CloudUpload size={18} />
                                <div className="ml-[10px]">
                                    <span>Scan</span> or Upload your Passport ID card 
                                </div>
                            </label>
                            <input
                                type="file"
                                id="passpart"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                //onChange={handleFileChange}
                            />
                    </div>

                    <ButtonWithLoader
                        onClick={() => console.log("button clicked")}
                        //disabled={!otp.every(digit => digit !== '')}
                        isLoading={false} 
                        className="" 
                    >
                        Continue
                    </ButtonWithLoader>
                </div>
            </div>
        </div>
    )
}