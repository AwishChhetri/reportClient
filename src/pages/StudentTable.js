// src/components/StudentTable.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DownloadReportCards from './DownloadReportCards';

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [remarks, setRemarks] = useState({});
  const [marks, setMarks] = useState({});
  const [grades, setGrades] = useState({});

  useEffect(() => {
    axios.get('/StudentDatas')
      .then(response => {
        setStudents(response.data);
        const initialRemarks = {};
        const initialMarks = {};
        const initialGrades = {};

        response.data.forEach((student, studentIndex) => {
          initialRemarks[studentIndex] = student.remarks || '';
          student.subjects.forEach((subject, subjectIndex) => {
            initialMarks[`${studentIndex}-${subjectIndex}`] = subject.marks || '';
            initialGrades[`${studentIndex}-${subjectIndex}`] = subject.grade || '';
          });
        });

        setRemarks(initialRemarks);
        setMarks(initialMarks);
        setGrades(initialGrades);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
      });
  }, []);

  const handleRemarksChange = (index, value) => {
    setRemarks({
      ...remarks,
      [index]: value,
    });
  };

  const handleMarksChange = (subjectIndex, studentIndex, value) => {
    setMarks({
      ...marks,
      [`${studentIndex}-${subjectIndex}`]: value,
    });
  };

  const handleGradesChange = (subjectIndex, studentIndex, value) => {
    setGrades({
      ...grades,
      [`${studentIndex}-${subjectIndex}`]: value,
    });
  };

  const handleSubmit = () => {
    const currentStudents = students.slice(currentBatch * 3, currentBatch * 3 + 3);
    currentStudents.forEach((student, studentIndex) => {
      const updatedSubjects = student.subjects.map((subject, subjectIndex) => ({
        ...subject,
        marks: marks[`${studentIndex}-${subjectIndex}`] || subject.marks,
        grade: grades[`${studentIndex}-${subjectIndex}`] || subject.grade,
      }));
      
      axios.post(`/StudentDatas/${student._id}/remarks`, {
        remarks: remarks[studentIndex] || '',
        subjects: updatedSubjects,
      })
      .then(response => {
        console.log('Uploaded:', response.data);
      })
      .catch(error => {
        console.error('Error uploading data:', error);
      });
    });
  };

  const handleNextBatch = () => {
    if ((currentBatch + 1) * 3 < students.length) {
      setCurrentBatch(currentBatch + 1);
    }
  };

  const handlePreviousBatch = () => {
    if (currentBatch > 0) {
      setCurrentBatch(currentBatch - 1);
    }
  };

  const currentStudents = students.slice(currentBatch * 3, currentBatch * 3 + 3);

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
    <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Student Report Card</h1>
    <div className="overflow-x-auto mx-auto max-w-full">
      <table className="table-auto w-full max-w-6xl mx-auto border-collapse bg-gray-50 rounded-lg overflow-hidden shadow-sm">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="border border-gray-300 px-6 py-3">Name</th>
            <th className="border border-gray-300 px-6 py-3">Roll No</th>
            <th className="border border-gray-300 px-6 py-3">Class</th>
            <th className="border border-gray-300 px-6 py-3">Section</th>
            <th className="border border-gray-300 px-6 py-3">Date of Birth</th>
            <th className="border border-gray-300 px-6 py-3">Remarks</th>
            <th className="border border-gray-300 px-6 py-3">Subjects & Marks</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map((student, studentIndex) => (
            <tr key={student._id} className="hover:bg-gray-100 transition-all duration-200 ease-in-out">
              <td className="border border-gray-300 px-6 py-4">{student.name}</td>
              <td className="border border-gray-300 px-6 py-4">{student.rollNo}</td>
              <td className="border border-gray-300 px-6 py-4">{student.class}</td>
              <td className="border border-gray-300 px-6 py-4">{student.section}</td>
              <td className="border border-gray-300 px-6 py-4">{new Date(student.dob).toLocaleDateString()}</td>
              <td className="border border-gray-300 px-6 py-4">
                <input
                  type="text"
                  value={remarks[studentIndex] || ''}
                  onChange={(e) => handleRemarksChange(studentIndex, e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Not filled"
                />
              </td>
              <td className="border border-gray-300 px-6 py-4">
                {student.subjects.map((subject, subjectIndex) => (
                  <div key={subjectIndex} className="mb-4">
                    <div className="font-semibold text-gray-700">{subject.name}</div>
                    <input
                      type="number"
                      value={marks[`${studentIndex}-${subjectIndex}`] || ''}
                      onChange={(e) => handleMarksChange(subjectIndex, studentIndex, e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Marks"
                    />
                    <input
                      type="text"
                      value={grades[`${studentIndex}-${subjectIndex}`] || ''}
                      onChange={(e) => handleGradesChange(subjectIndex, studentIndex, e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Grade"
                    />
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="flex justify-between mt-6">
      <button
        onClick={handlePreviousBatch}
        className="bg-blue-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 transition duration-300"
        disabled={currentBatch === 0}
      >
        Previous
      </button>
      <button
        onClick={handleNextBatch}
        className="bg-blue-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 transition duration-300"
        disabled={(currentBatch + 1) * 3 >= students.length}
      >
        Next
      </button>
    </div>
    <div className="mt-6 flex justify-between">
      <button
        onClick={handleSubmit}
        className="bg-purple-300 text-white px-5 py-3 rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
      >
        Upload Data for Current Batch
      </button>
     
    </div>
    <DownloadReportCards
      students={students}
      currentBatch={currentBatch}
      remarks={remarks}
      marks={marks}
      grades={grades}
    />
  </div>
  
  
  );
};

export default StudentTable;
