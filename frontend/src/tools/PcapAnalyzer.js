import { useState } from "react";

export default function PcapAnalyzer() {
    const [file, setFile] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setAnalysis(null); // Reset analysis when new file is selected
    };

    const analyzePcap = async () => {
        if (!file) return;
        setLoading(true);

        const formData = new FormData();
        formData.append("pcapFile", file);

        try {
            const response = await fetch("http://localhost:5000/analyze-pcap", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setAnalysis(data);
        } catch (error) {
            console.error("Error analyzing PCAP:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-6 `}>
            <div className="max-w-lg w-full bg-black dark:bg-gray-800 shadow-lg rounded-lg p-6">
                {/* Header with Dark Mode Toggle */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl text-white font-bold">PCAP File Analyzer</h2>
                </div>

                {/* File Upload */}
                <label className="block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 cursor-pointer text-gray-700 dark:text-white text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                    <input 
                        type="file" 
                        accept=".pcap" 
                        onChange={handleFileChange} 
                        className="hidden" 
                    />
                    {file ? file.name : "Choose a PCAP file"}
                </label>

                {/* Analyze Button */}
                <button 
                    onClick={analyzePcap} 
                    disabled={!file || loading} 
                    className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
                >
                    {loading ? "Analyzing..." : "Analyze PCAP"}
                </button>

                {/* Results Display */}
                {analysis && (
                    <div className="mt-4 p-4 bg-gray-900 text-white rounded-lg">
                        <h3 className="text-lg font-bold">Analysis Results</h3>
                        <pre className="text-sm overflow-auto max-h-60">{JSON.stringify(analysis, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}
