import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch the list of files when the app loads
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/files');
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) return alert("Please select a file first!");

    setUploading(true);
    const formData = new FormData();
    formData.append('document', selectedFile); // 'document' matches the multer expected field name

    try {
      await axios.post('http://localhost:5000/api/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("File successfully sent to AWS S3! 🚀");
      setSelectedFile(null);
      fetchFiles(); // Refresh the list
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container">
      <h1>☁️ The Cloud Locker</h1>
      <p>Your SaaS interface for secure AWS S3 Storage</p>

      {/* Upload Section */}
      <div className="upload-card">
        <form onSubmit={handleUpload}>
          <input type="file" onChange={handleFileChange} />
          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading to Cloud..." : "Upload File"}
          </button>
        </form>
      </div>

      {/* File List Section */}
      <div className="file-list">
        <h2>Your Cloud Files</h2>
        {files.length === 0 ? <p>No files in the vault yet.</p> : (
          <ul>
            {files.map((file) => (
              <li key={file._id}>
                <span>{file.originalName}</span>
                <a href={file.s3Url} target="_blank" rel="noopener noreferrer">
                  View in S3
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;