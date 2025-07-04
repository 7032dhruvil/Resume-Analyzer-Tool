# Resume Analyzer

AI-powered Resume Analyzer with Modern UI/UX

---

## 🚀 Overview
Resume Analyzer is a full-stack web application that leverages AI to analyze resumes, providing comprehensive feedback, scoring, and actionable suggestions. Built with a modern React frontend and a robust Node.js/Express backend, it offers a seamless and intuitive user experience.

**Purpose:** Help job seekers optimize their resumes for better job opportunities using instant, AI-driven feedback.

**Audience:** Job seekers, students, professionals, and career coaches.

---

## ✨ Features
- **AI-Powered Analysis:** Get instant, intelligent feedback on your resume.
- **PDF Upload:** Securely upload and analyze PDF resumes.
- **Detailed Scoring:** Receive scores and suggestions for improvement.
- **User Authentication:** Secure login and account management.
- **Modern UI/UX:** Responsive, accessible, and visually appealing design.
- **Downloadable Reports:** Export analysis results for offline use.
- **Dark Mode:** Switch between light and dark themes.
- **Contact & Office Map:** Easily reach us or visit our Ahmedabad, Gujarat, India office (see Contact section).
- **Mobile Friendly:** Works great on all devices.
- **No resume data stored:** Your privacy is respected.

---

## 🛠️ Tech Stack
- **Frontend:** React (18+), Tailwind CSS (3+), Axios, Recharts, Framer Motion
- **Backend:** Node.js (16+), Express, Multer, PDF-Parse, Mammoth
- **Security:** Helmet, Express-Rate-Limit, CORS
- **Other:** dotenv, Compression

---

## 📁 Folder Structure
```
resume-analyzer/
├── client/           # React frontend
│   ├── public/
│   │   └── ...
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── services/     # API service layer
│   │   ├── index.js      # App entry point
│   │   └── index.css     # Tailwind & global styles
│   │   └── ...
│   ├── package.json
│   └── ...
├── server/           # Node.js backend
│   ├── index.js      # Express server entry
│   ├── env.example   # Example environment variables
│   ├── package.json
│   └── ...
├── package.json      # Root scripts (dev, build, install-all)
└── README.md         # Project documentation
```

---

## ⚡ Quick Start

### 1. Clone the repository
```sh
git clone https://github.com/your-username/resume-analyzer.git
cd resume-analyzer
```

### 2. Install dependencies
```sh
npm run install-all
```

### 3. Set up environment variables
- Copy `server/env.example` to `server/.env` and fill in required values.

### 4. Start the development servers
```sh
npm run dev
```
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5002](http://localhost:5002)

---

## 📝 Usage
- Visit the frontend URL and upload your resume (PDF).
- View instant analysis, scores, and suggestions.
- Download or share your results.
- Contact us or visit our Ahmedabad office for more info.

---

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request
- For issues, suggestions, or questions, open an issue on GitHub.

---

## 📄 License
This project is licensed under the MIT License.

---

## 🙋‍♂️ Contact
For questions or support, please contact:
- Phone: 8690295298
- Email: xyzdeveloper10@gmail.com
- Address: Ahmedabad, Gujarat, India

---

## ℹ️ Known Limitations & Future Plans
- Current AI analysis is mock/demo (no external API key required)
- Future: Integrate with real AI/ML models for deeper analysis
- Future: Add more file format support and multi-language support
- Future: User dashboard and analytics
