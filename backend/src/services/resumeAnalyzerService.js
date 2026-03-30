const fs = require('fs');
const path = require('path');
const pdfExtract = require('pdf-text-extract');

class ResumeAnalyzerService {
  // Keyword database for different job roles
  keywordDatabase = {
    'software engineer': [
      'javascript',
      'python',
      'react',
      'nodejs',
      'mongodb',
      'aws',
      'git',
      'restapi',
      'sql',
      'algorithms',
    ],
    'data scientist': [
      'python',
      'pandas',
      'sklearn',
      'tensorflow',
      'tableau',
      'sql',
      'statistics',
      'machine learning',
      'deep learning',
      'data analysis',
    ],
    'product manager': [
      'agile',
      'scrum',
      'product roadmap',
      'analytics',
      'user research',
      'wireframing',
      'a/b testing',
      'metrics',
      'stakeholder management',
      'roadmap',
    ],
    'devops engineer': [
      'kubernetes',
      'docker',
      'ci/cd',
      'jenkins',
      'aws',
      'terraform',
      'ansible',
      'linux',
      'monitoring',
      'prometheus',
    ],
  };

  // Extract text from PDF (using pdf-text-extract library)
  async extractTextFromPDF(pdfBuffer) {
    return new Promise((resolve, reject) => {
      try {
        // Create a temporary file path
        const tempFilePath = path.join(__dirname, `..`, `..`, `temp_${Date.now()}.pdf`);
        
        // Write buffer to temporary file
        fs.writeFileSync(tempFilePath, pdfBuffer);
        
        // Extract text from PDF
        pdfExtract(tempFilePath, {}, (err, pages) => {
          // Clean up temporary file
          try {
            fs.unlinkSync(tempFilePath);
          } catch (cleanupErr) {
            console.error('Failed to cleanup temp file:', cleanupErr.message);
          }

          if (err) {
            return reject(new Error('Failed to extract text from PDF: ' + err.message));
          }

          // pages is an array of text from each page
          if (pages && Array.isArray(pages)) {
            const combinedText = pages.join('\n');
            resolve(combinedText);
          } else {
            reject(new Error('Unable to extract text from PDF - unexpected response format'));
          }
        });
      } catch (error) {
        reject(new Error('Failed to extract text from PDF: ' + error.message));
      }
    });
  }

  // Calculate ATS score based on keyword matching
  calculateATSScore(resumeText, jobDescription) {
    const resumeLower = resumeText.toLowerCase();
    const jobLower = jobDescription.toLowerCase();

    // Extract keywords from job description
    const jobKeywords = this.extractKeywords(jobLower);

    // Count matches
    let matchCount = 0;
    jobKeywords.forEach(keyword => {
      if (resumeLower.includes(keyword)) {
        matchCount++;
      }
    });

    // Calculate score (0-100)
    const score =
      jobKeywords.length > 0
        ? Math.min(100, (matchCount / jobKeywords.length) * 100)
        : 0;

    return {
      score: Math.round(score),
      matchCount,
      totalKeywords: jobKeywords.length,
      matchedKeywords: jobKeywords.filter(kw =>
        resumeLower.includes(kw)
      ),
      missingKeywords: jobKeywords.filter(kw => !resumeLower.includes(kw)),
    };
  }

  // Extract important keywords from text
  extractKeywords(text) {
    const commonWords = new Set([
      'the',
      'a',
      'an',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'with',
      'by',
      'from',
      'is',
      'are',
      'was',
      'were',
      'be',
      'been',
      'being',
      'have',
      'has',
      'had',
      'do',
      'does',
      'did',
      'will',
      'would',
      'could',
      'should',
      'may',
      'might',
      'must',
      'can',
      'this',
      'that',
      'these',
      'those',
    ]);

    const words = text
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.has(word));

    return [...new Set(words)];
  }

  // Generate improvement suggestions
  generateSuggestions(score, missingKeywords, matchedKeywords) {
    const suggestions = [];

    if (score < 50) {
      suggestions.push(
        'Significant improvements needed. Focus on adding relevant keywords and skills to your resume.'
      );
    } else if (score < 75) {
      suggestions.push(
        'Good match, but you could strengthen your resume by highlighting more relevant skills.'
      );
    }

    if (missingKeywords.length > 0) {
      suggestions.push(
        `Consider adding the following missing keywords: ${missingKeywords.slice(0, 5).join(', ')}`
      );
    }

    if (matchedKeywords.length > 0) {
      suggestions.push(
        `Great! Your resume successfully highlights: ${matchedKeywords.slice(0, 5).join(', ')}`
      );
    }

    if (score >= 75) {
      suggestions.push('Your resume is well-optimized for this job description!');
    }

    return suggestions;
  }

  // Main analysis function
  analyzeResume(resumeText, jobDescription) {
    const atsScore = this.calculateATSScore(resumeText, jobDescription);
    const suggestions = this.generateSuggestions(
      atsScore.score,
      atsScore.missingKeywords,
      atsScore.matchedKeywords
    );

    return {
      atsScore: atsScore.score,
      analysis: {
        totalKeywordsInJob: atsScore.totalKeywords,
        matchedKeywords: atsScore.matchCount,
        matchPercentage: atsScore.score,
        matchedTerms: atsScore.matchedKeywords,
        missingTerms: atsScore.missingKeywords,
      },
      suggestions,
      timestamp: new Date(),
    };
  }

  // Generate optimized resume based on job description
  optimizeResume(resumeText, jobDescription) {
    const atsScore = this.calculateATSScore(resumeText, jobDescription);
    const { missingKeywords, matchedKeywords } = atsScore;

    // Parse resume into sections
    const sections = this.parseResumeSections(resumeText);

    // Generate optimization suggestions
    const optimizationSteps = this.generateOptimizationSteps(
      sections,
      missingKeywords,
      matchedKeywords
    );

    // Generate sample optimized sections
    const sampleOptimizations = this.generateSampleOptimizations(
      sections,
      missingKeywords
    );

    // Create optimized resume text with insertions
    const optimizedResume = this.createOptimizedResume(
      resumeText,
      missingKeywords
    );

    return {
      originalAtsScore: atsScore.score,
      optimizationSteps,
      sampleOptimizations,
      optimizedResume,
      potentialScoreIncrease: Math.min(
        100 - atsScore.score,
        missingKeywords.length * 5
      ),
      missingKeywordsCount: missingKeywords.length,
      suggestions: [
        ...optimizationSteps,
        `By implementing these changes, you could potentially increase your ATS score to ${Math.min(100, atsScore.score + Math.min(100 - atsScore.score, missingKeywords.length * 5))}`,
      ],
    };
  }

  // Parse resume into major sections
  parseResumeSections(resumeText) {
    const sections = {
      summary: '',
      experience: '',
      skills: '',
      education: '',
      other: '',
    };

    const lines = resumeText.split('\n');
    let currentSection = 'other';

    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      if (
        lowerLine.includes('summary') ||
        lowerLine.includes('objective') ||
        lowerLine.includes('profile')
      ) {
        currentSection = 'summary';
      } else if (
        lowerLine.includes('experience') ||
        lowerLine.includes('employment') ||
        lowerLine.includes('work history')
      ) {
        currentSection = 'experience';
      } else if (lowerLine.includes('skill')) {
        currentSection = 'skills';
      } else if (lowerLine.includes('education')) {
        currentSection = 'education';
      }

      sections[currentSection] += line + '\n';
    });

    return sections;
  }

  // Generate step-by-step optimization instructions
  generateOptimizationSteps(sections, missingKeywords, matchedKeywords) {
    const steps = [];

    if (missingKeywords.length > 5) {
      steps.push(
        `1. Create a "Core Skills" section and include: ${missingKeywords.slice(0, 5).join(', ')}`
      );
    }

    if (missingKeywords.length > 0) {
      steps.push(
        `2. In your Experience section, add action verbs with these keywords: ${missingKeywords.slice(5, 8).join(', ')}`
      );
    }

    if (sections.summary && sections.summary.length < 100) {
      steps.push(
        '3. Expand your Professional Summary to include key skills and achievements'
      );
    }

    if (matchedKeywords.length > 0) {
      steps.push(
        `4. Emphasize your matched skills: ${matchedKeywords.slice(0, 3).join(', ')} by quantifying achievements`
      );
    }

    steps.push(
      '5. Use specific metrics and numbers in your achievements (e.g., "Increased X by Y%")'
    );

    return steps;
  }

  // Generate sample optimized sections
  generateSampleOptimizations(sections, missingKeywords) {
    const samples = {};

    if (missingKeywords.length > 0) {
      const topMissing = missingKeywords.slice(0, 5);
      samples.skillsSection = `TECHNICAL SKILLS
${topMissing.map(kw => `• ${kw.charAt(0).toUpperCase() + kw.slice(1)}`).join('\n')}
[Add more specific tools and technologies from the job description]`;
    }

    if (sections.experience && sections.experience.length > 20) {
      const topMissing = missingKeywords.slice(0, 3);
      samples.experienceBullet = `BEFORE: "Managed projects and worked with various technologies"
AFTER: "Led cross-functional teams using ${topMissing.join(', ')} to deliver mission-critical features, resulting in 40% improvement in system performance"`;
    }

    samples.summarySection = `PROFESSIONAL SUMMARY
Results-driven professional with expertise in ${missingKeywords.slice(0, 2).join(' and ')}. Proven track record of [specific achievement]. Seeking to leverage [key skills] to drive business impact.`;

    return samples;
  }

  // Create optimized resume with keyword insertions
  createOptimizedResume(resumeText, missingKeywords) {
    let optimized = resumeText;

    // Add top missing keywords as suggestions within the text
    const topMissing = missingKeywords.slice(0, 5);

    // Find experience section and enhance it
    const experienceMatch = optimized.match(
      /experience[\s\S]*?(?=\n[A-Z]|$)/i
    );
    if (experienceMatch) {
      const experienceSection = experienceMatch[0];
      const enhanced =
        experienceSection +
        `\n[SUGGESTED ADDITION: Incorporate ${topMissing.join(', ')} into your bullet points to improve ATS matching]`;
      optimized = optimized.replace(experienceSection, enhanced);
    }

    // Add skills section if missing
    if (!optimized.toLowerCase().includes('skills')) {
      optimized += `\n\nSKILLS (RECOMMENDED ADDITIONS)\n${topMissing.map(kw => `• ${kw}`).join('\n')}`;
    }

    return optimized;
  }
}

module.exports = new ResumeAnalyzerService();
