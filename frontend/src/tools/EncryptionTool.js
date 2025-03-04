import React, { useState } from "react";
import CryptoJS from "crypto-js";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const EncryptionTool = () => {
    const [text, setText] = useState("");
    const [key] = useState("mysecretkey");
    const [algorithm, setAlgorithm] = useState("AES");
    const [encryptedText, setEncryptedText] = useState("");
    const [decryptedText, setDecryptedText] = useState("");
    const [speedData, setSpeedData] = useState([]);

    const encryptText = () => {
        const startTime = performance.now();
        let encrypted = "";
        
        switch (algorithm) {
            case "AES":
                encrypted = CryptoJS.AES.encrypt(text, key).toString();
                break;
            case "MD5":
                encrypted = CryptoJS.MD5(text).toString();
                break;
            case "SHA1":
                encrypted = CryptoJS.SHA1(text).toString();
                break;
            case "SHA224":
                encrypted = CryptoJS.SHA224(text).toString();
                break;
            case "SHA256":
                encrypted = CryptoJS.SHA256(text).toString();
                break;
            case "SHA384":
                encrypted = CryptoJS.SHA384(text).toString();
                break;
            case "SHA512":
                encrypted = CryptoJS.SHA512(text).toString();
                break;
            default:
                encrypted = "Unsupported Algorithm";
        }
        
        const endTime = performance.now();
        setEncryptedText(encrypted);
        setSpeedData([...speedData, { time: speedData.length + 1, speed: endTime - startTime }]);
    };

    const decryptText = () => {
        if (algorithm === "AES") {
            const bytes = CryptoJS.AES.decrypt(encryptedText, key);
            setDecryptedText(bytes.toString(CryptoJS.enc.Utf8) || "Invalid decryption");
        } else {
            setDecryptedText("Decryption not supported for this algorithm");
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🔐 Encryption Tool</h2>
            <input 
                type="text" 
                value={text} 
                onChange={(e) => setText(e.target.value)} 
                placeholder="Enter text" 
                className="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:text-white" 
            />
            <select 
                value={algorithm} 
                onChange={(e) => setAlgorithm(e.target.value)} 
                className="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:text-white"
            >
                <option value="AES">AES</option>
                <option value="MD5">MD5</option>
                <option value="SHA1">SHA1</option>
                <option value="SHA224">SHA224</option>
                <option value="SHA256">SHA256</option>
                <option value="SHA384">SHA384</option>
                <option value="SHA512">SHA512</option>
            </select>
            <button onClick={encryptText} className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-2">Encrypt</button>
            <motion.div 
                className="mt-4 p-3 bg-gray-200 dark:bg-gray-700 rounded" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 1 }}
            >
                <p className="text-sm text-gray-700 dark:text-gray-300">Encrypted: {encryptedText}</p>
            </motion.div>
            <button 
                onClick={decryptText} 
                className="w-full mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >Decrypt</button>
            <motion.div 
                className="mt-4 p-3 bg-gray-200 dark:bg-gray-700 rounded" 
                initial={{ scale: 0.8 }} 
                animate={{ scale: 1 }} 
                transition={{ duration: 0.5 }}
            >
                <p className="text-sm text-gray-700 dark:text-gray-300">Decrypted: {decryptedText}</p>
            </motion.div>
            <h3 className="mt-6 text-lg font-bold text-gray-900 dark:text-white">Encryption Speed</h3>
            <LineChart width={400} height={200} data={speedData} className="mt-2">
                <XAxis dataKey="time" stroke="#8884d8" />
                <YAxis />
                <Tooltip />
                <CartesianGrid stroke="#ccc" />
                <Line type="monotone" dataKey="speed" stroke="#82ca9d" />
            </LineChart>
        </div>
    );
};

export default EncryptionTool;
