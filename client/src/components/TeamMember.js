import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Github, Mail, User } from 'lucide-react';

const TeamMember = ({ member }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const getImageSrc = () => {
    if (imageError) {
      return member.fallbackImage;
    }
    return member.image;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="card text-center group relative overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative mb-6">
        <div className="w-32 h-32 mx-auto relative">
          {/* Loading State */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Error State */}
          {imageError && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-gray-400" />
            </div>
          )}
          
          {/* Image */}
          <img
            src={getImageSrc()}
            alt={member.name}
            onError={handleImageError}
            onLoad={handleImageLoad}
            className={`
              w-32 h-32 rounded-full object-cover border-4 transition-all duration-300
              ${imageLoaded && !imageError 
                ? 'border-primary-200 dark:border-primary-800 group-hover:border-primary-300 dark:group-hover:border-primary-700' 
                : 'border-gray-200 dark:border-gray-700'
              }
              ${!imageLoaded && !imageError ? 'opacity-0' : 'opacity-100'}
            `}
            style={{ minWidth: 128, minHeight: 128 }}
          />
        </div>
      </div>

      {/* Member Info */}
      <div className="space-y-3">
        <h4 className="text-xl font-semibold text-secondary-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
          {member.name}
        </h4>
        
        <p className="text-primary-600 dark:text-primary-400 font-medium text-sm">
          {member.role}
        </p>
        
        <p className="text-secondary-600 dark:text-secondary-300 text-sm leading-relaxed">
          {member.bio}
        </p>
      </div>

      {/* Social Links */}
      <div className="flex justify-center space-x-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        {member.linkedin && member.linkedin !== "#" && (
          <motion.a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
            title="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </motion.a>
        )}
        
        {member.github && member.github !== "#" && (
          <motion.a
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
            title="GitHub"
          >
            <Github className="w-5 h-5" />
          </motion.a>
        )}
        
        {member.email && (
          <motion.a
            href={`mailto:${member.email}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
            title="Email"
          >
            <Mail className="w-5 h-5" />
          </motion.a>
        )}
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-600/0 to-primary-600/0 group-hover:from-primary-600/5 group-hover:to-primary-600/10 transition-all duration-300 rounded-xl pointer-events-none" />
    </motion.div>
  );
};

export default TeamMember; 