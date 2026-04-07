import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = "http://13.62.50.44:5000";  // your EC2 backend

function App() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${API}/api/files`);
      console.log("FILES:", response.data);
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

    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('document', selectedFile);

    try {
      const response = await axios.post(
        `${API}/api/files/upload`,
        formData
      );

      console.log("UPLOAD SUCCESS:", response.data);

      alert("File uploaded successfully 🚀");

      setSelectedFile(null);
      fetchFiles();

    } catch (error) {
      console.error("UPLOAD ERROR FULL:", error);

      if (error.response) {
        console.error("Server response:", error.response.data);
      }

      alert("Failed to upload file. Check console.");
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
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </form>
      </div>

      {/* File List Section */}
      <div className="file-list">
        <h2>Your Cloud Files</h2>

        {files.length === 0 ? (
          <p>No files in the vault yet.</p>
        ) : (
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
