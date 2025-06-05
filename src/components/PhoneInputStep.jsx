import { useState, useEffect } from 'react';
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Lock, Landmark, User, ChevronUp } from 'lucide-react';
import { Calendar as CalendarIcon } from "lucide-react"
import ButtonWithLoader from './ButtonWithLoader';
import useDatePicker from '../hooks/useDatePicker'; // Custom hook for date picker logic

export const PhoneInputStep = ({ 
  phoneNumber,
  setPhoneNumber,
  onContinue,
  otpMethod,
  setOtpMethod
}) => {
    const [isLoading, setIsLoading] = useState(false); // State to manage loading for the continue button
    const {
        selectedDay,
        setSelectedDay,
        selectedMonth,
        setSelectedMonth,
        selectedYear,
        setSelectedYear,
        daysInCurrentMonth,
        months,
        years,
    } = useDatePicker();

    const canSubmit =
    (phoneNumber && phoneNumber.length === 10) && // Assuming phone number must be exactly 10 digits
    !!selectedDay &&             // Check if selectedDay is not an empty string
    !!selectedMonth &&           // Check if selectedMonth is not an empty string
    !!selectedYear &&            // Check if selectedYear is not an empty string
    !!otpMethod;  

    const sendOtp = () => {
        if (!phoneNumber) {
            alert('Please enter a valid phone number.');
            return;
        }
        if (!selectedDay || !selectedMonth || !selectedYear) {
            alert('Please select a valid date.');
            return;
        }
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            onContinue({
                phoneNumber,
                dateOfBirth: `${selectedYear}-${selectedMonth}-${selectedDay}`,
                otpMethod
            });
        }, 2000); // Simulate a 2-second API call delay
    }
  
    return (
        <div className="h-full flex flex-col">
            <div className="text-center mb-4">
                <h3>Personal Information</h3>
            </div>
            <div className="h-full flex flex-col py-[20px]">
                <div className="mb-3">
                    <label htmlFor="phone" className="block text-[18px] font-medium">
                        Phone Number
                    </label>
                    <div className="flex ">
                        <div className="flex items-center justify-center w-[80px] border-r border-[#E5E5E5] text-sm bg-gray-50 text-gray-700">
                            <span>+234</span>
                        </div>
                        <input
                            type="tel"
                            className="w-full px-[20px] py-[14px] border bg-transparent border-[#E5E5E5] focus:outline-none"
                            id="phone"
                            placeholder="Enter phone number"
                            value={phoneNumber}
                            maxLength={10}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-between gap-[15px]">
                    <Select onValueChange={setSelectedDay} value={selectedDay}>
                        <SelectTrigger className="h-auto flex px-[20px] !py-[14px] rounded-none">
                            <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent className="z-[9999]">
                            {daysInCurrentMonth.map(day => (
                                <SelectItem key={day} value={String(day)}>
                                    {day}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select onValueChange={setSelectedMonth} value={selectedMonth}>
                        <SelectTrigger className="h-auto flex px-[20px] !py-[14px] rounded-none">
                            <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent className="z-[9999]">
                            {months.map(month => (
                                <SelectItem key={month.value} value={month.value}>
                                    {month.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select onValueChange={setSelectedYear} value={selectedYear}>
                        <SelectTrigger className="h-auto flex !py-[14px] rounded-none">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent className="z-[9999]">
                            {years.map(year => (
                                <SelectItem key={year} value={String(year)}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="mt-4">
                    <label className="block text-[18px] font-medium mb-2">Preferred OTP Method</label>
                    <div className="flex items-center gap-4 ">
                        <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="otpMethod"
                            value="sms"
                            checked={otpMethod === 'sms'}
                            onChange={(e) => setOtpMethod(e.target.value)}
                            className="mr-2 cursor-pointer"
                        />
                        SMS
                        </label>
                        <label className="flex items-center  cursor-pointer">
                        <input
                            type="radio"
                            name="otpMethod"
                            value="whatsapp"
                            checked={otpMethod === 'whatsapp'}
                            onChange={(e) => setOtpMethod(e.target.value)}
                            className="mr-2 cursor-pointer"
                        />
                        Whatsapp
                        </label>
                    </div>
                </div>

                <ButtonWithLoader
                    onClick={sendOtp}
                    disabled={!canSubmit || isLoading}
                    isLoading={isLoading} 
                    className="mt-auto" 
                >
                    Continue
                </ButtonWithLoader>
            </div>
        </div>
    );
}