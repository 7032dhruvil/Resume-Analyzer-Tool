import axios from 'axios';

// Dynamically determine the API base URL based on current hostname
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  const port = '5002';
  
  // If accessing via localhost, use localhost for API
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `http://localhost:${port}/api`;
  }
  
  // If accessing via IP address, use the same IP for API
  return `http://${hostname}:${port}/api`;
};

const API_BASE_URL = process.env.REACT_APP_API_URL || getApiBaseUrl();

console.log('API Base URL:', API_BASE_URL);
console.log('Current hostname:', window.location.hostname);

// Export the API base URL for use in other components
export { API_BASE_URL };

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout for file uploads
  headers: {
    // Remove default Content-Type to let browser set it for file uploads
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add loading indicator or other request logic here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          throw new Error(data.error || 'Invalid request. Please check your file.');
        case 401:
          throw new Error('Authentication required.');
        case 403:
          throw new Error('Access denied.');
        case 404:
          throw new Error('Service not found.');
        case 413:
          throw new Error('File too large. Please upload a smaller file.');
        case 429:
          throw new Error('Too many requests. Please try again later.');
        case 500:
          throw new Error(data.error || 'Server error. Please try again later.');
        default:
          throw new Error(data.error || 'An unexpected error occurred.');
      }
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection.');
    } else {
      // Other error
      throw new Error(error.message || 'An unexpected error occurred.');
    }
  }
);

// API functions
export const analyzeResume = async (file) => {
  try {
    console.log('API: Starting resume analysis for file:', file.name, file.type, file.size);
    const formData = new FormData();
    formData.append('resume', file);

    console.log('API: Sending request to:', API_BASE_URL + '/analyze-resume');
    
    // Try the primary URL first
    try {
      const response = await api.post('/analyze-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('API: Response received:', response.data);
      return response.data;
    } catch (primaryError) {
      console.log('Primary API call failed, trying fallback URLs...');
      
      // Fallback URLs to try
      const fallbackUrls = [
        'http://192.168.1.14:5002/api',
        'http://localhost:5002/api',
        'http://127.0.0.1:5002/api'
      ];
      
      for (const fallbackUrl of fallbackUrls) {
        try {
          console.log('Trying fallback URL:', fallbackUrl);
          const fallbackApi = axios.create({
            baseURL: fallbackUrl,
            timeout: 30000,
          });
          
          const response = await fallbackApi.post('/analyze-resume', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log('API: Response received from fallback:', response.data);
          return response.data;
        } catch (fallbackError) {
          console.log('Fallback URL failed:', fallbackUrl, fallbackError.message);
          continue;
        }
      }
      
      // If all fallbacks fail, throw the original error
      throw primaryError;
    }
  } catch (error) {
    console.error('API: Error in analyzeResume:', error);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const testConnection = async () => {
  try {
    console.log('Testing API connection...');
    
    // Try the primary URL first
    try {
      const response = await api.get('/test');
      console.log('Test response:', response.data);
      return response.data;
    } catch (primaryError) {
      console.log('Primary test failed, trying fallback URLs...');
      
      // Fallback URLs to try
      const fallbackUrls = [
        'http://192.168.1.14:5002/api',
        'http://localhost:5002/api',
        'http://127.0.0.1:5002/api'
      ];
      
      for (const fallbackUrl of fallbackUrls) {
        try {
          console.log('Trying fallback URL:', fallbackUrl);
          const fallbackApi = axios.create({
            baseURL: fallbackUrl,
            timeout: 10000,
          });
          
          const response = await fallbackApi.get('/test');
          console.log('Test response from fallback:', response.data);
          return response.data;
        } catch (fallbackError) {
          console.log('Fallback URL failed:', fallbackUrl, fallbackError.message);
          continue;
        }
      }
      
      // If all fallbacks fail, throw the original error
      throw primaryError;
    }
  } catch (error) {
    console.error('Test connection failed:', error);
    throw error;
  }
};

export default api; 