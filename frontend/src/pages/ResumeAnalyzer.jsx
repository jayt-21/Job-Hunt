import React, { useState, useRef } from 'react';
import { resumeAPI } from '../services/api';
import { CheckCircle, AlertCircle, Lightbulb, Upload, X, Zap, Copy, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { generateResumePDF, downloadPDF } from '../utils/pdfGenerator';

export const ResumeAnalyzer = () => {
  const [formData, setFormData] = useState({
    resumeText: '',
    jobDescription: '',
  });
  const [analysis, setAnalysis] = useState(null);
  const [optimization, setOptimization] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [expandedOptStep, setExpandedOptStep] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const resumeTextRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    
    // Check file type
    const validTypes = ['application/pdf', 'text/plain'];
    const validExts = ['pdf', 'txt'];
    const ext = file.name.split('.').pop().toLowerCase();

    if (!validTypes.includes(file.type) || !validExts.includes(ext)) {
      setError('Only PDF and TXT files are supported');
      setFileName('');
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      setFileName('');
      return;
    }

    try {
      // Upload file to backend for parsing
      const response = await resumeAPI.upload(file);
      
      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          resumeText: response.data.data.resumeText,
        }));
        setFileName(file.name);
      } else {
        setError(response.data.message || 'Failed to upload file');
        setFileName('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload file. Please try again.');
      setFileName('');
    }
  };

  const clearResumeFile = () => {
    setFormData(prev => ({ ...prev, resumeText: '' }));
    setFileName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await resumeAPI.analyze(formData);
      setAnalysis(response.data.data);
      setOptimization(null); // Clear previous optimization
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptimize = async () => {
    setError('');
    setIsOptimizing(true);

    try {
      if (!formData.resumeText || !formData.jobDescription) {
        throw new Error('Resume text and job description are required for optimization');
      }

      const response = await resumeAPI.optimize(formData);
      
      if (!response.data || !response.data.data) {
        throw new Error('Invalid response from server');
      }

      setOptimization(response.data.data);
      
      // Scroll to optimization results
      setTimeout(() => {
        const element = document.querySelector('.optimization-results');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      console.error('Optimization error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to optimize resume. Please check your inputs and try again.';
      setError(errorMessage);
      setOptimization(null);
    } finally {
      setIsOptimizing(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const downloadResumePDF = () => {
    try {
      if (!optimization || !analysis) return;

      const pdf = generateResumePDF(
        optimization.optimizedResume,
        analysis,
        optimization
      );
      
      downloadPDF(pdf, 'optimized_resume.pdf');
    } catch (err) {
      setError('Failed to generate PDF: ' + err.message);
      console.error('PDF error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Resume Analyzer</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Analyze Your Resume
            </h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Your Resume *
                </label>
                
                {/* File Upload Option */}
                <div className="mb-4">
                  <label className="flex items-center justify-center border-2 border-dashed border-blue-300 rounded-lg p-6 cursor-pointer hover:bg-blue-50 transition">
                    <div className="text-center">
                      <Upload className="mx-auto text-blue-500 mb-2" size={32} />
                      <p className="text-blue-600 font-semibold">Upload Resume (PDF or TXT)</p>
                      <p className="text-gray-500 text-sm mt-1">or drag and drop</p>
                      <p className="text-gray-400 text-xs mt-2">Max 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.txt,application/pdf,text/plain"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Show uploaded file name */}
                {fileName && (
                  <div className="bg-green-50 border border-green-200 rounded p-3 mb-4 flex items-center justify-between">
                    <span className="text-green-700 font-semibold">✓ {fileName}</span>
                    <button
                      type="button"
                      onClick={clearResumeFile}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}

                {/* Or paste text */}
                <label className="block text-gray-600 text-sm mb-2 mt-4">
                  Or paste your resume text here:
                </label>
                <textarea
                  name="resumeText"
                  value={formData.resumeText}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Paste your resume text here..."
                  rows="8"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Job Description *
                </label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Paste the job description here..."
                  rows="10"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded transition disabled:opacity-50"
              >
                {isLoading ? 'Analyzing...' : 'Analyze Resume'}
              </button>
            </form>
          </div>

          {/* Results Section */}
          {analysis && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Analysis Results
              </h2>

              {/* ATS Score */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="text-green-500" size={24} />
                  <h3 className="text-xl font-semibold text-gray-800">
                    ATS Match Score
                  </h3>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-center mb-4">
                  <p className="text-white text-6xl font-bold">
                    {analysis.atsScore}
                  </p>
                  <p className="text-blue-100 mt-2">out of 100</p>
                </div>
                
                {/* Match Percentage Bar */}
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">Keyword Match Rate</span>
                    <span className="text-sm font-bold text-gray-900">
                      {analysis.analysis.matchPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${analysis.analysis.matchPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {analysis.analysis.matchedTerms.length} of {analysis.analysis.totalKeywordsInJob} keywords matched
                  </p>
                </div>
              </div>

              {/* Matched Keywords */}
              {analysis.analysis.matchedTerms.length > 0 && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <CheckCircle size={20} /> 
                    Matched Keywords ({analysis.analysis.matchedTerms.length})
                  </h4>
                  <p className="text-sm text-green-600 mb-3">
                    These keywords match the job description:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.analysis.matchedTerms.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="bg-green-200 text-green-900 px-3 py-1 rounded-full text-sm font-semibold hover:bg-green-300 transition"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Keywords Summary */}
              {analysis.analysis.missingTerms.length > 0 && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                    <AlertCircle size={20} /> 
                    Missing Keywords ({analysis.analysis.missingTerms.length})
                  </h4>
                  <p className="text-sm text-red-600 mb-3">
                    Add these terms to your resume to improve ATS compatibility:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.analysis.missingTerms.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="bg-red-200 text-red-900 px-3 py-1 rounded-full text-sm font-semibold hover:bg-red-300 transition"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {analysis.suggestions.length > 0 && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                    <Lightbulb size={20} /> 
                    Improvement Suggestions
                  </h4>
                  <ul className="space-y-3">
                    {analysis.suggestions.map((suggestion, idx) => (
                      <li
                        key={idx}
                        className="flex gap-3 text-gray-700"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Generate Optimized Resume Button */}
              <button
                onClick={handleOptimize}
                disabled={isOptimizing}
                className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Zap size={20} />
                {isOptimizing ? 'Generating...' : 'Generate Optimized Resume'}
              </button>
            </div>
          )}
        </div>

        {/* Optimization Results Section */}
        {optimization && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6 optimization-results">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Zap className="text-purple-500" size={32} />
              Optimized Resume Recommendations
            </h2>
            <p className="text-gray-600 mb-6">
              Follow these steps to improve your resume for this job posting
            </p>

            {/* Score Increase Prediction */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-700 font-semibold">Current Score</p>
                <p className="text-3xl font-bold text-purple-600">{analysis.atsScore}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700 font-semibold">Potential Increase</p>
                <p className="text-3xl font-bold text-blue-600">+{optimization.potentialScoreIncrease}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-700 font-semibold">New Potential Score</p>
                <p className="text-3xl font-bold text-green-600">
                  {Math.min(100, analysis.atsScore + optimization.potentialScoreIncrease)}
                </p>
              </div>
            </div>

            {/* Optimization Steps */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Optimization Steps</h3>
              <div className="space-y-3">
                {optimization.optimizationSteps.map((step, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedOptStep(expandedOptStep === idx ? null : idx)}
                      className="w-full bg-gray-50 hover:bg-gray-100 p-4 flex items-center justify-between transition"
                    >
                      <span className="font-semibold text-gray-800">{step}</span>
                      {expandedOptStep === idx ? (
                        <ChevronUp size={20} className="text-gray-600" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-600" />
                      )}
                    </button>
                    {expandedOptStep === idx && (
                      <div className="p-4 bg-white border-t">
                        <p className="text-gray-700">
                          {step.includes('Core Skills') && 'Create a dedicated skills section with specific tools and technologies mentioned in the job description. This improves ATS scanning and highlights your relevant expertise.'}
                          {step.includes('Experience section') && 'Add stronger action verbs and specific keywords to your achievement bullets. Use metrics and quantifiable results wherever possible.'}
                          {step.includes('Professional Summary') && 'Write 3-4 compelling sentences summarizing your experience and key skills. Include 2-3 primary keywords from the job description.'}
                          {step.includes('Emphasize') && 'Highlight your strongest matches by expanding on achievements, adding percentages, and showing impact.'}
                          {step.includes('metrics') && 'ATS systems favor quantifiable results. Include percentages, dollar amounts, time savings, or project counts to demonstrate impact.'}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Optimizations */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Sample Optimizations</h3>
              <div className="space-y-4">
                {Object.entries(optimization.sampleOptimizations).map(([key, sample]) => (
                  <div key={key} className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800 capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </h4>
                      <button
                        onClick={() => copyToClipboard(sample)}
                        className="text-yellow-600 hover:text-yellow-800 transition"
                        title="Copy to clipboard"
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap font-mono bg-white p-3 rounded border border-yellow-200">
                      {sample}
                    </p>
                  </div>
                ))}
                {copySuccess && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
                    ✓ Copied to clipboard!
                  </div>
                )}
              </div>
            </div>

        {/* Optimized Resume Preview */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Optimized Resume (Preview)</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(optimization.optimizedResume)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm flex items-center gap-2 transition"
                  >
                    <Copy size={16} />
                    Copy Full Text
                  </button>
                  <button
                    onClick={downloadResumePDF}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm flex items-center gap-2 transition"
                  >
                    <Download size={16} />
                    Download PDF
                  </button>
                </div>
              </div>
              <textarea
                ref={resumeTextRef}
                readOnly
                value={optimization.optimizedResume}
                className="w-full h-64 p-3 border border-gray-300 rounded font-mono text-sm bg-gray-50 text-gray-800"
              />
              <p className="text-xs text-gray-600 mt-2">
                💡 Use this as a reference to manually update your resume with the suggested keywords and improvements.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
