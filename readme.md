![PDF Chat RAG API Banner](public/banner.png)
# 📚 PDF Chat RAG API

A Node.js API that enables intelligent conversations with PDF documents using Retrieval-Augmented Generation (RAG) powered by Google's Gemini AI and LangChain. Built with LangChain's powerful RAG framework for efficient document processing and contextual retrieval.

## 🌟 Features

- 📤 PDF Upload: Secure file upload with size and type validation
- 💾 Vector Storage: Document embeddings stored in Qdrant vector database
- 🤖 Smart Retrieval: Contextual search using similarity matching
- 💬 AI Chat: Natural conversations with PDF content using Gemini AI

## 🚀 Getting Started

### Prerequisites

- Node.js
- Docker (for Qdrant)
- Google Gemini API Key

### Environment Setup

Create a `.env` file with:

```env
GEMINI_API_KEY=your_api_key_here
QDRANT_URL=http://localhost:6333
PORT=3000
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Qdrant:
   ```bash
   docker-compose -f docker-compose.db.yml up -d
   ```
4. Run the server:
   ```bash
   npm run dev
   ```

## 🔄 API Endpoints

### Upload PDF
```http
POST /upload-pdf
Content-Type: multipart/form-data

form-data:
- pdf: <file>
```

### Chat with PDF
```http
POST /chat
Content-Type: application/json

{
  "pdfName": "example.pdf",
  "query": "What is this document about?"
}
```

## 🛠️ Tech Stack

- Express.js - Web framework
- LangChain - RAG implementation
- Google Gemini AI - Embeddings and chat completion
- Qdrant - Vector database
- Multer - File upload handling

## 🔒 Security

- File size limit: 5MB
- PDF-only file validation
- Error handling and validation
