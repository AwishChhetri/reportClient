import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const DownloadReportCards = ({ students, currentBatch, remarks, marks, grades }) => {
  const handleDownloadReportCards = () => {
    const currentStudents = students.slice(currentBatch * 3, currentBatch * 3 + 3);

    currentStudents.forEach((student, studentIndex) => {
      const doc = new jsPDF();

      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');  // Set font to bold
      doc.setTextColor(0, 102, 204);  // Set color to blue
      doc.text('Mount Carmel School', 105, 20, null, null, 'center');


      // Add Report Card Title
      doc.setFontSize(18);
      doc.setTextColor(0);
      doc.text(`Report Card for ${student.name}`, 105, 30, null, null, 'center');

      // Student Details
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Roll No: ${student.rollNo}`, 14, 40);
      doc.text(`Class: ${student.class}`, 14, 50);
      doc.text(`Section: ${student.section}`, 14, 60);
      doc.text(`Date of Birth: ${new Date(student.dob).toLocaleDateString()}`, 14, 70);

      // Remarks Section
      doc.text(`Remarks: ${remarks[studentIndex] || 'Not filled'}`, 14, 80);

      // Adding Static Data as an example
      doc.text('Teacher: Abish Chhetri', 105, 50, null, null, 'center');
      doc.text('School Year: 2023-2024', 105, 60, null, null, 'center');

      // Subjects and Marks Table
      const subjects = student.subjects.map((subject, subjectIndex) => ({
        Subject: subject.name,
        Marks: marks[`${studentIndex}-${subjectIndex}`] || subject.marks || 'Not filled',
        Grade: grades[`${studentIndex}-${subjectIndex}`] || subject.grade || 'Not filled',
      }));

      autoTable(doc, {
        startY: 90,
        head: [['Subject', 'Marks', 'Grade']],
        body: subjects.map(sub => [sub.Subject, sub.Marks, sub.Grade]),
      });

      // Footer Section
      doc.setFontSize(10);
      doc.text('Principal Signature: _____________________', 14, doc.autoTable.previous.finalY + 20);
      doc.text('Date: _______________', 160, doc.autoTable.previous.finalY + 20);

      // Trigger download for each student
      doc.save(`Report_Card_${student.name}.pdf`);
    });
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleDownloadReportCards}
        className="bg-purple-500 text-white px-4 py-2 rounded shadow-lg hover:bg-purple-700 transition duration-300"
      >
        Download Report Cards
      </button>
    </div>
  );
};

export default DownloadReportCards;
