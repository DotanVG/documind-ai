import React from 'react';
import { FaGithub } from 'react-icons/fa';

const Navbar = ({ onHome }) => (
  <nav className="text-white py-6">
    <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-4">
      <div className="text-center sm:text-left mb-4 sm:mb-0">
        <h1 
          className="text-3xl font-bold cursor-pointer hover:text-gray-300 transition"
          onClick={onHome}
        >
          DocuMind AI
        </h1>
        <p className="text-lg mt-2">Intelligent Document Analysis by Dotan Veretzky</p>
      </div>
      <a 
        href="https://github.com/DotanVG/documind-ai" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-white hover:text-gray-300"
      >
        <FaGithub size={44} />
      </a>
    </div>
  </nav>
);

export default Navbar;