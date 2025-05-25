import { useState, useEffect } from "react";
import { useWatchContractEvent } from "wagmi";

export const useEmployeeEvents = (contractAddress, abi) => {
    const [events, setEvents] = useState([]);

    useWatchContractEvent({
        abi,
        address: contractAddress,
        eventName: "EmployeeAdded",
        onLogs(logs) {
            console.log('New logs Added!', logs)
            setEvents((prev) => [
                ...prev,
                ...logs.map((log) => ({ ...log, eventType: "addition" })),
            ]);
        },
    });

    useWatchContractEvent({
        abi,
        address: contractAddress,
        eventName: "EmployeePaid",
        onLogs(logs) {
            console.log('New logs Paid!', logs);
            setEvents((prev) => [
                ...prev,
                ...logs.map((log) => ({ ...log, eventType: "payment" })),
            ]);
        },
        onError(error) {
            console.error("EmployeePaid event error:", error);
        },
        poll: true,
    });

    useWatchContractEvent({
        abi,
        address: contractAddress,
        eventName: "EmployeeRemoved",
        onLogs(logs) {
            console.log('New logs Removed!', logs);
            setEvents((prev) => [
                ...prev,
                ...logs.map((log) => ({ ...log, eventType: "removal" })),
            ]);
        },
    });

    return events;
};