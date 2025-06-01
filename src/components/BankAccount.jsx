// components/ui/ButtonWithLoader.jsx
import React from 'react';
import { cn } from "@/lib/utils"; // Assuming you have this utility for conditional class names

const BankAccount = ({
  children,
  onClick,
  isLoading = false, // Default to false
  disabled = false,  // Default to false
  className,         // Allow custom classes to be passed
  ...rest       
}) => {
    return (
        <div className="p-3">
            <div className="mb-3">
                <label htmlFor="bankName" className="block text-sm font-medium mb-1">Bank Name</label>
                <input
                    type="text"
                    id="bankName"
                    className="w-full px-3 py-2 border rounded"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g., Access Bank"
                />
            </div>
            <div className="mb-3">
                <label htmlFor="accountNumber" className="block text-sm font-medium mb-1">Account Number</label>
                <input
                    type="text"
                    id="accountNumber"
                    className="w-full px-3 py-2 border rounded"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="0123456789"
                />
            </div>
            <div className="mb-3">
                <label htmlFor="accountName" className="block text-sm font-medium mb-1">Account Name</label>
                <input
                    type="text"
                    id="accountName"
                    className="w-full px-3 py-2 border rounded"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="John Doe"
                    readOnly // Often read-only after fetching from API
                />
            </div>
        {/* Potentially add a button to "Verify Bank Account" here */}
        </div>
    )
};

export default BankAccount;