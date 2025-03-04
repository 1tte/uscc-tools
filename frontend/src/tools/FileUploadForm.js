import React, { useState } from "react";

const FileUploadForm = () => {
  const [url, setUrl] = useState("");
  const [script, setScript] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  // Handle URL input
  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  // Handle script input (for custom scripts)
  const handleScriptChange = (e) => {
    setScript(e.target.value);
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setFiles([...selectedFiles]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url && !script && files.length === 0) {
      setError("Please provide a URL, a script, or a file to upload.");
      return;
    }

    const formData = new FormData();

    // Append URL and script to formData
    if (url) {
      formData.append("url", url);
    }

    if (script) {
      formData.append("script", script);
    }

    // Append files to formData
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Upload successful!");
      } else {
        alert("Upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed due to an error.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 border rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Upload URL, Script, and Files</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="url" className="block font-semibold mb-2">Website URL</label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={handleUrlChange}
            className="border p-2 w-full"
            placeholder="Enter website URL"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="script" className="block font-semibold mb-2">Script (Paste here)</label>
          <textarea
            id="script"
            value={script}
            onChange={handleScriptChange}
            rows="6"
            className="border p-2 w-full"
            placeholder="Paste your script here (e.g., PHP, shell script)"
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="files" className="block font-semibold mb-2">File Uploads (Multiple files)</label>
          <input
            type="file"
            id="files"
            onChange={handleFileChange}
            multiple
            className="border p-2 w-full"
          />
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default FileUploadForm;
