import React from 'react';
import { Brain, Search, BarChart, Shield, Zap, Upload } from 'lucide-react';

const features = [
  { icon: <Brain size={40} />, title: "AI-Powered Analysis" },
  { icon: <Search size={40} />, title: "Intelligent Search" },
  { icon: <BarChart size={40} />, title: "Insightful Reports" },
  { icon: <Shield size={40} />, title: "Secure & Private" },
  { icon: <Zap size={40} />, title: "Lightning Fast" },
  { icon: <Upload size={40} />, title: "Easy File Upload" },
];

const LandingPage = ({ onGetStarted }) => (
  <div className="container mx-auto px-4 py-8 md:py-16 text-white">
    <div className="text-center mb-8 md:mb-16">
      <h2 className="text-4xl md:text-5xl font-bold mb-4">Unlock the Power of Your Documents</h2>
      <p className="text-xl mb-8">AI-powered document analysis for unparalleled insights</p>
      <button onClick={onGetStarted} className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-opacity-90 transition">Get Started</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <div key={index} className="bg-white bg-opacity-20 p-6 rounded-lg text-center">
          <div className="inline-block p-3 bg-white bg-opacity-20 rounded-full mb-4">
            {feature.icon}
          </div>
          <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
          <p>Enhance your document workflow with cutting-edge AI technology.</p>
        </div>
      ))}
    </div>
  </div>
);

export default LandingPage;