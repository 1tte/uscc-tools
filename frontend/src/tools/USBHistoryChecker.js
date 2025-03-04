import React, { useState } from "react";

const USBHistoryChecker = () => {
    const [usbHistory, setUsbHistory] = useState([]);

    const fetchUSBHistory = async () => {
        try {
            const response = await fetch("http://localhost:5000/usb-history");
            const data = await response.json();
            setUsbHistory(data.history || []);
        } catch (error) {
            console.error("Error fetching USB history:", error);
        }
    };

    return (
        <div className="p-6 bg-gray-700 text-white text-center rounded">
            <h2 className="text-2xl font-bold">USB Device History Checker</h2>
            <button onClick={fetchUSBHistory} className="mt-4 bg-blue-500 px-4 py-2 rounded">
                Get USB History
            </button>
            <div className="mt-4 text-left bg-gray-800 p-4 rounded">
                {usbHistory.length > 0 ? (
                    <ul>
                        {usbHistory.map((line, index) => (
                            <li key={index} className="text-sm border-b border-gray-700 py-1">
                                {line}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No USB history found.</p>
                )}
            </div>
        </div>
    );
};

export default USBHistoryChecker;
