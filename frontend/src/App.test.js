import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [text, setText] = useState('');
    const [pdfUrl, setPdfUrl] = useState('');
    const [pdfList, setPdfList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
    const [activeTool, setActiveTool] = useState("welcome"); // Default to "welcome"

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const fetchPDFs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/list-pdfs');
            setPdfList(response.data.files);
        } catch (error) {
            console.error('Error fetching PDF list:', error);
        }
    };

    const generatePDF = async () => {
        if (!text.trim()) {
            alert('Silakan masukkan teks terlebih dahulu!');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/generate-pdf', { text });
            setPdfUrl(response.data.url);
            setText('');
            fetchPDFs();
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Gagal membuat PDF. Coba lagi nanti.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPDFs();
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} setActiveTool={setActiveTool} />
            <div className="flex-1 flex flex-col items-center justify-center p-5 ml-64">
                
                {activeTool === "welcome" && <WelcomePage />}
                {activeTool === "pdf" && <AutoGeneratePDF text={text} setText={setText} generatePDF={generatePDF} loading={loading} pdfUrl={pdfUrl} pdfList={pdfList} />}
                {activeTool === "get-contact" && <GetContactChecker />}
                {activeTool === "ip-checker" && <IPChecker />}
                {activeTool === "phone-lookup" && <PhoneLookup />}
            </div>
        </div>
    );
}

// Navigation Sidebar
function Header({ toggleDarkMode, darkMode, setActiveTool }) {
    return (
        <header className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between p-6">
            <nav>
                <ul className="space-y-4">
                    <li>
                        <button onClick={() => setActiveTool("welcome")} className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700">
                            🏠 Home
                        </button>
                    </li>
                    <li>
                        <button onClick={() => setActiveTool("pdf")} className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700">
                            📄 Auto Generate PDF
                        </button>
                    </li>
                    <li>
                        <button onClick={() => setActiveTool("get-contact")} className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700">
                            🔍 Get Contact Checker
                        </button>
                    </li>
                    <li>
                        <button onClick={() => setActiveTool("ip-checker")} className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700">
                            🌍 IP Checker
                        </button>
                    </li>
                    <li>
                        <button onClick={() => setActiveTool("phone-lookup")} className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700">
                            📞 Phone Lookup
                        </button>
                    </li>
                </ul>
            </nav>
            <div className="flex flex-col gap-2">
                <button
                    onClick={toggleDarkMode}
                    className="px-3 py-2 text-sm font-medium rounded-lg transition-all dark:text-white dark:bg-gray-700"
                >
                    {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
                </button>
            </div>
        </header>
    );
}

// 🏠 Welcome Page Component
function WelcomePage() {
    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome to Our Tool Hub</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-3">Select a tool from the sidebar to get started.</p>
        </div>
    );
}

// 📄 Auto Generate PDF Component
function AutoGeneratePDF({ text, setText, generatePDF, loading, pdfUrl, pdfList }) {
    return (
        <>
            <h1 className="text-2xl font-extrabold text-center mb-6 dark:text-white">
                Auto Generate PDF with
                <span className="bg-blue-100 text-blue-800 text-2xl font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800 ml-2">
                    AI
                </span>
            </h1>
            <textarea
                className="w-full max-w-2xl border border-gray-400 p-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows="6"
                placeholder="Masukkan teks yang ingin diubah ke PDF..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-5 rounded-lg mt-4 shadow-md transition-all"
                onClick={generatePDF}
                disabled={loading}
            >
                {loading ? 'Processing...' : 'Generate PDF'}
            </button>
            {pdfUrl && (<a href={pdfUrl} className="text-blue-600 underline">Download PDF</a>)}
            <h2 className="text-xl font-semibold mt-8 dark:text-white">List PDF Tersedia</h2>
            <div className="mt-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">📂 Available PDFs</h2>
            {pdfList.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-300">No PDFs available.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pdfList.map((file, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex justify-between items-center">
                            <span className="text-gray-700 dark:text-white truncate">{file}</span>
                            <a
                                href={`http://localhost:5000/pdfs/${file}`}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-md text-sm shadow-md transition-all"
                                download
                            >
                                Download
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
        </>
    );
}

// Dummy Tools
function GetContactChecker() { return <div className="text-xl dark:text-white">🔍 Get Contact Checker Tool (Coming Soon...)</div>; }
function IPChecker(){
    return(
        <div className="text-xl dark:text-white">🌍 IP Checker Tool (Coming Soon...)</div>
    )
}
function PhoneLookup() { return <div className="text-xl dark:text-white">📞 Phone Lookup Tool (Coming Soon...)</div>; }

export default App;
