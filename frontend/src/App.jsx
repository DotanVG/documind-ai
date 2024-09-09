// frontend\src\App.jsx

import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import AnalysisInterface from './components/AnalysisInterface';
import { useBackendStatus } from './hooks/useBackendStatus';

export default function App() {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const { backendStatus, wakeUpBackend } = useBackendStatus();

  useEffect(() => {
    if (backendStatus === 'unknown') {
      wakeUpBackend();
    }
  }, [backendStatus, wakeUpBackend]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <Navbar onHome={() => setShowAnalysis(false)} />
      <div className="flex-grow">
        {showAnalysis ? (
          <AnalysisInterface />
        ) : (
          <LandingPage onGetStarted={() => setShowAnalysis(true)} />
        )}
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}