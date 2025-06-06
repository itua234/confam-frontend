

import { useState, useEffect } from 'react';
import ButtonWithLoader from '../ButtonWithLoader';
import { CloudUpload, Plus } from 'lucide-react';

export const UploadAddressSheet = ({ 
  
}) => {
    
    return (
        <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white px-6 py-[30px] shadow-lg z-[1001] rounded-[12px] animate-slide-up">
            <div className="flex flex-col items-center">
                <h3 className="mb-2 text-center">Enter your Address</h3>
                <p className="text-center mb-5 text-[12px]">Your details are securely stored and never shared without your permission.</p>
                <div className="w-full">
                    <div className="mb-[20px]">
                        <div className="">
                            <input
                                type="tel"
                                className="rounded-[5px] w-full px-[20px] py-[14px] border bg-transparent border-[#E5E5E5] focus:outline-none"
                                id="meter-number"
                                placeholder="Meter number"
                                //value={"786694048488"}
                                maxLength={10}
                                //onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                        <div className="mt-[10px]">
                            <input
                                type="tel"
                                className="rounded-[5px] w-full px-[20px] py-[14px] border bg-transparent border-[#E5E5E5] focus:outline-none"
                                id="address"
                                placeholder="Address"
                                //value={"786694048488"}
                                maxLength={10}
                                //onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
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