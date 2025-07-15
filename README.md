# AI Resume Analyzer

A fullstack web application for analyzing resumes using AI-powered logic. Users can upload their resume (PDF), receive instant feedback, and get actionable suggestions to improve their job prospects.

## Features
- Upload PDF resumes for instant analysis
- AI-powered feedback on strengths, weaknesses, and missing elements
- Section-wise scoring (Contact, Summary, Experience, Education, Skills, Projects)
- Industry fit and experience level detection
- Secure authentication and user management
- Modern, responsive UI (React + Tailwind CSS)

## Tech Stack
- **Frontend:** React, Tailwind CSS, Vite
- **Backend:** Node.js, Express, Multer, pdf-parse
- **Deployment:** Vercel (frontend), Render (backend)

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Backend Setup
1. `cd Resume-Analyzer-Tool/server`
2. `npm install`
3. Create a `.env` file based on `env.example` and set your environment variables (MongoDB URI, JWT secret, etc.)
4. `npm start` (or `npm run dev` for development)

### Frontend Setup
1. `cd Resume-Analyzer-Tool/client`
2. `npm install`
3. Create a `.env` file if you want to set `VITE_API_URL` for local API testing
4. `npm run dev` (for local development)

### Deployment
- **Frontend:** Deploy the `client` folder to Vercel. Set the `VITE_API_URL` environment variable to your backend API URL.
- **Backend:** Deploy the `server` folder to Render. Set the `FRONTEND_URL` environment variable to your Vercel frontend URL (no trailing slash).

## API Endpoints
- `POST /api/analyze-resume` — Upload a PDF resume for analysis
- `GET /api/health` — Health check endpoint

## File Structure
```
Resume-Analyzer-Tool/
  ├── client/      # React frontend
  └── server/      # Express backend
```

## License
MIT
