# Resume Analyzer

A modern web application for analyzing and scoring resumes for job fit using advanced parsing and keyword matching. Users can upload their resumes and receive actionable feedback and visual insights to optimize their resumes.

## Technologies Used

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Parsing:** PDF-parse, Mammoth (DOCX)
- **Other:** Multer (file uploads), Axios

## Project Structure

```
resume-analyzer/
├── client/                 # React frontend
│   ├── public/            # Static files (logo, favicon, team images)
│   ├── src/
│   │   ├── components/    # React components (UI, upload, results, etc.)
│   │   ├── data/          # Static data (e.g., team info)
│   │   ├── services/      # API service functions
│   │   ├── index.js       # App entry point
│   │   └── index.css      # Global styles
│   └── package.json       # Frontend dependencies
├── server/                # Node.js backend
│   ├── index.js           # Main server file
│   ├── resumeParser.js    # Resume parsing logic
│   ├── env.example        # Example environment variables
│   └── package.json       # Backend dependencies
├── .gitignore             # Git ignore rules
├── README.md              # Project documentation
└── ...                    # Other supporting files
```

## Key Features

- Upload resumes in PDF, DOCX, or TXT format
- Automated parsing and keyword analysis
- Scoring and feedback for job fit
- Clean, responsive UI
- Team and contact information

## How to Use

1. Clone the repository
2. Install dependencies for both client and server
3. Start the backend and frontend servers
4. Upload your resume and view analysis results

## Useful Details

- All sensitive files (e.g., .env, PDF resumes) are gitignored
- Modular codebase for easy extension
- Team images and assets are in `client/public/team/`
- Example environment variables in `server/env.example`

---

© 2024 Resume Analyzer. All rights reserved.
