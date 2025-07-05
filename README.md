# 🚀 AI Resume Analyzer

A modern, AI-powered resume analysis tool with beautiful UI/UX that provides comprehensive feedback on resumes.

## ✨ Features

- **AI-Powered Analysis**: Intelligent resume parsing and analysis
- **Multiple Formats**: Support for PDF, DOC, DOCX, and TXT files
- **Comprehensive Feedback**: Detailed scoring, strengths, weaknesses, and suggestions
- **Modern UI**: Beautiful, responsive design with dark mode support
- **Mobile Optimized**: Works perfectly on all devices
- **Real-time Analysis**: Instant feedback with detailed reports
- **User Authentication**: Secure login and registration system

## 🎨 Logo & Branding

The application includes a custom logo with:
- **PNG Logo**: Your custom logo file (`/public/logo.png`)
- **SVG Logo**: High-quality vector logo (`/public/logo.svg`)
- **Component Logo**: React component with gradient styling
- **Favicon**: Custom favicon for browser tabs
- **Brand Colors**: Blue to purple gradient theme

### Logo Usage
```jsx
import Logo from './components/Logo';

// Use your PNG logo (default)
<Logo usePng={true} pngSrc="/logo.png" />

// Different sizes
<Logo size="small" usePng={true} pngSrc="/logo.png" />
<Logo size="large" usePng={true} pngSrc="/logo.png" />

// Without text
<Logo usePng={true} pngSrc="/logo.png" showText={false} />

// Fallback to SVG logo
<Logo useSvg={true} />
```

## 🚀 Quick Deployment

### Option 1: Render (Recommended - Free)
1. Push code to GitHub
2. Sign up at [render.com](https://render.com)
3. Create new Web Service
4. Set build command: `npm run install-all && npm run build`
5. Set start command: `npm start`
6. Add environment variables (see below)
7. Deploy!

### Option 2: Railway (Alternative - Free)
1. Sign up at [railway.app](https://railway.app)
2. Connect GitHub repository
3. Railway auto-detects and deploys
4. Add environment variables

### Option 3: Vercel + Railway (Best Performance)
1. Frontend on Vercel
2. Backend on Railway
3. Connect them via environment variables

## 🔧 Environment Variables

Create `.env` file in server directory:
```bash
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

## 📦 Installation

```bash
# Install all dependencies
npm run install-all

# Development
npm run dev

# Production build
npm run build

# Start production server
npm start
```

## 🏗️ Project Structure

```
resume-analyzer/
├── client/                 # React frontend
│   ├── public/            # Static files (logo, favicon)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   └── ...
├── server/                # Node.js backend
│   ├── index.js          # Main server file
│   └── ...
├── DEPLOYMENT.md         # Detailed deployment guide
├── QUICK_DEPLOY.md       # Quick deployment steps
└── README.md            # This file
```

## 🌐 Live Demo

Once deployed, your app will be accessible at:
- Render: `https://your-app-name.onrender.com`
- Railway: `https://your-app-name.railway.app`

## 🔒 Security Features

- JWT authentication
- Rate limiting
- CORS protection
- File upload validation
- Input sanitization
- Helmet security headers

## 📱 Mobile Optimization

- Responsive design
- Touch-friendly interface
- Progressive Web App features
- Optimized for all screen sizes

## 🎯 Performance

- Code splitting
- Lazy loading
- Image optimization
- Compression enabled
- Efficient file parsing

## 🛠️ Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Framer Motion
- Axios
- React Router

### Backend
- Node.js
- Express.js
- Multer (file uploads)
- PDF-parse
- Mammoth (DOCX parsing)

## 📊 Analytics & Monitoring

Add to `client/public/index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔄 Continuous Deployment

The project is ready for CI/CD with:
- GitHub Actions support
- Environment variable management
- Automatic builds
- Health checks

## 🆘 Support

- Check `DEPLOYMENT.md` for detailed deployment guide
- Review `QUICK_DEPLOY.md` for fast deployment
- Test locally before deploying
- Monitor logs for errors

## 📄 License

MIT License - feel free to use this project for your own applications!

## 🎉 Success!

Your Resume Analyzer is now ready for deployment and will be accessible to users worldwide!
