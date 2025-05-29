import { useState, useEffect } from 'react';
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Lock, Landmark, User, ChevronUp } from 'lucide-react';
import { Calendar as CalendarIcon } from "lucide-react"

export const PhoneInputStep = ({ 
  phoneNumber,
  setPhoneNumber,
  onContinue,
  otpMethod,
  setOtpMethod
}) => {
  const [date, setDate] = useState(undefined);
  
  return (
    <div className="h-full flex flex-col">
        <div className="text-center mb-4">
            <h3>Personal Information</h3>
        </div>
        <div className="flex-1 flex flex-col py-[20px]">
            <div className="mb-3">
                <label htmlFor="phone" className="block text-[18px] font-medium">
                    Phone Number
                </label>
                <input
                    type="tel"
                    className="w-full px-[20px] py-[14px] border bg-transparent border-[#E5E5E5] focus:outline-none"
                    id="phone"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
            </div>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                    type="button"
                    >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                    <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    />
                </PopoverContent>
            </Popover>

            <div className="mb-4">
                <label className="block text-[18px] font-medium mb-2">Preferred OTP Method</label>
                <div className="flex items-center gap-4">
                    <label className="flex items-center">
                    <input
                        type="radio"
                        name="otpMethod"
                        value="sms"
                        checked={otpMethod === 'sms'}
                        onChange={(e) => setOtpMethod(e.target.value)}
                        className="mr-2"
                    />
                    SMS
                    </label>
                    <label className="flex items-center">
                    <input
                        type="radio"
                        name="otpMethod"
                        value="whatsapp"
                        checked={otpMethod === 'whatsapp'}
                        onChange={(e) => setOtpMethod(e.target.value)}
                        className="mr-2"
                    />
                    Whatsapp
                    </label>
                </div>
            </div>

            <button onClick={onContinue} className="primary-button mt-auto">Continue</button>
        </div>
    </div>
  );
}