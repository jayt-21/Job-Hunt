import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { jsPDF } from 'jspdf';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..');
const sourcePath = path.join(rootDir, 'jobhuntinterview.md');
const outputPath = path.join(rootDir, 'jobhuntinterview.pdf');

const markdown = fs.readFileSync(sourcePath, 'utf8');
const pdf = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4',
});

const pageWidth = pdf.internal.pageSize.getWidth();
const pageHeight = pdf.internal.pageSize.getHeight();
const margin = 15;
const maxWidth = pageWidth - margin * 2;
const lineHeight = 5;
let y = margin;
let inCodeBlock = false;

const normalizeText = (text) =>
  text
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/[•]/g, '-')
    .replace(/[✓]/g, '[OK]')
    .replace(/[✗]/g, '[X]')
    .replace(/[□]/g, '[ ]');

const ensureSpace = (needed = lineHeight) => {
  if (y + needed > pageHeight - margin) {
    pdf.addPage();
    y = margin;
  }
};

const addWrappedText = (text, options = {}) => {
  const {
    fontSize = 11,
    bold = false,
    indent = 0,
    gapAfter = 1.5,
  } = options;

  pdf.setFont('helvetica', bold ? 'bold' : 'normal');
  pdf.setFontSize(fontSize);
  const wrapped = pdf.splitTextToSize(normalizeText(text), maxWidth - indent);

  wrapped.forEach((line) => {
    ensureSpace();
    pdf.text(line, margin + indent, y);
    y += lineHeight;
  });

  y += gapAfter;
};

const addCodeLine = (text) => {
  pdf.setFont('courier', 'normal');
  pdf.setFontSize(9);
  const wrapped = pdf.splitTextToSize(normalizeText(text), maxWidth - 4);

  wrapped.forEach((line) => {
    ensureSpace();
    pdf.text(line, margin + 2, y);
    y += 4.2;
  });

  y += 1;
};

const lines = markdown.split(/\r?\n/);

lines.forEach((rawLine) => {
  const line = rawLine.trimEnd();

  if (line.startsWith('```')) {
    inCodeBlock = !inCodeBlock;
    y += 2;
    return;
  }

  if (inCodeBlock) {
    if (!line.trim()) {
      y += 2;
      return;
    }
    addCodeLine(line);
    return;
  }

  if (!line.trim()) {
    y += 2;
    return;
  }

  if (line.startsWith('# ')) {
    y += 2;
    addWrappedText(line.slice(2), { fontSize: 18, bold: true, gapAfter: 3 });
    return;
  }

  if (line.startsWith('## ')) {
    y += 2;
    addWrappedText(line.slice(3), { fontSize: 15, bold: true, gapAfter: 2 });
    return;
  }

  if (line.startsWith('### ')) {
    addWrappedText(line.slice(4), { fontSize: 12, bold: true, gapAfter: 1 });
    return;
  }

  if (line.startsWith('- ')) {
    addWrappedText(`- ${line.slice(2)}`, { fontSize: 10.5, indent: 2, gapAfter: 0.5 });
    return;
  }

  addWrappedText(line, { fontSize: 10.5, gapAfter: 0.7 });
});

const totalPages = pdf.getNumberOfPages();
for (let i = 1; i <= totalPages; i += 1) {
  pdf.setPage(i);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 18, pageHeight - 6);
}

pdf.save(outputPath);
console.log(`Created ${outputPath}`);
