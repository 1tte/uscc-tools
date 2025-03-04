import React, { useState, useEffect } from "react";
import axios from "axios";

const IPChecker = () => {
    const [ipData, setIpData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ip, setIp] = useState("");

    useEffect(() => {
        fetchIPData("https://ipapi.co/json/");
    }, []);

    const fetchIPData = async (url) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(url);
            setIpData(response.data);
        } catch (err) {
            setError("Failed to fetch IP data");
        } finally {
            setLoading(false);
        }
    };

    const handleIPSubmit = (e) => {
        e.preventDefault();
        if (ip) {
            fetchIPData(`https://ipapi.co/${ip}/json/`);
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">IP Address Checker</h2>
            <form onSubmit={handleIPSubmit} className="mb-4 flex items-center justify-center space-x-2">
                <input 
                    type="text" 
                    value={ip} 
                    onChange={(e) => setIp(e.target.value)} 
                    placeholder="Enter IP Address" 
                    className="p-2 border rounded w-64 dark:bg-gray-700 dark:text-white"
                />
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Check</button>
            </form>
            {loading && <div className="text-lg">Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {ipData && (
                <div className="text-lg text-gray-700 dark:text-gray-300 text-left mx-auto w-80">
                    <p><strong>IP Address:</strong> {ipData.ip}</p>
                    <p><strong>City:</strong> {ipData.city}</p>
                    <p><strong>Region:</strong> {ipData.region}</p>
                    <p><strong>Country:</strong> {ipData.country_name} ({ipData.country_code})</p>
                    <p><strong>ISP:</strong> {ipData.org}</p>
                    <p><strong>Latitude:</strong> {ipData.latitude}</p>
                    <p><strong>Longitude:</strong> {ipData.longitude}</p>
                    <p><strong>Timezone:</strong> {ipData.timezone}</p>
                    <div className="mt-4">
                        <iframe
                            title="IP Location Map"
                            width="100%"
                            height="300"
                            frameBorder="0"
                            style={{ border: 0, borderRadius: "8px" }}
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${ipData.longitude-0.1},${ipData.latitude-0.1},${ipData.longitude+0.1},${ipData.latitude+0.1}&layer=mapnik&marker=${ipData.latitude},${ipData.longitude}`}
                            allowFullScreen
                        ></iframe>
                        <p className="text-sm mt-2"><a href={`https://www.openstreetmap.org/?mlat=${ipData.latitude}&mlon=${ipData.longitude}#map=10/${ipData.latitude}/${ipData.longitude}`} target="_blank" rel="noopener noreferrer" className="text-blue-500">View Larger Map</a></p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IPChecker;