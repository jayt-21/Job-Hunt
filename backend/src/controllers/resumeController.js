const ResumeAnalysis = require('../models/ResumeAnalysis');
const resumeAnalyzerService = require('../services/resumeAnalyzerService');

class ResumeController {
  async analyzeResume(req, res) {
    try {
      const { resumeText, jobDescription, jobId } = req.body;

      // Validation
      if (!resumeText || !jobDescription) {
        return res.status(400).json({
          success: false,
          message: 'Resume text and job description are required',
        });
      }

      // Analyze resume
      const analysis = resumeAnalyzerService.analyzeResume(
        resumeText,
        jobDescription
      );

      // Save analysis to database
      const savedAnalysis = new ResumeAnalysis({
        userId: req.userId,
        jobId,
        resumeText,
        jobDescription,
        atsScore: analysis.atsScore,
        analysis: analysis.analysis,
        suggestions: analysis.suggestions,
      });

      await savedAnalysis.save();

      return res.status(200).json({
        success: true,
        message: 'Resume analyzed successfully',
        data: {
          atsScore: analysis.atsScore,
          analysis: analysis.analysis,
          suggestions: analysis.suggestions,
          analysisId: savedAnalysis._id,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAnalysisHistory(req, res) {
    try {
      const analyses = await ResumeAnalysis.find({ userId: req.userId })
        .sort({ createdAt: -1 })
        .select('-resumeText -jobDescription'); // Exclude large text fields

      return res.status(200).json({
        success: true,
        count: analyses.length,
        data: analyses,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAnalysisById(req, res) {
    try {
      const { analysisId } = req.params;

      const analysis = await ResumeAnalysis.findOne({
        _id: analysisId,
        userId: req.userId,
      });

      if (!analysis) {
        return res.status(404).json({
          success: false,
          message: 'Analysis not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: analysis,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async optimizeResume(req, res) {
    try {
      const { resumeText, jobDescription } = req.body;

      // Validation with detailed error messages
      if (!resumeText) {
        return res.status(400).json({
          success: false,
          message: 'Resume text is required for optimization',
        });
      }

      if (!jobDescription) {
        return res.status(400).json({
          success: false,
          message: 'Job description is required for optimization',
        });
      }

      if (typeof resumeText !== 'string' || resumeText.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Resume text must not be empty',
        });
      }

      if (typeof jobDescription !== 'string' || jobDescription.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Job description must not be empty',
        });
      }

      // Generate optimized resume
      const optimization = resumeAnalyzerService.optimizeResume(
        resumeText,
        jobDescription
      );

      if (!optimization) {
        return res.status(500).json({
          success: false,
          message: 'Failed to generate optimization data',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Resume optimized successfully',
        data: optimization,
      });
    } catch (error) {
      console.error('Error in optimizeResume:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to optimize resume: ' + error.message,
      });
    }
  }

  async uploadResume(req, res) {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded',
        });
      }

      let resumeText = '';

      if (file.mimetype === 'application/pdf') {
        // Extract text from PDF
        resumeText = await resumeAnalyzerService.extractTextFromPDF(file.buffer);
      } else if (file.mimetype === 'text/plain') {
        // Read text file directly
        resumeText = file.buffer.toString('utf-8');
      } else {
        return res.status(400).json({
          success: false,
          message: 'Only PDF and TXT files are supported',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Resume uploaded and parsed successfully',
        data: {
          fileName: file.originalname,
          fileSize: file.size,
          resumeText,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new ResumeController();
