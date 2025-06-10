import { useState, useEffect, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ButtonWithLoader from './ButtonWithLoader';
import useDatePicker from '../hooks/useDatePicker'; 
import { useSelector, useDispatch } from 'react-redux';
import {
    setKycData, 
    setPhoneNumber
} from '../reducers/kyc/kycSlice';
import {
    openBottomSheet
} from '../reducers/bottomsheet/bottomSheetSlice';
import {
    setLoading
} from '../reducers/ui/uiSlice';
import apiClient from '../api/client';

export default function PhoneInputStep () {
    const client = useMemo(() => apiClient("http://localhost:8080/api/v1/"), []);
    const dispatch = useDispatch();
    const { phoneNumber, email } = useSelector((state) => state.kyc); 
    const { loading } = useSelector((state) => state.ui); 
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
    (phoneNumber && phoneNumber.length === 10) && 
    !!selectedDay &&            
    !!selectedMonth &&          
    !!selectedYear

    const sendOtp = async () => {
        if (!phoneNumber) {
            alert('Please enter a valid phone number.');
            return;
        }
        if (!selectedDay || !selectedMonth || !selectedYear) {
            alert('Please select a valid date.');
            return;
        }
        dispatch(setLoading(true));
        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); 
            const payload = {
                "email": email,
                "phone_number": phoneNumber,
                "dob": `${selectedYear}-${selectedMonth}-${selectedDay}`
            };
            const response = await client.post(`/allow/verify-nin`, payload, {
                headers: {
                    Accept: 'application/json',
                    //Authorization: `Bearer ${kyc_token}`,
                },
            });
            console.log('customer', response.data.results);
            dispatch(setKycData({customer: response.data.results}));
        } catch (error) {
            console.error('Error fetching KYC request:', error);
        } finally {
            //setIsAppLoading(false);
            dispatch(setLoading(false));
            dispatch(openBottomSheet("send-otp"));
        }
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
                            value={phoneNumber || ""}
                            maxLength={10}
                            onChange={(e) => dispatch(setPhoneNumber(e.target.value))}
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

                <ButtonWithLoader
                    onClick={sendOtp}
                    disabled={!canSubmit || loading}
                    isLoading={loading} 
                    className="mt-auto" 
                >
                    Continue
                </ButtonWithLoader>
            </div>
        </div>
    );
}