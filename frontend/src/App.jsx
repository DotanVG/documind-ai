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
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      toast.error('Please upload a file first');
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
      const data = await response.json();
      if (response.ok) {
        setResult(data.result);
      } else {
        toast.error(data.error || 'An error occurred during analysis');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('An error occurred during analysis');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h2 className="text-3xl font-bold mb-8">Document Analysis</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="query" className="block mb-2">Enter Your Question</label>
          <input
            id="query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2 bg-white bg-opacity-20 rounded text-white placeholder:text-white"
            placeholder="Ask a question about your document"
          />
        </div>
        <div>
          <label htmlFor="file-upload" className="cursor-pointer bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
            <Upload className="mr-2" />
            <span>Upload Document</span>
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileUpload}
            className="hidden"
          />
          {file && <p className="mt-2">Selected file: {file.name}</p>}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 text-white px-4 py-2 rounded font-semibold hover:bg-purple-700 transition disabled:opacity-50"
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>
      {result && (
        <div className="mt-8 bg-white bg-opacity-20 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-4">Analysis Result</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [showAnalysis, setShowAnalysis] = useState(false);

  const wakeUpBackend = async () => {
    toast.info('Waking up the backend server...');
    try {
      const response = await fetch(`${API_URL}/wake-up`);
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
      <Navbar />
      <div className="flex-grow">
        {showAnalysis ? <AnalysisInterface /> : <LandingPage onGetStarted={() => setShowAnalysis(true)} />}
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}