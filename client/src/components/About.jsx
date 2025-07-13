import React, { useMemo } from 'react';
import { Fade } from 'react-awesome-reveal';
import { FaBrain, FaBolt, FaShieldAlt, FaUsers, FaAward, FaBullseye, FaChartLine, FaLightbulb } from 'react-icons/fa';
import TeamMember from './TeamMember';
import { getAllTeamMembers } from '../data/teamData';

const About = () => {
  const features = useMemo(() => ([
    {
      icon: <FaBrain size={32} />,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze your resume with precision and provide actionable insights."
    },
    {
      icon: <FaBolt size={32} />,
      title: "Lightning Fast",
      description: "Get comprehensive analysis results in seconds, not minutes. Optimized for speed and efficiency."
    },
    {
      icon: <FaShieldAlt size={32} />,
      title: "Secure & Private",
      description: "Your data is encrypted and never stored permanently. Your privacy is our top priority."
    },
    {
      icon: <FaUsers size={32} />,
      title: "Industry Expertise",
      description: "Built with insights from HR professionals and industry experts across various sectors."
    }
  ]), []);

  const stats = useMemo(() => ([
    { number: "50K+", label: "Resumes Analyzed", icon: <FaBullseye size={24} /> },
    { number: "95%", label: "Accuracy Rate", icon: <FaAward size={24} /> },
    { number: "10K+", label: "Happy Users", icon: <FaUsers size={24} /> },
    { number: "24/7", label: "Available", icon: <FaChartLine size={24} /> }
  ]), []);

  const team = getAllTeamMembers();

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-secondary-50 to-primary-50 dark:from-secondary-900 dark:to-secondary-800">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <Fade triggerOnce direction="up">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mb-6">
              About Resume Analyzer
            </h2>
            <p className="text-xl text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto leading-relaxed">
              We're revolutionizing how job seekers approach their resumes with cutting-edge AI technology. 
              Our mission is to help you stand out in today's competitive job market.
            </p>
          </div>
        </Fade>

        {/* Features Grid */}
        <Fade triggerOnce direction="up" delay={0.05}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card text-center group"
              >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors duration-200">
                  <div className="text-primary-600 dark:text-primary-400">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 dark:text-secondary-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </Fade>

        {/* Team Section */}
        <Fade triggerOnce direction="up" delay={0.08}>
          <div className="text-center">
            <h3 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">
              Meet Our Team
            </h3>
            <p className="text-xl text-secondary-600 dark:text-secondary-300 mb-12 max-w-2xl mx-auto">
              We're a passionate team of engineers, designers, and product experts dedicated to helping you succeed.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {team.map((member) => (
                <TeamMember key={member.id} member={member} />
              ))}
            </div>
          </div>
        </Fade>

        {/* Mission Statement */}
        <Fade triggerOnce direction="up" delay={0.1}>
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
              <FaLightbulb className="w-16 h-16 mx-auto mb-6 text-primary-200" />
              <h3 className="text-3xl font-bold mb-4">
                Our Mission
              </h3>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
                To democratize access to professional career guidance by leveraging AI technology, 
                helping millions of job seekers worldwide achieve their career goals with confidence.
              </p>
            </div>
          </div>
        </Fade>
      </div>
    </section>
  );
};

export default About; 