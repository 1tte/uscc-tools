import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GeneratePDF() {
    const [text, setText] = useState('');
    const [pdfUrl, setPdfUrl] = useState('');
    const [pdfList, setPdfList] = useState([]); // ✅ Default to an empty array
    const [loading, setLoading] = useState(false);

    const fetchPDFs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/list-pdfs');
            setPdfList(response.data.files || []); // ✅ Ensure it's always an array
        } catch (error) {
            console.error('Error fetching PDF list:', error);
            setPdfList([]); // ✅ Fallback to an empty array if there's an error
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
            {pdfUrl && (<a href={pdfUrl} target="_blank" without rel="noreferrer" className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-5 rounded-lg mt-4 shadow-md transition-all">Download PDF</a>)}

            {/* 📂 List PDFs */}
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

export default GeneratePDF;
