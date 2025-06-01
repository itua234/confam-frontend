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
    // New state to hold the dynamically generated days for the month
    const [daysInCurrentMonth, setDaysInCurrentMonth] = useState([]);
    const getDaysInMonth = (month, year) => {
        if (!month || !year) {
            return [];
        }
        // Month in JavaScript Date object is 0-indexed (0 for January, 11 for December)
        const monthIndex = parseInt(month, 10) - 1;
        const fullYear = parseInt(year, 10);

        // Trick: Create a Date object for the 0th day of the *next* month.
        // This effectively rolls back to the last day of the *current* month.
        const numDays = new Date(fullYear, monthIndex + 1, 0).getDate();

        // Generate an array from 1 to numDays
        return Array.from({ length: numDays }, (_, i) => i + 1);
    };

    // useEffect to update the 'daysInCurrentMonth' whenever 'selectedMonth' or 'selectedYear' changes
    useEffect(() => {
        const newDays = getDaysInMonth(selectedMonth, selectedYear);
        setDaysInCurrentMonth(newDays);
        // Important: If the currently selected day is no longer valid for the new month/year,
        // reset the selected day to prevent an invalid date.
        if (selectedDay && !newDays.includes(parseInt(selectedDay, 10))) {
            setSelectedDay(''); // Reset selected day to empty or a default like '1'
        }
    }, [selectedMonth, selectedYear]); 
  
    // 1. Generate Days (1 to 31)
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
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
    // 3. Generate Years (e.g., from 1900 to the current year)
    const currentYear = new Date().getFullYear();
    const startYear = 1900; // You can adjust this as needed
    const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i);
  
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
                        "w-full px-[20px] py-[24px] rounded-none justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                    >
                        <CalendarIcon />
                        {date ? format(date, "PPP") : <span>Date of Birth</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                    <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    // Add this prop to enable dropdowns for month and year
                    captionLayout="dropdown-years"
                    fromYear={1950} // Optional: define a year range for dropdowns
                    toYear={2050}
                    />
                </PopoverContent>
            </Popover>

            <Select onValueChange={setSelectedDay} value={selectedDay}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                    {daysInCurrentMonth.map(day => (
                        <SelectItem key={day} value={String(day)}>
                        {   day}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Month Select Input */}
            <Select onValueChange={setSelectedMonth} value={selectedMonth}>
                <SelectTrigger className="w-[180px]">
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

            {/* Year Select Input */}
            <Select onValueChange={setSelectedYear} value={selectedYear}>
                <SelectTrigger className="w-[120px]"> {/* Adjust width as needed */}
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

            {/* Display selected date for demonstration */}
            {selectedDay && selectedMonth && selectedYear && (
                <p>Selected Date: {selectedDay}/{selectedMonth}/{selectedYear}</p>
            )}

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

            <button onClick={onContinue} className="primary-button mt-auto">Continue</button>
        </div>
    </div>
  );
}