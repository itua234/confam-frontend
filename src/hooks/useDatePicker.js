import { useState, useEffect, useMemo } from 'react';

const useDatePicker = () => {
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    // 2. Generate Years (memoized as it's static)
    const currentYear = useMemo(() => new Date().getFullYear(), []); // Memoize currentYear too, effectively constant
    const startYear = 1900; // You can adjust this as needed

    const years = useMemo(() => {
        return Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i);
    }, [currentYear, startYear]); // Dependencies are static, so this array is created once

    // 3. Define Months (memoized as it's static)
    const months = useMemo(() => [
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
    ], []); // Empty dependency array means it's created once

    const getDaysInMonth = (month, year) => {
        if (!month || !year) {
            return []; // Return empty array if month or year is not selected
        }
        const monthIndex = parseInt(month, 10) - 1; // Month is 0-indexed in Date object
        const fullYear = parseInt(year, 10);
        // new Date(year, monthIndex + 1, 0) gets the last day of the given month
        const numDays = new Date(fullYear, monthIndex + 1, 0).getDate();
        return Array.from({ length: numDays }, (_, i) => i + 1);
    };

    // 5. State for dynamically generated days based on month/year
    const [daysInCurrentMonth, setDaysInCurrentMonth] = useState(
        Array.from({ length: 31 }, (_, i) => i + 1) // Default to 31 days
    );

    // 6. useEffect to update days when month or year changes
    useEffect(() => {
        let targetYearForCalculation = selectedYear;

        // If a month is selected but no year, use the current year for calculation
        if (selectedMonth && !selectedYear) {
            targetYearForCalculation = String(currentYear); // Ensure type consistency with selectedYear
        }

        if (selectedMonth && targetYearForCalculation) {
            const newDays = getDaysInMonth(selectedMonth, targetYearForCalculation);
            setDaysInCurrentMonth(newDays);

            // If the currently selected day is no longer valid for the new month/year, reset it
            if (selectedDay && !newDays.includes(parseInt(selectedDay, 10))) {
                setSelectedDay('');
            }
        } else {
            // If month or year are not fully selected, reset days to default 31 and clear selected day
            setDaysInCurrentMonth(Array.from({ length: 31 }, (_, i) => i + 1));
            setSelectedDay('');
        }
    }, [selectedMonth, selectedYear]); // currentYear also goes here if used in effect

    // 7. Return all necessary states, setters, and lists
    return {
        selectedDay,
        setSelectedDay,
        selectedMonth,
        setSelectedMonth,
        selectedYear,
        setSelectedYear,
        daysInCurrentMonth,
        months,
        years,
    };
};

export default useDatePicker;