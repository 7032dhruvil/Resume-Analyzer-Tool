const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Set up multer for file uploads (max 5MB, only certain file types)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Please upload PDF, DOC, DOCX, or TXT.'));
    }
  }
});

// POST /api/analyze-resume
router.post('/analyze-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Mock analysis logic (replace with real AI logic as needed)
    const analysis = {
      overallScore: 78,
      sections: {
        education: { score: 85, feedback: 'Good education section.' },
        experience: { score: 70, feedback: 'Add more details to your work experience.' },
        skills: { score: 80, feedback: 'Skills section is strong.' },
        summary: { score: 60, feedback: 'Consider improving your summary.' }
      },
      feedback: [
        'Use more action verbs in your experience section.',
        'Quantify your achievements where possible.'
      ],
      recommendations: [
        'Add a professional summary at the top.',
        'Highlight your technical skills.'
      ]
    };

    res.json({
      analysis,
      fileName: req.file.originalname
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to analyze resume.' });
  }
});

module.exports = router; 