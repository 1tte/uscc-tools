import { useState, useEffect } from 'react';

function WelcomePage() {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [text, setText] = useState('');
    const [typing, setTyping] = useState(true);
    const [inputText, setInputText] = useState('');
    const [commandHistory, setCommandHistory] = useState([]);
    const [consoleOutput, setConsoleOutput] = useState([]);

    const typewriterText = "Welcome to My GitHub Repositories"; // Text for the typewriter effect

    useEffect(() => {
        // Typewriter effect logic
        if (typing) {
            let i = 0;
            const interval = setInterval(() => {
                if (i < typewriterText.length) {
                    setText((prev) => prev + typewriterText.charAt(i));
                    i++;
                } else {
                    clearInterval(interval);
                    setTyping(false);
                }
            }, 150); // typing speed
            return () => clearInterval(interval); // Clean up interval on component unmount
        }
    }, [typing]);

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const response = await fetch('https://api.github.com/users/1tte/repos');
                const data = await response.json();
                setRepos(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching GitHub repos:', error);
                setLoading(false);
            }
        };

        fetchRepos();
    }, []);

    // Handle terminal input
    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleCommandSubmit = (e) => {
        e.preventDefault();
        setCommandHistory([...commandHistory, inputText]);

        if (inputText === 'help') {
            setConsoleOutput([ 
                ...consoleOutput,
                'Available commands: help, clear, repos, git clone <repo_name>',
            ]);
        } else if (inputText === 'clear') {
            setConsoleOutput([]);
        } else if (inputText === 'repos') {
            setConsoleOutput([
                ...consoleOutput,
                'Fetching repositories...',
                `Repositories available: ${repos.map((repo) => repo.name).join(', ')}`,
            ]);
        } else {
            setConsoleOutput([
                ...consoleOutput,
                `Unknown command: ${inputText}`,
            ]);
        }

        setInputText('');
    };

    return (
        <div className="min-h-screen bg-black text-green-400 font-mono">
            {/* Top Bar */}
            <div className="flex justify-between p-6 bg-black border-b-2 border-green-500 shadow-2xl">
                <h1 className="text-3xl font-bold text-green-300 animate-pulse">{text}</h1>
            </div>

            {/* Main Content */}
            <div className="p-8">
                <h2 className="text-2xl font-semibold text-green-300 mb-6">Here are my latest repositories:</h2>
                {loading ? (
                    <div className="text-center text-lg text-gray-400">Loading repositories...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {repos.map((repo) => (
                            <div
                                key={repo.id}
                                className="bg-gray-800 rounded-lg shadow-lg p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                            >
                                <h3 className="text-xl font-semibold text-green-500 mb-2">{repo.name}</h3>
                                <p className="text-sm text-gray-400 mb-4">{repo.description || 'No description available'}</p>
                                <a
                                    href={repo.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-400 hover:text-green-300 text-sm border-b-2 border-green-400 hover:border-green-300"
                                >
                                    View Repository
                                </a>
                            </div>
                        ))}
                    </div>
                )}

                {/* Terminal Simulation */}
                <div className="mt-8">
                    <div className="bg-gray-800 rounded-lg p-4 text-sm">
                        <div className="text-gray-400 mb-2">User@hackerdash:~$</div>
                        {consoleOutput.map((line, index) => (
                            <div key={index} className="text-green-400">{line}</div>
                        ))}
                        <form onSubmit={handleCommandSubmit}>
                            <input
                                type="text"
                                value={inputText}
                                onChange={handleInputChange}
                                className="bg-black border-none text-green-400 w-full mt-4 p-2 outline-none"
                                placeholder="Type a command..."
                            />
                        </form>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-black p-4 text-center text-gray-400">
                <p>Powered by GitHub API</p>
            </div>
        </div>
    );
}

export default WelcomePage;
