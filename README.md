# 🧠 DocuMind AI

[![Netlify Status](https://api.netlify.com/api/v1/badges/22cf3d45-e4d4-4a1d-aa7e-0a185dd74d5a/deploy-status)](https://app.netlify.com/sites/documind-ai-dotanv/deploys)

## 🌟 Overview

DocuMind AI is an intelligent document analysis platform that combines advanced file upload capabilities with AI-powered analysis. This project showcases the integration of modern web technologies, AI models, and scalable architecture design.

This project was developed as part of a follow-up on an interview home assignment, with a working scope of 2-3 work days.

🔗 [Live Demo (Frontend)](https://documind-ai-dotanv.netlify.app/)
🔗 [API Endpoint](https://documind-ai.onrender.com)

## 🌿 Branches

- `main`: Set up for local development
- `prepare-online-deployments`: Latest branch used for Netlify and Render deployments

## ✨ Key Features

- 📄 **File Upload**: Support for PDF, DOCX, and TXT file formats with basic validation
- 🤖 **AI-Powered Analysis**: Utilizes OpenAI's GPT models for content analysis
- 📊 **Document Chunking**: Splits large documents into manageable chunks for analysis
- 🎨 **Intuitive UI**: Clean, responsive interface built with React and Tailwind CSS
- 📊 **Visual Feedback**: Displays query details, file names, and timestamps for each analysis result

## 🛠️ Tech Stack

- **Frontend**: React (with Vite), Tailwind CSS
- **Backend**: Node.js (v20), Express
- **AI Integration**: OpenAI API
- **Deployment**: 
  - Frontend: [Netlify](https://documind-ai-dotanv.netlify.app/)
  - Backend: [Render](https://documind-ai.onrender.com)

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or later)
- npm

### Local Development

1. Clone the repository:
   ```
   git clone https://github.com/DotanVG/documind-ai.git
   cd documind-ai
   ```

2. Install dependencies:
   ```
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the backend directory with:
   ```
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development servers:
   ```
   # Backend
   npm run dev

   # Frontend (in a new terminal)
   cd ../frontend
   npm run dev
   ```

5. Open `http://localhost:5173` in your browser

## 🌟 Implemented Features

### Backend Services

- **AI Service**: Handles document analysis using OpenAI's GPT models
- **File Upload Service**: Handles file uploads with input validation
- **Document Processing**: Implements document chunking and summarization for large texts

### Middleware

- **Error Handling**: Centralized error handling for better error reporting
- **File Upload**: Custom middleware for file type and size validation
- **CORS**: Configured for cross-origin requests

### Frontend Components

- **File Upload**: Drag-and-drop interface with progress indicator
- **Query Input**: Dynamic suggestions for common queries
- **Results Display**: Formatted display of AI analysis with metadata

## 🔮 Future Improvements

1. **User Authentication**: Implement secure user accounts and session management
2. **Multiple AI Model Support**: Integrate additional AI providers (e.g., Anthropic)
3. **Database Integration**: Implement PostgreSQL for data persistence
4. **Advanced Caching**: Implement Redis for improved performance and memory usage
5. **Multi-file Upload**: Implement batch analysis for multiple documents
6. **Advanced Analytics**: Provide insights on document trends and user queries
7. **API Rate Limiting**: Implement rate limiting to prevent abuse and ensure fair usage
8. **Comprehensive Testing**: Implement unit and integration tests for improved reliability
9. **RAG Model Implementation**: Develop a true Retrieval-Augmented Generation system for more efficient and context-aware document analysis
10. **Vector Database Integration**: Implement a vector database for efficient storage and retrieval of document embeddings
11. **Query Optimization**: Enhance the query processing to better leverage document structure and context
12. **Enhance Security**: Implement additional security measures to ensure data privacy and compliance and prevent cross-site scripting (XSS) attacks, etc.


## 🙋‍♂️ About the Developer

Hi! I'm Dotan Veretzky, a passionate full-stack developer with a keen interest in AI and scalable web applications. This project showcases my skills in modern web development, AI integration, and thoughtful architecture design. I'm always open to new opportunities and collaborations. Feel free to reach out!

- 📧 Email: dotanvg@gmail.com
- 💼 LinkedIn: [in/dotan-v](https://www.linkedin.com/in/dotan-v/)
- 🐱 GitHub: [DotanVG](https://github.com/DotanVG)