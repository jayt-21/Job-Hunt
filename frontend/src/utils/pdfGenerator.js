import jsPDF from 'jspdf';

export const generateResumePDF = (resumeContent, analysisData, optimizationData) => {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 12;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = margin;
    const lineHeight = 5;
    const sectionGap = 8;

    // Helper function to add text with automatic page breaks
    const addText = (text, options = {}) => {
      const { fontSize = 10, isBold = false, isTitle = false } = options;
      
      if (yPosition > pageHeight - margin - 10) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(fontSize);
      pdf.setFont(undefined, isBold ? 'bold' : 'normal');
      
      if (isTitle) {
        pdf.setTextColor(25, 25, 112); // Dark blue for titles
      } else {
        pdf.setTextColor(0, 0, 0);
      }

      const lines = pdf.splitTextToSize(text, maxWidth);
      lines.forEach((line) => {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });

      return yPosition;
    };

    // Add header
    pdf.setFontSize(20);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(25, 25, 112);
    pdf.text('OPTIMIZED RESUME', margin, yPosition);
    yPosition += 12;

    // Add metadata
    pdf.setFontSize(8);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(128, 128, 128);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Current ATS Score: ${analysisData?.atsScore || 'N/A'}/100`, margin, yPosition);
    yPosition += 8;

    // Add ATS Score Section
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(25, 25, 112);
    pdf.text('ATS SCORE ANALYSIS', margin, yPosition);
    yPosition += 6;

    pdf.setFontSize(9);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(0, 0, 0);
    
    if (analysisData) {
      pdf.text(`Current Score: ${analysisData.atsScore}`, margin + 3, yPosition);
      yPosition += 5;
      pdf.text(`Keywords Matched: ${analysisData.analysis?.matchedTerms?.length || 0}/${analysisData.analysis?.totalKeywordsInJob || 0}`, margin + 3, yPosition);
      yPosition += 5;
      pdf.text(`Match Percentage: ${(analysisData.analysis?.matchPercentage || 0).toFixed(1)}%`, margin + 3, yPosition);
      yPosition += 8;
    }

    // Add optimization insights
    if (optimizationData) {
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(25, 25, 112);
      pdf.text('OPTIMIZATION INSIGHTS', margin, yPosition);
      yPosition += 6;

      pdf.setFontSize(9);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(0, 0, 0);
      
      pdf.text(`Potential Score Increase: +${optimizationData.potentialScoreIncrease}`, margin + 3, yPosition);
      yPosition += 5;
      pdf.text(`New Potential Score: ${Math.min(100, (analysisData?.atsScore || 0) + optimizationData.potentialScoreIncrease)}`, margin + 3, yPosition);
      yPosition += 5;
      pdf.text(`Missing Keywords to Add: ${optimizationData.missingKeywordsCount}`, margin + 3, yPosition);
      yPosition += 8;

      // Add optimization steps if available
      if (optimizationData.optimizationSteps && optimizationData.optimizationSteps.length > 0) {
        pdf.setFontSize(11);
        pdf.setFont(undefined, 'bold');
        pdf.setTextColor(25, 25, 112);
        pdf.text('OPTIMIZATION STEPS', margin, yPosition);
        yPosition += 6;

        pdf.setFontSize(8);
        pdf.setFont(undefined, 'normal');
        pdf.setTextColor(0, 0, 0);
        
        optimizationData.optimizationSteps.forEach((step, idx) => {
          const stepLines = pdf.splitTextToSize(`${idx + 1}. ${step}`, maxWidth - 3);
          stepLines.forEach((line) => {
            if (yPosition > pageHeight - margin) {
              pdf.addPage();
              yPosition = margin;
            }
            pdf.text(line, margin + 2, yPosition);
            yPosition += lineHeight;
          });
          yPosition += 2;
        });
        yPosition += 4;
      }
    }

    // Add optimized resume content
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(25, 25, 112);
    if (yPosition > pageHeight - margin - 15) {
      pdf.addPage();
      yPosition = margin;
    }
    pdf.text('OPTIMIZED RESUME CONTENT', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(9);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(0, 0, 0);
    
    const resumeLines = pdf.splitTextToSize(resumeContent, maxWidth);
    resumeLines.forEach((line) => {
      if (yPosition > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin, yPosition);
      yPosition += lineHeight;
    });

    // Add footer on last page
    yPosition += 8;
    if (yPosition > pageHeight - 15) {
      pdf.addPage();
      yPosition = margin;
    }
    
    pdf.setFontSize(8);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(128, 128, 128);
    pdf.text('💡 Tips: Use this optimized resume as a reference. Update your actual resume with the suggested keywords and improvements.', margin + 2, yPosition);

    return pdf;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};

export const downloadPDF = (pdf, filename = 'optimized_resume.pdf') => {
  try {
    pdf.save(filename);
  } catch (error) {
    console.error('PDF download error:', error);
    throw new Error(`Failed to download PDF: ${error.message}`);
  }
};
