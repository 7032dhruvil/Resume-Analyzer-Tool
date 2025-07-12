import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, User, LogIn, LogOut } from 'lucide-react';
import Logo from './Logo';

const Header = ({ user, onLoginClick, onProfileClick, onLogout }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleMobileMenu = () => setMobileMenuOpen((open) => !open);

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <Logo usePng={true} pngSrc="/logo.webp" size="default" />
          <div>
            <h1 className="text-xl font-bold text-secondary-900 dark:text-white">Resume Analyzer</h1>
            <p className="text-xs text-secondary-500 dark:text-secondary-400">AI-Powered Analysis</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-secondary-600 hover:text-primary-600 dark:text-secondary-300 dark:hover:text-primary-400 font-medium transition-colors">Features</a>
          <a href="#about" className="text-secondary-600 hover:text-primary-600 dark:text-secondary-300 dark:hover:text-primary-400 font-medium transition-colors">About</a>
          <a href="#contact" className="text-secondary-600 hover:text-primary-600 dark:text-secondary-300 dark:hover:text-primary-400 font-medium transition-colors">Contact</a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5 mx-auto" /> : <Moon className="w-5 h-5 mx-auto" />}
          </button>
          {user ? (
            <>
              <button
                onClick={onProfileClick}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                <span>{user.name}</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 dark:bg-secondary-800 dark:hover:bg-secondary-700 dark:text-secondary-300 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5 mx-auto" /> : <Moon className="w-5 h-5 mx-auto" />}
          </button>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 mx-auto" /> : <Menu className="w-5 h-5 mx-auto" />}
          </button>
        </div>
      </div>
      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-700 px-4 pb-4 pt-2 flex flex-col space-y-3 shadow">
          <a href="#features" className="text-secondary-600 hover:text-primary-600 dark:text-secondary-300 dark:hover:text-primary-400 font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>Features</a>
          <a href="#about" className="text-secondary-600 hover:text-primary-600 dark:text-secondary-300 dark:hover:text-primary-400 font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>About</a>
          <a href="#contact" className="text-secondary-600 hover:text-primary-600 dark:text-secondary-300 dark:hover:text-primary-400 font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          <div className="pt-2 border-t border-secondary-200 dark:border-secondary-700 flex flex-col space-y-2">
            {user ? (
              <>
                <button onClick={() => { onProfileClick(); setMobileMenuOpen(false); }} className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg w-full">
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </button>
                <button onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="flex items-center space-x-2 px-4 py-2 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 dark:bg-secondary-800 dark:hover:bg-secondary-700 dark:text-secondary-300 rounded-lg w-full transition-colors">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button onClick={() => { onLoginClick(); setMobileMenuOpen(false); }} className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg w-full transition-colors">
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header; 