require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require("child_process");
const PDFDocument = require('pdfkit');
const { OpenAI } = require('openai');

const app = express();
const PORT = process.env.PORT || 5000;
const pdfDirectory = path.join(__dirname, 'pdfs');

app.use(express.json());
app.use(cors());

// Ensure the PDFs directory exists
if (!fs.existsSync(pdfDirectory)) fs.mkdirSync(pdfDirectory);

// Check if the OpenAI API key is set
if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OpenAI API key is missing.');
    process.exit(1); // Exit if no API key is found
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Function to format text using OpenAI
 */
/**
 * Function to format text using OpenAI
 */
async function formatTextWithOpenAI(text) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { 
                    role: "system", 
                    content: `Format the given text into JavaScript code for PDFKit with the following rules:
                    - Use "doc.font('Helvetica-Bold').fontSize(18)" for the main title.
                    - Use "doc.font('Helvetica-Bold').fontSize(14)" for section headers.
                    - Use "doc.font('Helvetica').fontSize(12)" for body text.
                    - Align the main title to the center.
                    - Align section headers to the left with some spacing.
                    - Use "doc.font('Helvetica-Oblique')" for quotes or legal text.
                    - Use bullet points (•) for lists.
                    - Ensure proper line spacing using "doc.moveDown()".
                    - Return only JavaScript code starting with "doc." and no other explanations.` 
                },
                { role: "user", content: text }
            ],
            temperature: 0.5
        });

        let formattedCode = response.choices[0].message.content || "";

        // Hapus tanda markdown ```javascript atau ```
        formattedCode = formattedCode.replace(/```javascript|```/g, "").trim();

        // Hapus semua baris yang berisi deklarasi ulang 'doc'
        formattedCode = formattedCode.split("\n").filter(line => 
            !line.includes("require") && 
            !line.includes("new PDFDocument") && 
            line.startsWith("doc.")
        ).join("\n");

        if (!formattedCode.startsWith("doc.")) {
            throw new Error("Response dari OpenAI bukan kode PDFKit yang valid.");
        }

        return formattedCode;
    } catch (error) {
        console.error("❌ Error saat mengambil kode dari OpenAI:", error);
        return null;
    }
}



/**
 * Endpoint to generate PDF from text
 */
app.post('/generate-pdf', async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    // Format the text using OpenAI to get valid PDFKit commands
    const formattedText = await formatTextWithOpenAI(text);
    if (!formattedText) return res.status(500).json({ error: 'AI Formatting Failed' });

    // Provide default values for x and y in case they are missing
    const sanitizedFormattedText = formattedText.replace(/doc.text\('([^']+)',\s*x\s*,\s*y\s*\)/g, (match, content) => {
        // Provide default values for x and y (e.g., 100 and 100)
        return `doc.text('${content}', 100, 100)`;
    });

    const filename = `output_${Date.now()}.pdf`;
    const filePath = path.join(pdfDirectory, filename);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    try {
        // Execute the sanitized formatted content to generate the PDF
        try {
            new Function("doc", sanitizedFormattedText)(doc);  // Safely execute sanitized content
        } catch (err) {
            console.error("PDF Generation Execution Error:", err);
            return res.status(500).json({ error: 'PDF Execution Error', details: err.message });
        }

        doc.end();
        stream.on('finish', () => res.json({ url: `http://localhost:${PORT}/pdfs/${filename}` }));
        stream.on('error', (err) => {
            console.error("PDF Save Error:", err);
            res.status(500).json({ error: 'PDF Save Error', details: err.message });
        });
    } catch (error) {
        console.error("PDF Generation Error:", error);
        return res.status(500).json({ error: 'PDF Generation Error', details: error.message });
    }
});

/**
 * Endpoint to list generated PDFs
 */
app.get('/list-pdfs', (req, res) => {
    fs.readdir(pdfDirectory, (err, files) => {
        if (err) {
            console.error("Directory Scan Error:", err);
            return res.status(500).json({ error: 'Directory Scan Error' });
        }
        res.json({ files });
    });
});

// Serve static PDFs
app.use('/pdfs', express.static(pdfDirectory));


/**
 * Endpoint to fetch USB device history
 */
app.get("/usb-history", (req, res) => {
    const platform = process.platform;
    let command;

    if (platform === "win32") {
        command = `powershell -Command "Get-ChildItem -Path 'HKLM:\\SYSTEM\\CurrentControlSet\\Enum\\USBSTOR\\' | ForEach-Object { $_.PSChildName }"`;
    } else if (platform === "linux") {
        command = `grep -i "usb" /var/log/syslog | tail -n 10`;
    } else if (platform === "darwin") {
        command = `system_profiler SPUSBDataType`;
    } else {
        return res.status(500).json({ error: "Unsupported OS" });
    }

    exec(command, (error, stdout, stderr) => {
        if (error) return res.status(500).json({ error: "USB History Fetch Error", details: stderr });
        res.json({ history: stdout.split("\n").filter(line => line.trim() !== "") });
    });
});


/**
 * Endpoint to analyze PCAP file (Placeholder for future)
 */
app.post('/analyze-pcap', (req, res) => {
    res.json({ message: "PCAP analysis will be implemented soon!" });
});

/**
 * Endpoint to fetch running processes
 */
app.get("/processes", async (req, res) => {
    const platform = process.platform;
    let command;

    if (platform === "win32") {
        command = `powershell -Command "Get-Process | Select-Object Handles, StartTime, PM, VM, SessionId, Id, ProcessName, Path | ConvertTo-Json -Depth 1"`;
    } else {
        command = `ps aux --no-headers | awk '{print $2, $4, $5, $6, $7, $8, $11}'`;
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: "Process Fetch Error", details: stderr });
        }

        try {
            let processList;
            if (platform === "win32") {
                processList = JSON.parse(stdout).map(proc => ({
                    handles: proc.Handles,
                    startTime: proc.StartTime,
                    pm: proc.PM,
                    vm: proc.VM,
                    sessionId: proc.SessionId,
                    id: proc.Id,
                    processName: proc.ProcessName,
                    path: proc.Path || "N/A"
                }));
            } else {
                processList = stdout.split("\n").map(line => {
                    const parts = line.trim().split(/\s+/);
                    return {
                        id: parts[0],
                        pm: parts[1],
                        vm: parts[2],
                        si: parts[3],
                        handles: parts[4],
                        startTime: parts[5],
                        processName: parts.slice(6).join(" "),
                        path: parts.slice(6).join(" ") || "N/A"
                    };
                }).filter(proc => proc.id);
            }

            res.json({ processes: processList });
        } catch (parseError) {
            res.status(500).json({ error: "Parsing Error", details: parseError.message });
        }
    });
});


/**
 * Start the server
 */
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
