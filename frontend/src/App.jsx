import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Search, Brain, BarChart, Shield, Zap, Upload } from 'lucide-react';
import Navbar from './components/Navbar.jsx';  

const API_URL = 'http://localhost:3000/api';

function LandingPage({ onGetStarted }) {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16 text-white">
      <div className="text-center mb-8 md:mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Unlock the Power of Your Documents</h2>
        <p className="text-xl mb-8">AI-powered document analysis for unparalleled insights</p>
        <button onClick={onGetStarted} className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-opacity-90 transition">Get Started</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { icon: <Brain size={40} />, title: "AI-Powered Analysis" },
          { icon: <Search size={40} />, title: "Intelligent Search" },
          { icon: <BarChart size={40} />, title: "Insightful Reports" },
          { icon: <Shield size={40} />, title: "Secure & Private" },
          { icon: <Zap size={40} />, title: "Lightning Fast" },
          { icon: <Upload size={40} />, title: "Easy File Upload" },
        ].map((feature, index) => (
          <div key={index} className="bg-white bg-opacity-20 p-6 rounded-lg text-center">
            <div className="inline-block p-3 bg-white bg-opacity-20 rounded-full mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalysisInterface() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const conversationOpeners = [
    { text: "Summarize this document", icon: <BarChart size={20} /> },
    { text: "Extract key points", icon: <Search size={20} /> },
    { text: "Analyze sentiment", icon: <Brain size={20} /> },
    { text: "Find main topics", icon: <Zap size={20} /> }
  ];

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        toast.error('Invalid file type. Please upload a PDF, DOC, DOCX, or TXT file.');
        event.target.value = null; // Reset the file input
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
    const formData = new FormData();
    formData.append('file', file);
    formData.append('query', query);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An error occurred during analysis');
      }
      const data = await response.json();
      const newResult = {
        result: data.result,
        query: query,
        fileName: file.name,
        timestamp: new Date().toLocaleString(),
      };
      setResults(prevResults => [newResult, ...prevResults]);
        toast.success('Analysis completed successfully');
    } catch (error) {
      console.error('Analysis error:', error);
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
            id="query"
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
}

export default function App() {
  const [showAnalysis, setShowAnalysis] = useState(false); 

  const wakeUpBackend = async () => {
    toast.info('Waking up the backend server...');
    try {
      const response = await fetch(`${API_URL}/wakeUp`);
      if (response.ok) {
        toast.success('Backend server is ready!');
      } else {
        toast.error('Failed to wake up the backend server');
      }
    } catch (error) {
      console.error('Wake-up error:', error);
      toast.error('Failed to connect to the backend server');
    }
  };

  useEffect(() => {
    wakeUpBackend();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <Navbar onHome={() => setShowAnalysis(false)} />
      <div className="flex-grow">
        {showAnalysis ? <AnalysisInterface /> : <LandingPage onGetStarted={() => setShowAnalysis(true)} />}
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}