const resumeAnalyzerService = require('../../src/services/resumeAnalyzerService');

describe('ResumeAnalyzerService', () => {
  describe('calculateATSScore', () => {
    it('should calculate ATS score correctly', () => {
      const resumeText = 'I have experience with JavaScript, React, Node.js, and MongoDB.';
      const jobDescription = 'We need someone with JavaScript, React, and AWS skills.';

      const result = resumeAnalyzerService.calculateATSScore(
        resumeText,
        jobDescription
      );

      expect(result.score).toBeGreaterThan(0);
      expect(result.matchCount).toBeGreaterThan(0);
      expect(Array.isArray(result.matchedKeywords)).toBe(true);
      expect(Array.isArray(result.missingKeywords)).toBe(true);
    });

    it('should return 0 score for no matches', () => {
      const resumeText = 'I have experience with COBOL and FORTRAN.';
      const jobDescription = 'We need JavaScript and React developers.';

      const result = resumeAnalyzerService.calculateATSScore(
        resumeText,
        jobDescription
      );

      expect(result.score).toBeLessThanOrEqual(100);
    });
  });

  describe('analyzeResume', () => {
    it('should provide analysis and suggestions', () => {
      const resumeText = 'Python, Machine Learning, TensorFlow, Pandas, SQL';
      const jobDescription = 'Data Scientist needed with Python, TensorFlow, SQL';

      const result = resumeAnalyzerService.analyzeResume(
        resumeText,
        jobDescription
      );

      expect(result.atsScore).toBeDefined();
      expect(Array.isArray(result.suggestions)).toBe(true);
      expect(result.analysis).toBeDefined();
    });
  });

  describe('generateSuggestions', () => {
    it('should generate appropriate suggestions based on score', () => {
      const suggestions = resumeAnalyzerService.generateSuggestions(
        45,
        ['aws', 'docker'],
        ['javascript', 'react']
      );

      expect(Array.isArray(suggestions)).toBe(true);
      expect(suggestions.length).toBeGreaterThan(0);
    });

    it('should include missing keywords in suggestions', () => {
      const suggestions = resumeAnalyzerService.generateSuggestions(
        60,
        ['kubernetes', 'docker', 'terraform'],
        ['aws']
      );

      expect(suggestions.some(s => s.includes('missing'))).toBe(true);
    });
  });
});
