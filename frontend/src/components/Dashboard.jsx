import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Search, Brain, BarChart, Shield, Zap, Upload } from 'lucide-react';

function Dashboard() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('query', query);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data.result);
      toast.success('File uploaded and analyzed successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'An error occurred during upload and analysis');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-8">DocuMind AI Dashboard</h1>
      <div className="bg-white bg-opacity-20 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Upload and Analyze</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="file-upload" className="block mb-2">Upload Document</label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              className="w-full px-3 py-2 bg-white bg-opacity-20 rounded"
            />
          </div>
          <div>
            <label htmlFor="query" className="block mb-2">Enter Your Query</label>
            <input
              id="query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-3 py-2 bg-white bg-opacity-20 rounded"
              placeholder="Ask a question about your document"
            />
          </div>
          <button type="submit" className="w-full bg-purple-600 text-white px-4 py-2 rounded font-semibold hover:bg-purple-700 transition">
            Analyze
          </button>
        </form>
      </div>
      {result && (
        <div className="bg-white bg-opacity-20 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Analysis Result</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;