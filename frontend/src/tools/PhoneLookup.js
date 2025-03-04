import { useState } from 'react';

function PhoneLookup() {
    const [phone, setPhone] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        setData(null);
        
        try {
            const response = await fetch('http://localhost:5000/api/getcontact', {  // Adjust for deployed server
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber: phone })
            });            
            
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            
            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err.message);
        }
        
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
            <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-center mb-4">Phone Lookup</h2>
                <div className="relative">
                    <input
                        type="text"
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <button
                        onClick={handleSearch}
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-500 py-2 rounded font-semibold flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? <span className="loader"></span> : 'Search'}
                    </button>
                </div>
                
                {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
                
                {data && (
                    <div className="mt-4 p-4 bg-gray-700 rounded">
                        <h3 className="font-semibold">Results:</h3>
                        <pre className="text-sm whitespace-pre-wrap break-words">{JSON.stringify(data, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PhoneLookup;