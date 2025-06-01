import React from 'react';
import { ChevronUp } from 'lucide-react';
// Define props interface for TypeScript users
// interface AccordionTriggerContentProps {
//   icon: React.ElementType; // The icon component itself (e.g., User, Landmark, Lock)
//   title: string;
//   itemCount: number;
//   isComplete: boolean; // Boolean to control the checkmark
// }

const AccordionTriggerContent = ({ icon: Icon, title, subtitle, isComplete }) => {
    return (
        <div className="w-full flex items-center justify-between">
            <div className="flex items-center">
                <div className="rounded-full flex items-center justify-center h-[35px] w-[35px] border border-[#bbb]">
                    {Icon && <Icon size={18} />} {/* Render the passed icon component */}
                </div>
                <div className="flex flex-col mx-2">
                    <span className="">{title}</span>
                    <span className="text-[12px]">{subtitle}</span>
                </div>
            </div>
            <div className="">
                {isComplete ? ( // Conditionally render the checkmark SVG
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
    );
};

export default AccordionTriggerContent;