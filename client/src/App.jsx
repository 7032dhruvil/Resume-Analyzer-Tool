import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import About from './components/About';
import Brain from 'lucide-react/dist/esm/icons/brain';
import Zap from 'lucide-react/dist/esm/icons/zap';
import Shield from 'lucide-react/dist/esm/icons/shield';
import Users from 'lucide-react/dist/esm/icons/users';
import { getTestimonials } from './data/teamData';

const AnalysisResults = lazy(() => import('./components/AnalysisResults'));
const AuthModal = lazy(() => import('./components/AuthModal'));
const UserAccountModal = lazy(() => import('./components/UserAccountModal'));
const FileUpload = lazy(() => import('./components/FileUpload'));
const Contact = lazy(() => import('./components/Contact'));

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserAccountModalOpen, setIsUserAccountModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Preload lazy components for faster load
  useEffect(() => {
    import('./components/AnalysisResults');
    import('./components/AuthModal');
    import('./components/UserAccountModal');
    import('./components/FileUpload');
    import('./components/Contact');
  }, []);

  const handleAuthSuccess = (authData) => {
    setUser(authData.user);
    localStorage.setItem('user', JSON.stringify(authData.user));
    localStorage.setItem('token', authData.token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsUserAccountModalOpen(false);
  };

  const handleUpdateProfile = (updatedProfile) => {
    setUser(prev => ({ ...prev, ...updatedProfile }));
    localStorage.setItem('user', JSON.stringify({ ...user, ...updatedProfile }));
  };

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms provide comprehensive resume insights and optimization suggestions."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Get detailed analysis results in seconds, not minutes. Optimized for speed and efficiency."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description: "Your data is encrypted and never stored permanently. Your privacy is our top priority."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Industry Expertise",
      description: "Built with insights from HR professionals and industry experts across various sectors."
    }
  ];

  const testimonials = getTestimonials();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        user={user} 
        onLoginClick={() => setIsAuthModalOpen(true)}
        onProfileClick={() => setIsUserAccountModalOpen(true)}
        onLogout={handleLogout}
      />
      
      <main className="w-full">
        {/* Hero Section */}
        <section className="section gradient-bg-dark text-white">
          <div className="container">
            <div className="text-center">
              <h1 className="text-4xl md:text-7xl font-bold mb-6" style={{fontFamily: 'Inter, sans-serif', fontWeight: 700, letterSpacing: '-0.02em'}}>
                AI-Powered Resume Analysis
              </h1>
              <p className="text-base md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed" style={{fontFamily: 'Inter, sans-serif', fontWeight: 400, letterSpacing: '-0.01em'}}>
                Get instant, professional feedback on your resume with our advanced AI technology. 
                Stand out in today's competitive job market.
              </p>
              <button
                onClick={() => document.getElementById('upload-section').scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary text-lg px-8 py-4 bg-white text-blue-600 hover:bg-blue-50"
              >
                Start Analyzing Now
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="section section-white">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-16"
            >
              <h2 className="text-2xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6" style={{fontFamily: 'Inter, sans-serif', fontWeight: 700, letterSpacing: '-0.01em'}}>
                Why Choose Our AI Analyzer?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Experience the future of resume optimization with cutting-edge AI technology
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  whileHover={{ y: -5 }}
                  className="card card-hover text-center group"
                >
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors duration-200">
                    <div className="text-blue-600 dark:text-blue-400">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section id="upload-section" className="section section-gradient">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Analyze Your Resume
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Upload your resume and get instant AI-powered feedback and optimization suggestions
              </p>
            </motion.div>

            <Suspense fallback={<div>Loading...</div>}>
              <FileUpload 
                onAnalysisComplete={setAnalysisResult}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </Suspense>

            {analysisResult && (
              <motion.div
                id="analysis-results"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-12"
              >
                <Suspense fallback={<div>Loading...</div>}>
                  <AnalysisResults 
                    result={analysisResult} 
                    fileName={analysisResult.fileName || "Resume"}
                    onReset={() => setAnalysisResult(null)}
                  />
                </Suspense>
              </motion.div>
            )}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section section-white">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                What Our Users Say
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Join thousands of satisfied users who have transformed their careers
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  whileHover={{ y: -5 }}
                  className="card card-hover"
                >
                  <div className="flex items-center mb-4">
                    <div className="relative w-12 h-12 mr-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div 
                        className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700"
                        style={{ display: 'none' }}
                      >
                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic">
                    "{testimonial.content}"
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section gradient-bg-primary text-white">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-4xl font-bold mb-2">50K+</div>
                <div className="text-blue-100">Resumes Analyzed</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: 0.03 }}
              >
                <div className="text-4xl font-bold mb-2">95%</div>
                <div className="text-blue-100">Accuracy Rate</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: 0.06 }}
              >
                <div className="text-4xl font-bold mb-2">10K+</div>
                <div className="text-blue-100">Happy Users</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: 0.09 }}
              >
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-blue-100">Available</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <About />

        {/* Contact Section */}
        <Suspense fallback={<div>Loading...</div>}>
          <Contact />
        </Suspense>
      </main>

      <Footer />

      {/* Auth Modal */}
      <Suspense fallback={<div>Loading...</div>}>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      </Suspense>

      {/* User Account Modal */}
      <Suspense fallback={<div>Loading...</div>}>
        <UserAccountModal
          isOpen={isUserAccountModalOpen}
          onClose={() => setIsUserAccountModalOpen(false)}
          user={user}
          onLogout={handleLogout}
          onUpdateProfile={handleUpdateProfile}
        />
      </Suspense>
    </div>
  );
}

export default App; 