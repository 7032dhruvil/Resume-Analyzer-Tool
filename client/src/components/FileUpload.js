import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle, Play, RefreshCw } from 'lucide-react';
import { analyzeResume, testConnection, API_BASE_URL } from '../services/api';

const FileUpload = ({ onAnalysisComplete, isLoading, setIsLoading }) => {
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
      console.error('No file uploaded');
      return;
    }
    
    console.log('Starting analysis for file:', uploadedFile.name, uploadedFile.type, uploadedFile.size);
    setIsLoading(true);
    setIsAnalyzing(true);
    
    try {
      console.log('Calling analyzeResume API...');
      const result = await analyzeResume(uploadedFile);
      console.log('Analysis completed successfully:', result);
      
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
          } else {
            console.warn('Analysis results element not found');
          }
        }, 500);
      } else {
        console.error('Invalid response format:', result);
        throw new Error('Invalid response from server');
      }
      
    } catch (error) {
      console.error('Analysis error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        request: error.request,
        config: error.config
      });
      
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
      console.log('Testing connection...');
      console.log('Current location:', window.location.href);
      console.log('Hostname:', window.location.hostname);
      
      const result = await testConnection();
      console.log('Connection test successful:', result);
      alert('Connection test successful! API is working.');
    } catch (error) {
      console.error('Connection test failed:', error);
      
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
    
    console.log('Network Diagnostic:', diagnostic);
    
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
    <div className="max-w-2xl mx-auto">
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
                <AlertCircle className="w-12 h-12 text-error-500 mb-4" />
              ) : (
                <Upload className="w-12 h-12 text-primary-500 mb-4" />
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
                  <FileText className="w-4 h-4" />
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
            <button
              onClick={handleTestConnection}
              className="mt-2 text-xs text-blue-600 hover:text-blue-700 underline"
            >
              Test API Connection
            </button>
            <button
              onClick={handleNetworkDiagnostic}
              className="mt-1 text-xs text-gray-600 hover:text-gray-700 underline block"
            >
              Network Diagnostic
            </button>
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
              <FileText className="w-8 h-8 text-blue-500" />
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
                  <Play className="w-4 h-4" />
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
              <RefreshCw className="w-4 h-4" />
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
  );
};

export default FileUpload; 