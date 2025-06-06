// components/PersonalInformationAccordion.tsx
import React from 'react';
import { User } from 'lucide-react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function PersonalInformationAccordion({ customer }) {
    // Determine if all personal info is available to set isComplete
    const isComplete = !!customer.firstname && !!customer.lastname && !!customer.phone && !!customer.email && !!customer.dob;

    return (
        <AccordionItem value="item-1" className="accordion-header">
            <AccordionTrigger className="accordion-trigger">
                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="rounded-full flex items-center justify-center h-[35px] w-[35px] border border-[#bbb]">
                            <User size={18} />
                        </div>
                        <div className="flex flex-col mx-2">
                            <span className="">Personal Information</span>
                            <span className="text-[12px]">6 items</span>
                        </div>
                    </div>
                    <div className="">
                        {isComplete ? ( 
                        <div className="flex items-center justify-center w-[20px] h-[20px] rounded-full bg-[#222831]">
                            <svg className="w-4 h-4" fill="none" stroke="white" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        ): (
                            <div className="">
                                <ChevronUp size={18} />
                            </div>
                        )}
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="accordion-content bg-white">
                <div className="">
                    <div className="py-[12px] px-[18px] border-b border-gray-200">
                        <h6 className="text-[12px]">Full name</h6>
                        <div className="text-[12px] text-gray-500">{customer.firstname} {customer.lastname}</div>
                    </div>
                    <div className="py-[12px] px-[18px] border-b border-gray-200">
                        <h6 className="text-[12px] font-medium">Phone</h6>
                        <div className="text-[12px] text-gray-500">{customer.phone}</div>
                    </div>
                    <div className="py-[12px] px-[18px] border-b border-gray-200">
                        <h6 className="text-[12px] font-medium">Email </h6>
                        <div className="text-[12px] text-gray-500">{customer.email}</div>
                    </div>
                    <div className="py-[12px] px-[18px] border-b border-gray-200">
                        <h6 className="text-[12px] font-medium">Date of birth</h6>
                        <div className="text-[12px] text-gray-500">{new Date(customer.dob).toLocaleDateString()}</div>
                    </div>
                    <div className="py-[12px] px-[18px]">
                        <h6 className="text-[12px] font-medium">Next of kin</h6>
                        <div className="text-[12px] text-gray-500">
                        osemeilu kelvin 
                        </div>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}