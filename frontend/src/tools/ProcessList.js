import { useEffect, useState } from "react";
import { Loader, AlertCircle, Search, ChevronUp, ChevronDown } from "lucide-react";

export default function ProcessesList() {
    const [processes, setProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    useEffect(() => {
        fetch("http://localhost:5000/processes")
            .then(response => response.json())
            .then(data => {
                setProcesses(data.processes || []);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to fetch processes.");
                setLoading(false);
            });
    }, []);

    const sortedProcesses = [...processes].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aValue = a[sortConfig.key] || "";
        const bValue = b[sortConfig.key] || "";
        return sortConfig.direction === "asc"
            ? aValue.toString().localeCompare(bValue.toString())
            : bValue.toString().localeCompare(aValue.toString());
    });

    const filteredProcesses = sortedProcesses.filter(proc =>
        proc.processName.toLowerCase().includes(search.toLowerCase())
    );

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
        }));
    };

    return (
        <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Process List</h2>

            {loading && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Loader className="animate-spin mr-2 mb-2" size={20} /> Loading processes...
                </div>
            )}
            {error && (
                <div className="text-red-500 flex items-center">
                    <AlertCircle className="mr-2" size={20} /> {error}
                </div>
            )}

            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Search process name..."
                    className="w-full p-2 pl-10 border rounded-lg bg-white dark:bg-gray-800 dark:text-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400" size={18} />
            </div>

            {!loading && !error && filteredProcesses.length === 0 && (
                <p className="text-gray-600 dark:text-gray-400">No matching processes found.</p>
            )}

            {!loading && !error && filteredProcesses.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white">
                                {["id", "handles", "startTime", "sessionId", "processName", "path"].map((key) => (
                                    <th
                                        key={key}
                                        className="py-3 px-4 border cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
                                        onClick={() => handleSort(key)}
                                    >
                                        {key.toUpperCase()} {sortConfig.key === key && (sortConfig.direction === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProcesses.map((proc, index) => (
                                <tr key={index} className="border-t hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <td className="py-3 px-4 border text-white">{proc.id}</td>
                                    <td className="py-3 px-4 border text-white">{proc.handles}</td>
                                    <td className="py-3 px-4 border text-white">{proc.startTime || "N/A"}</td>
                                    <td className="py-3 px-4 border text-white">{proc.sessionId || "N/A"}</td>
                                    <td className="py-3 px-4 border text-white">{proc.processName}</td>
                                    <td className="py-2 px-4 border truncate max-w-xs text-white" title={proc.path}>
                                    {proc.path}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
