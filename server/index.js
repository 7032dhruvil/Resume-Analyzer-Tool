const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5002;

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '10mb' }));

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist'), {
    maxAge: '1y',
    etag: false
  }));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Request logging middleware
app.use((req, res, next) => {
  next();
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept multiple file types
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed'), false);
    }
  }
});

// In-memory user store (for demo)
const users = [];
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resume_analyzer', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  provider: { type: String, default: 'local' },
  providerId: { type: String },
});
const User = mongoose.model('User', userSchema);

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, name, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user endpoint
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      provider: user.provider,
      providerId: user.providerId
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// File parsing functions
async function parsePDF(buffer) {
  try {
    const pdfData = await pdfParse(buffer);
    return pdfData.text;
  } catch (error) {
    throw new Error('Failed to parse PDF file');
  }
}

async function parseDOCX(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    throw new Error('Failed to parse DOCX file');
  }
}

async function parseDOC(buffer) {
  try {
    // For .doc files, we'll try to extract text using mammoth
    // Note: This might not work for all .doc files as they're older format
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    throw new Error('Failed to parse DOC file. Please convert to DOCX or PDF format.');
  }
}

async function parseTXT(buffer) {
  try {
    return buffer.toString('utf-8');
  } catch (error) {
    throw new Error('Failed to parse TXT file');
  }
}

// Function to parse different file types
async function parseFile(file) {
  const { mimetype, buffer } = file;
  
  switch (mimetype) {
    case 'application/pdf':
      return await parsePDF(buffer);
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return await parseDOCX(buffer);
    case 'application/msword':
      return await parseDOC(buffer);
    case 'text/plain':
      return await parseTXT(buffer);
    default:
      throw new Error('Unsupported file type');
  }
}

// Mock AI Resume Analysis Function
function analyzeResumeWithMockAI(pdfText) {
  // Extract key information from the resume text
  const text = pdfText.toLowerCase();
  
  // Analyze different sections
  const hasContact = /(email|phone|address|linkedin)/.test(text);
  const hasExperience = /(experience|work|job|employment)/.test(text);
  const hasEducation = /(education|degree|university|college|bachelor|master|phd)/.test(text);
  const hasSkills = /(skills|technologies|programming|languages|tools)/.test(text);
  const hasProjects = /(projects|portfolio|github|repository)/.test(text);
  const hasSummary = /(summary|objective|profile|about)/.test(text);
  
  // Calculate scores based on content
  const contactScore = hasContact ? 85 : 40;
  const summaryScore = hasSummary ? 75 : 50;
  const experienceScore = hasExperience ? 80 : 30;
  const educationScore = hasEducation ? 85 : 40;
  const skillsScore = hasSkills ? 70 : 35;
  const projectsScore = hasProjects ? 65 : 25;
  
  // Calculate overall score
  const overallScore = Math.round((contactScore + summaryScore + experienceScore + educationScore + skillsScore + projectsScore) / 6);
  
  // Generate strengths based on content
  const strengths = [];
  if (hasContact) strengths.push("Complete contact information provided");
  if (hasExperience) strengths.push("Work experience section is present");
  if (hasEducation) strengths.push("Educational background is included");
  if (hasSkills) strengths.push("Skills section demonstrates technical capabilities");
  if (hasProjects) strengths.push("Project experience shows practical application");
  if (text.length > 1000) strengths.push("Resume has substantial content");
  
  // Generate weaknesses based on missing content
  const weaknesses = [];
  if (!hasContact) weaknesses.push("Missing or incomplete contact information");
  if (!hasSummary) weaknesses.push("No professional summary or objective");
  if (!hasExperience) weaknesses.push("Work experience section is missing");
  if (!hasEducation) weaknesses.push("Educational background is not included");
  if (!hasSkills) weaknesses.push("Skills section is missing or minimal");
  if (!hasProjects) weaknesses.push("No project portfolio or GitHub links");
  if (text.length < 500) weaknesses.push("Resume content is too brief");
  
  // Generate suggestions
  const suggestions = [
    "Add quantifiable achievements to experience section",
    "Include specific metrics and results",
    "Optimize for ATS with relevant keywords",
    "Add a compelling professional summary",
    "Include relevant certifications if applicable",
    "Add links to portfolio or GitHub projects"
  ];
  
  // Generate missing elements
  const missingElements = [];
  if (!hasSummary) missingElements.push("Professional summary");
  if (!hasProjects) missingElements.push("Project portfolio");
  if (!hasSkills) missingElements.push("Detailed skills section");
  if (!hasContact) missingElements.push("Complete contact details");
  
  // Determine industry fit based on keywords
  let industryFit = "General";
  if (/(software|developer|programming|coding|javascript|python|java|react|node)/.test(text)) {
    industryFit = "Technology/Software Development";
  } else if (/(marketing|sales|business|management|strategy)/.test(text)) {
    industryFit = "Business/Marketing";
  } else if (/(design|creative|ui|ux|graphic|art)/.test(text)) {
    industryFit = "Design/Creative";
  } else if (/(finance|accounting|banking|investment)/.test(text)) {
    industryFit = "Finance/Accounting";
  }
  
  // Determine experience level
  let experienceLevel = "Entry-level";
  if (/(senior|lead|manager|director|vp|chief)/.test(text)) {
    experienceLevel = "Senior/Executive";
  } else if (/(mid|intermediate|3\+|5\+)/.test(text)) {
    experienceLevel = "Mid-level";
  }
  
  // Extract keywords
  const keywords = [];
  const keywordPatterns = [
    /javascript|js/gi, /python/gi, /react/gi, /node/gi, /java/gi, /sql/gi,
    /html/gi, /css/gi, /git/gi, /agile/gi, /scrum/gi, /aws/gi, /docker/gi,
    /marketing/gi, /sales/gi, /management/gi, /leadership/gi, /analysis/gi
  ];
  
  keywordPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      keywords.push(matches[0].toLowerCase());
    }
  });
  
  // Remove duplicates and limit to top 10
  const uniqueKeywords = [...new Set(keywords)].slice(0, 10);
  
  // Generate recommendations
  const recommendations = [
    "Tailor resume for specific job descriptions",
    "Use action verbs to describe achievements",
    "Include relevant certifications and training",
    "Optimize resume for applicant tracking systems",
    "Add a professional headshot if appropriate",
    "Keep resume to 1-2 pages maximum"
  ];
  
  return {
    overallScore,
    summary: `This resume shows ${overallScore >= 70 ? 'good' : overallScore >= 50 ? 'moderate' : 'basic'} structure and content. ${overallScore >= 70 ? 'It demonstrates professional presentation and includes most essential sections.' : 'Consider adding more details and optimizing for better impact.'}`,
    strengths,
    weaknesses,
    suggestions,
    missingElements,
    sections: {
      contact: { 
        score: contactScore, 
        feedback: hasContact ? "Contact information is complete and professional" : "Contact information is missing or incomplete"
      },
      summary: { 
        score: summaryScore, 
        feedback: hasSummary ? "Professional summary provides good overview" : "Missing professional summary or objective statement"
      },
      experience: { 
        score: experienceScore, 
        feedback: hasExperience ? "Work experience section demonstrates relevant background" : "Work experience section needs more detail or is missing"
      },
      education: { 
        score: educationScore, 
        feedback: hasEducation ? "Educational background is well presented" : "Educational information could be more detailed"
      },
      skills: { 
        score: skillsScore, 
        feedback: hasSkills ? "Skills section shows technical capabilities" : "Skills section needs more specific technical details"
      },
      projects: { 
        score: projectsScore, 
        feedback: hasProjects ? "Project experience demonstrates practical skills" : "Project portfolio could enhance the resume"
      }
    },
    keywords: uniqueKeywords.length > 0 ? uniqueKeywords : ["resume", "professional", "experience"],
    industryFit,
    experienceLevel,
    recommendations
  };
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Resume Analyzer API is running with Mock AI',
    supportedFormats: ['PDF', 'DOC', 'DOCX', 'TXT']
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Test endpoint working',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/analyze-resume', authenticateToken, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Parse file based on its type
    const fileText = await parseFile(req.file);

    if (!fileText || fileText.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from file. Please ensure the file contains readable text.' });
    }

    // Analyze resume using mock AI
    const analysis = analyzeResumeWithMockAI(fileText);

    const response = {
      success: true,
      analysis,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype
    };
    
    res.json(response);

  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to analyze resume',
      details: error.message 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

// Handle React routing, return all requests to React app in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`🌐 Frontend served from: ${path.join(__dirname, '../client/dist')}`);
  }
}); 