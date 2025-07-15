import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FaUpload, FaFileAlt, FaExclamationCircle, FaPlay, FaSyncAlt } from 'react-icons/fa';
import { analyzeResume, testConnection, API_BASE_URL } from '../services/api';

const FileUpload = ({ onAnalysisComplete, isLoading, setIsLoading, user, onOpenAuthModal }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
    }
  }, []);

  // Handle direct file input for mobile devices
  const handleFileInputChange = useCallback((event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setUploadedFile(files[0]);
    }
  }, []);

  // Handle click on upload area for mobile
  const handleUploadAreaClick = useCallback((event) => {
    // Prevent triggering the dropzone click if we're on mobile
    if (event.target.closest('[data-file-input]')) {
      return;
    }
    
    // Trigger file input click for mobile devices
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleAnalyze = async () => {
    if (!uploadedFile) {
      return;
    }
    
    setIsLoading(true);
    setIsAnalyzing(true);
    
    try {
      const result = await analyzeResume(uploadedFile);
      
      if (result && result.analysis) {
        onAnalysisComplete({
          ...result.analysis,
          fileName: result.fileName || uploadedFile.name
        });
        
        // Scroll to analysis results
        setTimeout(() => {
          const element = document.getElementById('analysis-results');
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 500);
      } else {
        throw new Error('Invalid response from server');
      }
      
    } catch (error) {
      // Show user-friendly error message based on error type
      let errorMessage = 'Analysis failed: ';
      
      if (error.response) {
        // Server responded with error status
        errorMessage += error.response.data?.error || `Server error (${error.response.status})`;
      } else if (error.request) {
        // Network error
        errorMessage += 'Network error. Please check your connection and try again.';
      } else {
        // Other error
        errorMessage += error.message || 'Unknown error occurred';
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setIsAnalyzing(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTestConnection = async () => {
    try {
      const result = await testConnection();
      alert('Connection test successful! API is working.');
    } catch (error) {
      // Show more detailed error information
      let errorDetails = `Connection test failed: ${error.message}`;
      
      if (error.response) {
        errorDetails += `\nStatus: ${error.response.status}`;
        errorDetails += `\nData: ${JSON.stringify(error.response.data)}`;
      } else if (error.request) {
        errorDetails += `\nNo response received from server`;
        errorDetails += `\nRequest URL: ${error.config?.url}`;
      }
      
      alert(errorDetails);
    }
  };

  const handleNetworkDiagnostic = async () => {
    const diagnostic = {
      userAgent: navigator.userAgent,
      hostname: window.location.hostname,
      port: window.location.port,
      protocol: window.location.protocol,
      fullUrl: window.location.href,
      timestamp: new Date().toISOString()
    };
    
    // Test different endpoints
    const tests = [
      { name: 'Health Check', url: `${API_BASE_URL.replace('/api', '')}/api/health` },
      { name: 'Test Endpoint', url: `${API_BASE_URL.replace('/api', '')}/api/test` }
    ];
    
    let results = 'Network Diagnostic Results:\n\n';
    
    for (const test of tests) {
      try {
        const response = await fetch(test.url, { 
          method: 'GET',
          mode: 'cors'
        });
        results += `✅ ${test.name}: ${response.status} ${response.statusText}\n`;
      } catch (error) {
        results += `❌ ${test.name}: ${error.message}\n`;
      }
    }
    
    results += `\nDiagnostic Info:\n`;
    results += `Hostname: ${diagnostic.hostname}\n`;
    results += `Port: ${diagnostic.port}\n`;
    results += `API Base: ${API_BASE_URL}\n`;
    
    alert(results);
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    noClick: true, // Disable default click behavior to handle it manually
  });

  return (
    <div className="max-w-2xl mx-auto relative">
      {!user && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-xl cursor-not-allowed" style={{ pointerEvents: 'auto' }}>
          <div className="text-center p-8">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Sign in required</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Please log in or create an account to analyze your resume.</p>
            <button
              className="btn-primary px-6 py-2"
              onClick={() => {
                if (onOpenAuthModal) { onOpenAuthModal(); } else {
                  const event = new CustomEvent('open-auth-modal');
                  window.dispatchEvent(event);
                }
              }}
            >
              Log In / Sign Up
            </button>
          </div>
        </div>
      )}
      <div className={user ? '' : 'blur-sm pointer-events-none select-none'}>
      {!uploadedFile ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
              Upload Your Resume
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Drag and drop your resume here, or tap to browse
            </p>
          </div>

          {/* Hidden file input for mobile compatibility */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileInputChange}
            className="hidden"
            data-file-input="true"
          />

          <div
            {...getRootProps()}
            onClick={handleUploadAreaClick}
            className={`
              upload-area relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
              ${isDragActive && !isDragReject 
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                : isDragReject 
                  ? 'border-red-400 bg-red-50 dark:bg-red-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }
            `}
          >
            <input {...getInputProps()} />
            
            <div className="flex flex-col items-center">
              {isDragReject ? (
                <FaExclamationCircle className="w-12 h-12 text-error-500 mb-4" />
              ) : (
                <FaUpload className="w-12 h-12 text-primary-500 mb-4" />
              )}
              
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {isDragReject 
                  ? 'Invalid file type' 
                  : isDragActive 
                    ? 'Drop your resume here' 
                    : 'Choose a file or drag it here'
                }
              </p>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {isDragReject 
                  ? 'Please upload a supported file type' 
                  : 'Supports PDF, DOC, DOCX, and TXT files up to 5MB'
                }
              </p>
              
              {!isDragReject && (
                <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
                  <FaFileAlt className="w-4 h-4" />
                  <span className="text-sm font-medium">Multiple formats supported</span>
                </div>
              )}
            </div>
          </div>

          {/* Mobile-specific instructions */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
              💡 <strong>Mobile users:</strong> Tap the upload area above to select a file from your device
            </p>
          </div>

          {/* File Requirements */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              File Requirements:
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Supported formats: PDF, DOC, DOCX, TXT</li>
              <li>• Maximum file size: 5MB</li>
              <li>• Text-based documents (not scanned images)</li>
              <li>• English language preferred</li>
            </ul>
          </div>

          {/* Privacy Notice */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Your resume is processed securely and not stored permanently. 
              We use AI to analyze your document and provide feedback.
            </p>
            {/*
            <button
              onClick={handleTestConnection}
              className="mt-2 text-xs text-blue-600 hover:text-blue-700 underline"
            >
              Test API Connection
            </button>
            <div className="w-full flex justify-center">
              <button
                onClick={handleNetworkDiagnostic}
                className="mt-2 text-xs text-gray-600 hover:text-gray-700 underline font-semibold mx-auto"
              >
                Network Diagnostic
              </button>
            </div>
            */}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
              File Ready for Analysis
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Your file has been uploaded successfully
            </p>
          </div>

          {/* File Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <FaFileAlt className="w-8 h-8 text-blue-500" />
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {uploadedFile.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="btn-primary flex items-center justify-center space-x-2 px-8 py-3"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <FaPlay className="w-4 h-4" />
                  <span>Analyze File</span>
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              disabled={isAnalyzing}
              className="btn-secondary flex items-center justify-center space-x-2 px-8 py-3"
            >
              <FaSyncAlt className="w-4 h-4" />
              <span>Upload New File</span>
            </motion.button>
          </div>

          {/* Privacy Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Click "Analyze File" to start the AI-powered analysis of your resume.
            </p>
          </div>
        </motion.div>
      )}
      </div>
    </div>
  );
};

export default FileUpload; 