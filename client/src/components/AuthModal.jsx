import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaGithub, FaExclamationCircle } from 'react-icons/fa';
import { login, register, API_BASE_URL } from '../services/api';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setErrors({});
    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.name, formData.email, formData.password);
        // Optionally, auto-login after signup
        result = await login(formData.email, formData.password);
      }
      onAuthSuccess({ user: result.user, token: result.token });
      onClose();
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Redirect to backend OAuth endpoint
    window.location.href = `${API_BASE_URL}/auth/${provider}`;
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setErrors({});
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden focus:outline-none max-h-screen overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
          >
            {/* Header */}
            <div className="relative p-6 border-b border-secondary-200 dark:border-secondary-700">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors duration-200"
              >
                <FaTimes className="w-5 h-5 text-secondary-500 dark:text-secondary-400" />
              </button>
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-white text-center">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 text-center mt-2">
                {isLogin ? 'Sign in to your account' : 'Join us and start analyzing resumes'}
              </p>
            </div>

            {/* Form */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                  <div className="text-error-600 dark:text-error-400 text-sm mb-2 flex items-center">
                    <FaExclamationCircle className="w-4 h-4 mr-1" />
                    {errors.general}
                  </div>
                )}
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative group">
                      <FaUser className="input-icon pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400 group-focus-within:text-primary-500 transition-colors duration-200" />
                      <motion.input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`input-field pl-10 ${errors.name ? 'border-error-500 focus:ring-error-500' : ''}`}
                        placeholder="Enter your full name"
                        whileFocus={{ scale: 1.03, borderColor: '#3b82f6' }}
                        aria-label="Full Name"
                      />
                    </div>
                    <AnimatePresence>
                    {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-error-600 dark:text-error-400 text-sm mt-1 flex items-center"
                        >
                        <FaExclamationCircle className="w-4 h-4 mr-1" />
                        {errors.name}
                        </motion.p>
                    )}
                    </AnimatePresence>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <FaEnvelope className="input-icon pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400 group-focus-within:text-primary-500 transition-colors duration-200" />
                    <motion.input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`input-field pl-10 ${errors.email ? 'border-error-500 focus:ring-error-500' : ''}`}
                      placeholder="Enter your email"
                      whileFocus={{ scale: 1.03, borderColor: '#3b82f6' }}
                      aria-label="Email Address"
                    />
                  </div>
                  <AnimatePresence>
                  {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-error-600 dark:text-error-400 text-sm mt-1 flex items-center"
                      >
                        <FaExclamationCircle className="w-4 h-4 mr-1" />
                        {errors.email}
                      </motion.p>
                  )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <FaLock className="input-icon pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400 group-focus-within:text-primary-500 transition-colors duration-200" />
                    <motion.input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`input-field pl-10 pr-10 ${errors.password ? 'border-error-500 focus:ring-error-500' : ''}`}
                      placeholder="Enter your password"
                      whileFocus={{ scale: 1.03, borderColor: '#3b82f6' }}
                      aria-label="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                    </button>
                  </div>
                  <AnimatePresence>
                  {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-error-600 dark:text-error-400 text-sm mt-1 flex items-center"
                      >
                        <FaExclamationCircle className="w-4 h-4 mr-1" />
                        {errors.password}
                      </motion.p>
                  )}
                  </AnimatePresence>
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <FaLock className="input-icon pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400 group-focus-within:text-primary-500 transition-colors duration-200" />
                      <motion.input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`input-field pl-10 ${errors.confirmPassword ? 'border-error-500 focus:ring-error-500' : ''}`}
                        placeholder="Confirm your password"
                        whileFocus={{ scale: 1.03, borderColor: '#3b82f6' }}
                        aria-label="Confirm Password"
                      />
                    </div>
                    <AnimatePresence>
                    {errors.confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-error-600 dark:text-error-400 text-sm mt-1 flex items-center"
                        >
                        <FaExclamationCircle className="w-4 h-4 mr-1" />
                        {errors.confirmPassword}
                        </motion.p>
                    )}
                    </AnimatePresence>
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500" />
                      <span className="ml-2 text-sm text-secondary-600 dark:text-secondary-400">Remember me</span>
                    </label>
                    <button type="button" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                      Forgot password?
                    </button>
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                    </>
                  ) : (
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  )}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-secondary-300 dark:border-secondary-600"></div>
                <span className="px-4 text-sm text-secondary-500 dark:text-secondary-400">or continue with</span>
                <div className="flex-1 border-t border-secondary-300 dark:border-secondary-600"></div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: '#24292f', color: '#fff' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSocialLogin('github')}
                  disabled={socialLoading}
                  className="flex items-center justify-center space-x-2 px-4 py-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Sign in with GitHub"
                >
                  {socialLoading === 'github' ? (
                    <div className="w-5 h-5 border-2 border-secondary-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FaGithub className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium">{socialLoading === 'github' ? 'Connecting...' : 'GitHub'}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSocialLogin('google')}
                  disabled={socialLoading}
                  className="flex items-center justify-center space-x-2 px-4 py-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 hover:bg-blue-50 dark:hover:bg-blue-600 hover:text-blue-700 dark:hover:text-white transition-colors duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Sign in with Google"
                >
                  {socialLoading === 'google' ? (
                    <div className="w-5 h-5 border-2 border-secondary-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.7 30.18 0 24 0 14.82 0 6.73 5.82 2.69 14.09l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.59C43.98 37.13 46.1 31.36 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.32c-1.04-3.13-1.04-6.49 0-9.62l-7.98-6.2C.9 16.18 0 19.01 0 22c0 2.99.9 5.82 2.69 8.5l7.98-6.18z"/><path fill="#EA4335" d="M24 44c6.18 0 11.36-2.05 15.13-5.59l-7.19-5.59c-2.01 1.35-4.59 2.14-7.94 2.14-6.38 0-11.87-3.63-13.33-8.68l-7.98 6.18C6.73 42.18 14.82 48 24 48z"/></g></svg>
                  )}
                  <span className="text-sm font-medium">{socialLoading === 'google' ? 'Connecting...' : 'Google'}</span>
                </motion.button>
              </div>

              {/* Toggle Mode */}
              <div className="mt-6 text-center">
                <p className="text-secondary-600 dark:text-secondary-400">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="ml-1 text-primary-600 dark:text-primary-400 hover:underline font-medium"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal; 