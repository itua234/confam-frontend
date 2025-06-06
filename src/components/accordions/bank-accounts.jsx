import React from 'react';
import { Landmark, Plus, Lock, ChevronUp } from 'lucide-react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function BankAccountsAccordion({ bankAccounts }) {
    const isComplete = bankAccounts.length > 0; 

    return (
        <AccordionItem value="item-3" className="accordion-header">
            <AccordionTrigger className="accordion-trigger">
                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="rounded-full flex items-center justify-center h-[35px] w-[35px] border border-[#bbb]">
                            <Landmark size={18} />
                        </div>
                        <div className="flex flex-col mx-2">
                            <span className="">Bank accounts</span>
                            <span className="text-[12px]">{`${bankAccounts.length} accounts`}</span>
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
            <AccordionContent className="bank-accordion-content">
                {bankAccounts.map((account, index) => (
                    <div key={index} className="flex items-center justify-between mb-[20px] px-[20px]">
                        <div className="">
                        <h5>{account.accountName}</h5>
                        <h6>{account.accountNumber}</h6>
                        <h6>{account.bankName}</h6>
                        </div>
                        <div className="">
                            <Lock size={18} /> 
                        </div>
                    </div>
                ))}
                {/* Placeholder for adding new bank accounts */}
                <div className="flex flex-1 items-center justify-center">
                    <div className="cursor-pointer w-3/4 h-[100px] flex items-center justify-center border-2 border-dashed border-gray-300 bg-[#F8F8F8]">
                        <Plus size={30} />
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}