// src/components/DownloadReportCards.js

import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const DownloadReportCards = ({ students, currentBatch, remarks, marks, grades }) => {
  const handleDownloadReportCards = () => {
    const currentStudents = students.slice(currentBatch * 3, currentBatch * 3 + 3);

    currentStudents.forEach((student, studentIndex) => {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text(`Report Card for ${student.name}`, 14, 20);

      doc.setFontSize(12);
      doc.text(`Roll No: ${student.rollNo}`, 14, 30);
      doc.text(`Class: ${student.class}`, 14, 40);
      doc.text(`Section: ${student.section}`, 14, 50);
      doc.text(`Date of Birth: ${new Date(student.dob).toLocaleDateString()}`, 14, 60);
      doc.text(`Remarks: ${remarks[studentIndex] || 'Not filled'}`, 14, 70);

      const subjects = student.subjects.map((subject, subjectIndex) => ({
        Subject: subject.name,
        Marks: marks[`${studentIndex}-${subjectIndex}`] || subject.marks || 'Not filled',
        Grade: grades[`${studentIndex}-${subjectIndex}`] || subject.grade || 'Not filled',
      }));

      autoTable(doc, {
        startY: 80,
        head: [['Subject', 'Marks', 'Grade']],
        body: subjects.map(sub => [sub.Subject, sub.Marks, sub.Grade]),
      });

      // Trigger download for each student
      doc.save(`Report_Card_${student.name}.pdf`);
    });
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleDownloadReportCards}
        className="bg-purple-500 text-white px-4 py-2 rounded"
      >
        Download Report Cards
      </button>
    </div>
  );
};

export default DownloadReportCards;
