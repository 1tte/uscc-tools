import React, { useState, useEffect } from 'react';
import IPCheckers from "./tools/IPChecker.js";
import GeneratePDF from "./tools/GeneratePDF";
import FaceComparison from './tools/FaceComparison';
import PhotoMetadataLookup from './tools/PhotoMetadataLookup.js';
import EncryptionTool from './tools/EncryptionTool.js';
import FileUploadForm from './tools/FileUploadForm.js';
import USBHistoryChecker from './tools/USBHistoryChecker.js';
import DiskImageAnalyzer from './tools/DiskImageAnalyzer.js';
import PcapAnalyzer from './tools/PcapAnalyzer.js';
import ProcessList from './tools/ProcessList.js';
import WelcomePage from './tools/WelcomePage.js';
import PhoneLookup from './tools/PhoneLookup.js';

function App() {
    const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
    const [activeTool, setActiveTool] = useState("welcome");
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    useEffect(() => {
        const handleResize = () => {
            setSidebarOpen(window.innerWidth > 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            {!sidebarOpen && (
                <button 
                    className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg dark:bg-gray-700 md:hidden" 
                    onClick={() => setSidebarOpen(true)}>
                    ☰
                </button>
            )}
            {sidebarOpen && <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} setActiveTool={setActiveTool} setSidebarOpen={setSidebarOpen} />}
            <div className={`flex-1 flex flex-col items-center justify-center p-5 ${sidebarOpen ? 'ml-64' : ''}`}>
                {activeTool === "welcome" && <WelcomePage />}
                {activeTool === "pdf" && <GeneratePDF />} 
                {activeTool === "get-contact" && <GetContactChecker />}
                {activeTool === "ip-checker" && <IPCheckers />}
                {activeTool === "phone-lookup" && <PhoneLookup />}
                {activeTool === "face" && <FaceComparison />}
                {activeTool === "photo-metadata" && <PhotoMetadataLookup />}
                {activeTool === "encryption-tool" && <EncryptionTool />}
                {activeTool === "file-upload" && <FileUploadForm />}
                {activeTool === "usb-history" && <USBHistoryChecker />}
                {activeTool === "disk-image-analyzer" && <DiskImageAnalyzer />}
                {activeTool === "pcap-analyzer" && <PcapAnalyzer />}
                {activeTool === "process-list" && <ProcessList />}
            </div>
        </div>
    );
}

function Header({ toggleDarkMode, darkMode, setActiveTool, setSidebarOpen }) {
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [isForensicsOpen, setIsForensicsOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col p-6 z-50 overflow-y-auto">
            {/* Close Sidebar Button (Mobile) */}
            <button 
                className="self-end mb-4 p-2 bg-gray-800 text-white rounded-lg dark:bg-gray-700 md:hidden" 
                onClick={() => setSidebarOpen(false)}>
                ✖
            </button>

            {/* Logo & Title */}
            <div className="flex items-center space-x-3 mb-4">
                <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/7/79/Seal_of_the_United_States_Cyber_Command.png" 
                    alt="Logo" 
                    className="w-14 h-14 rounded-full" 
                />
                <h1 className="text-lg font-bold text-gray-700 dark:text-white">USCC</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto">
                <ul>
                    <li>
                        <button 
                            onClick={() => setActiveTool("welcome")} 
                            className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">
                            Dashboard
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={() => setActiveTool("process-list")} 
                            className="block w-full text-left py-2 px-3 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">
                            Process List
                        </button>
                    </li>
                    
                    {/* Tools Section */}
                    <li>
                        <button
                            onClick={() => setIsToolsOpen(!isToolsOpen)}
                            aria-expanded={isToolsOpen}
                            className="block w-full text-left py-2 px-3 mt-2 text-gray-700 hover:bg-gray-50 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700 transition"
                        >
                            🛠️ Tools
                        </button>
                        {isToolsOpen && (
                            <ul className="ml-4 mt-2 space-y-2">
                                <li>
                                    <button 
                                        onClick={() => setActiveTool("pdf")} 
                                        className="block w-full text-left py-2 px-3 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">
                                        📄 Auto Generate PDF
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => setActiveTool("encryption-tool")} 
                                        className="block w-full text-left py-2 px-3 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">
                                        🔏 Encryption Tools
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => setActiveTool("file-upload")} 
                                        className="block w-full text-left py-2 px-3 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">
                                        📱 CSRF
                                    </button>
                                </li>
                            </ul>
                        )}
                    </li>
                    
                    {/* Forensics Section */}
                    <li>
                        <button
                            onClick={() => setIsForensicsOpen(!isForensicsOpen)}
                            aria-expanded={isForensicsOpen}
                            className="block w-full text-left py-2 px-3 mt-2 text-gray-700 hover:bg-gray-50 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700 transition"
                        >
                            🔬 Forensics
                        </button>
                        {isForensicsOpen && (
                            <ul className="ml-4 mt-2 space-y-2">
                                <li><button onClick={() => setActiveTool("get-contact")} className="block w-full text-left py-2 px-3 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">🔍 Get Contact</button></li>
                                <li><button onClick={() => setActiveTool("ip-checker")} className="block w-full text-left py-2 px-3 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">🌍 IP Checker</button></li>
                                <li><button onClick={() => setActiveTool("phone-lookup")} className="block w-full text-left py-2 px-3 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">📞 Phone Lookup</button></li>
                                <li><button onClick={() => setActiveTool("face")} className="block w-full text-left py-2 px-3 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">👽 Face Comparison</button></li>
                                <li><button onClick={() => setActiveTool("photo-metadata")} className="block w-full text-left py-2 px-3 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">📸 Photo Metadata</button></li>
                                <li><button onClick={() => setActiveTool("usb-history")} className="block w-full text-left py-2 px-3 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">💽 USB History</button></li>
                                <li><button onClick={() => setActiveTool("disk-image-analyzer")} className="block w-full text-left py-2 px-3 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">💾 Disk Imager</button></li>
                                <li><button onClick={() => setActiveTool("pcap-analyzer")} className="block w-full text-left py-2 px-3 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">📂 PCAP Analyzer</button></li>
                                </ul>
                        )}
                    </li>
                </ul>
            </nav>

            {/* Dark Mode Toggle - Made Static */}
            <div className="mt-auto">
                <button
                    onClick={toggleDarkMode}
                    className="px-3 w-full py-2 text-sm font-medium rounded-lg transition-all dark:text-white dark:bg-gray-700">
                    {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
                </button>
            </div>
        </header>

    
    );
}


function GetContactChecker() { return <div className="text-xl dark:text-white">🔍 Get Contact Checker Tool (Coming Soon...)</div>; }

export default App;