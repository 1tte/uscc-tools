import { useState } from "react";

export default function DiskImageAnalyzer() {
    const [file, setFile] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const analyzeDiskImage = async () => {
        if (!file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("diskImage", file);
        
        try {
            const response = await fetch("http://localhost:5000/analyze-disk", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            setAnalysis(data);
        } catch (error) {
            console.error("Error analyzing disk image:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="dark:bg-gray-800 shadow-lg rounded-xl p-6 max-w-lg w-full">
                <h1 className="text-2xl font-bold text-white text-center mb-4">Disk Image Analyzer</h1>
                
                <label className="block w-full bg-gray-50 border border-gray-300 rounded-lg p-2 cursor-pointer text-gray-700 text-sm hover:bg-gray-100 transition">
                    <input 
                        type="file" 
                        accept=".img,.iso,.dd,.e01" 
                        onChange={handleFileChange} 
                        className="hidden" 
                    />
                    {file ? file.name : "Click to upload a disk image"}
                </label>

                <button 
                    onClick={analyzeDiskImage} 
                    disabled={!file || loading}
                    className={`w-full mt-4 py-2 font-semibold rounded-md transition ${
                        file && !loading 
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-gray-400 text-gray-200 cursor-not-allowed"
                    }`}
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-2">
                            <span className="animate-spin border-4 border-white border-t-transparent rounded-full w-5 h-5"></span>
                            Analyzing...
                        </div>
                    ) : "Analyze Disk Image"}
                </button>

                {analysis && (
                    <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold text-gray-700">🔍 Analysis Result</h2>
                        <pre className="text-xs bg-gray-900 text-green-300 p-3 rounded mt-2 overflow-auto max-h-60">
                            {JSON.stringify(analysis, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}
