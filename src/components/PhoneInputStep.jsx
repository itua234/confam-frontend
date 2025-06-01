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

export const PhoneInputStep = ({ 
  phoneNumber,
  setPhoneNumber,
  onContinue,
  otpMethod,
  setOtpMethod
}) => {
    const [date, setDate] = useState(undefined);
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    // 3. Generate Years (e.g., from 1900 to the current year)
    const currentYear = new Date().getFullYear();
    const startYear = 1900; // You can adjust this as needed
    const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i);

    // New state to hold the dynamically generated days for the month
    const [daysInCurrentMonth, setDaysInCurrentMonth] = useState(
        Array.from({ length: 31 }, (_, i) => i + 1)
    );
    const getDaysInMonth = (month, year) => {
        if (!month || !year) {
            return [];
        }
        const monthIndex = parseInt(month, 10) - 1;
        const fullYear = parseInt(year, 10);
        const numDays = new Date(fullYear, monthIndex + 1, 0).getDate();
        return Array.from({ length: numDays }, (_, i) => i + 1);
    };
    useEffect(() => {
        let targetYearForCalculation = selectedYear;
        if (selectedMonth && !selectedYear) {
            targetYearForCalculation = String(currentYear); // Convert to string to match selectedYear type
        }
        if (selectedMonth && targetYearForCalculation) {
            const newDays = getDaysInMonth(selectedMonth, targetYearForCalculation);
            setDaysInCurrentMonth(newDays);
            // Reset selected day if it's no longer valid for the new month/year
            if (selectedDay && !newDays.includes(parseInt(selectedDay, 10))) {
                setSelectedDay('');
            }
        } else {
            setDaysInCurrentMonth(Array.from({ length: 31 }, (_, i) => i + 1));
            // Also, clear the selected day if month/year inputs are not complete.
            setSelectedDay('');
        }
    }, [selectedMonth, selectedYear]); 
  
    // 2. Generate Months (using numbers for value, names for display)
    const months = [
        { value: '1', label: 'January' },
        { value: '2', label: 'February' },
        { value: '3', label: 'March' },
        { value: '4', label: 'April' },
        { value: '5', label: 'May' },
        { value: '6', label: 'June' },
        { value: '7', label: 'July' },
        { value: '8', label: 'August' },
        { value: '9', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
    ];
  
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
                    <input
                        type="tel"
                        className="w-full px-[20px] py-[14px] border bg-transparent border-[#E5E5E5] focus:outline-none"
                        id="phone"
                        placeholder="Enter phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
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

                <button 
                    onClick={onContinue} 
                    className="primary-button mt-auto">
                Continue</button>
            </div>
        </div>
    );
}