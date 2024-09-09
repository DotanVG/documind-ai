import React, { useState } from 'react';
import { BarChart, Search, Brain, Zap, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import { analyzeDocument } from '../services/apiService';

const conversationOpeners = [
  { text: "Summarize this document", icon: <BarChart size={20} /> },
  { text: "Extract key points", icon: <Search size={20} /> },
  { text: "Analyze sentiment", icon: <Brain size={20} /> },
  { text: "Find main topics", icon: <Zap size={20} /> }
];

const AnalysisInterface = () => {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        toast.error('Invalid file type. Please upload a PDF, DOC, DOCX, or TXT file.');
        event.target.value = null;
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      toast.error('Please upload a file first');
      return;
    }
    if (!query.trim()) {
      toast.error('Please enter a query');
      return;
    }
    setIsLoading(true);
    try {
      const result = await analyzeDocument(file, query);
      setResults(prevResults => [{
        result,
        query,
        fileName: file.name,
        timestamp: new Date().toLocaleString(),
      }, ...prevResults]);
      toast.success('Analysis completed successfully');
    } catch (error) {
      toast.error(error.message || 'An error occurred during analysis');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h2 className="text-3xl font-bold mb-8">Document Analysis</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {conversationOpeners.map((opener, index) => (
          <button
            key={index}
            onClick={() => setQuery(opener.text)}
            className="flex items-center justify-center bg-white bg-opacity-20 p-3 rounded-lg hover:bg-opacity-30 transition-all"
          >
            {opener.icon}
            <span className="ml-2 text-sm">{opener.text}</span>
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow px-3 py-2 bg-white bg-opacity-20 rounded text-white placeholder:text-white"
            placeholder="Ask a question about your document"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
          >
            <Upload className="mr-2" />
            <span>Upload Document</span>
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
          />
        </div>
        {file && <p className="mt-2">Selected file: {file.name}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 text-white px-4 py-2 rounded font-semibold hover:bg-purple-700 transition disabled:opacity-50"
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>
      {results.map((result, index) => (
        <div key={index} className="mt-8 bg-white bg-opacity-20 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-4">Analysis Result</h3>
          <p className="text-sm text-gray-300 mb-2">
            User queried '{result.query}' from file '{result.fileName}' at {result.timestamp}
          </p>
          <p>{result.result}</p>
        </div>
      ))}
    </div>
  );
};

export default AnalysisInterface;