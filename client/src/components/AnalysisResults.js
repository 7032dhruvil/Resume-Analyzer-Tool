import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb, 
  RefreshCw,
  Target,
  Award,
  Clock,
  Users
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const AnalysisResults = ({ result, fileName = "Resume", onReset }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Add null check for result
  if (!result) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="card text-center">
          <p className="text-gray-600 dark:text-gray-300">No analysis results available.</p>
        </div>
      </div>
    );
  }

  const analysis = result; // Use result as analysis

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  // Prepare chart data with null checks
  const sectionData = Object.entries(analysis.sections || {}).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    score: value?.score || 0,
    color: (value?.score || 0) >= 80 ? '#22c55e' : (value?.score || 0) >= 60 ? '#f59e0b' : '#ef4444'
  }));

  const pieData = [
    { name: 'Excellent', value: sectionData.filter(s => s.score >= 80).length, color: '#22c55e' },
    { name: 'Good', value: sectionData.filter(s => s.score >= 60 && s.score < 80).length, color: '#f59e0b' },
    { name: 'Needs Improvement', value: sectionData.filter(s => s.score < 60).length, color: '#ef4444' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'sections', label: 'Sections', icon: Target },
    { id: 'feedback', label: 'Feedback', icon: Lightbulb },
    { id: 'recommendations', label: 'Recommendations', icon: Award }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Analysis Results
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Analyzing: <span className="font-medium text-gray-800 dark:text-gray-200">{fileName}</span>
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReset}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>New Analysis</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card mb-8"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Overall Resume Score
          </h2>
          
          <div className="flex justify-center mb-6">
            <div className={`score-circle ${analysis.overallScore >= 80 ? 'score-circle-excellent' : analysis.overallScore >= 60 ? 'score-circle-good' : 'score-circle-poor'}`}>
              <span className={getScoreColor(analysis.overallScore || 0)}>
                {analysis.overallScore || 0}%
              </span>
            </div>
          </div>
          
          <p className="text-lg text-gray-700 dark:text-gray-200 mb-4">
            {analysis.summary || "Analysis summary not available."}
          </p>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{analysis.experienceLevel || "Not specified"}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{analysis.industryFit || "General"}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="card mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab ${
                    activeTab === tab.id
                      ? 'tab-active'
                      : 'tab-inactive'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 gap-8"
            >
              {/* Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Section Performance
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sectionData}>
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Distribution */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Score Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value}`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Legend below the chart */}
                  <div className="flex justify-center mt-4 space-x-6 text-sm">
                    {pieData.map((entry, idx) => (
                      <div key={entry.name} className="flex items-center space-x-2">
                        <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
                        <span className="text-gray-800 dark:text-gray-100">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'sections' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {Object.entries(analysis.sections || {}).map(([key, section]) => (
                <div key={key} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                      {key}
                    </h4>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(section?.score || 0)} ${getScoreColor(section?.score || 0)}`}>
                      {section?.score || 0}%
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 text-sm">
                    {section?.feedback || "No feedback available for this section."}
                  </p>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'feedback' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Strengths */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Strengths
                  </h3>
                </div>
                <ul className="space-y-2">
                  {(analysis.strengths || []).map((strength, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-800 dark:text-gray-100">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Areas for Improvement
                  </h3>
                </div>
                <ul className="space-y-2">
                  {(analysis.weaknesses || []).map((weakness, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-800 dark:text-gray-100">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Missing Elements */}
              {(analysis.missingElements || []).length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-3 mb-4">
                    <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Missing Elements
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {(analysis.missingElements || []).map((element, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-800 dark:text-gray-100">{element}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'recommendations' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Suggestions */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-3 mb-4">
                  <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Suggestions for Improvement
                  </h3>
                </div>
                <ul className="space-y-3">
                  {(analysis.suggestions || []).map((suggestion, index) => (
                    <li key={index} className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-100 dark:border-blue-800">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-800 dark:text-gray-100">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-3 mb-4">
                  <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Professional Recommendations
                  </h3>
                </div>
                <ul className="space-y-3">
                  {(analysis.recommendations || []).map((rec, index) => (
                    <li key={index} className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-green-100 dark:border-green-800">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-800 dark:text-gray-100">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Keywords */}
              {(analysis.keywords || []).length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Key Skills & Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(analysis.keywords || []).map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium dark:bg-blue-900 dark:text-blue-300"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults; 