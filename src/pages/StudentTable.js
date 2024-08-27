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
          initialRemarks[student._id] = student.remarks || '';
          student.subjects.forEach((subject, subjectIndex) => {
            initialMarks[`${student._id}-${subjectIndex}`] = subject.marks || '';
            initialGrades[`${student._id}-${subjectIndex}`] = subject.grade || '';
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

  const handleRemarksChange = (id, value) => {
    setRemarks(prevRemarks => ({
      ...prevRemarks,
      [id]: value,
    }));
  };

  const handleMarksChange = (studentId, subjectIndex, value) => {
    setMarks(prevMarks => ({
      ...prevMarks,
      [`${studentId}-${subjectIndex}`]: value,
    }));
  };

  const handleGradesChange = (studentId, subjectIndex, value) => {
    setGrades(prevGrades => ({
      ...prevGrades,
      [`${studentId}-${subjectIndex}`]: value,
    }));
  };

  const handleSubmit = () => {
    const currentStudents = students.slice(currentBatch * 3, currentBatch * 3 + 3);

    const updatePromises = currentStudents.map(student => {
      const updatedSubjects = student.subjects.map((subject, subjectIndex) => ({
        ...subject,
        marks: marks[`${student._id}-${subjectIndex}`] || subject.marks,
        grade: grades[`${student._id}-${subjectIndex}`] || subject.grade,
      }));

      console.log("Updating Subjects for student ID:", student._id, updatedSubjects);
      console.log("Remarks for this student:", remarks[student._id]);

      return axios.post(`/StudentDatas/${student._id}/remarks`, {
        remarks: remarks[student._id] || '',
        subjects: updatedSubjects,
      })
      .then(response => {
        console.log('Uploaded for student ID:', student._id, response.data);
        return response.data;
      })
      .catch(error => {
        console.error('Error uploading data for student ID:', student._id, error.response ? error.response.data : error.message);
        throw error; // Ensure errors are propagated
      });
    });

    Promise.all(updatePromises)
      .then(results => {
        console.log('All student data updated successfully:', results);
      })
      .catch(error => {
        console.error('Error updating some student data:', error);
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
      <h1 className="text-3xl font-bold mb-6 text-orange-400 text-center">Student Report Cards Generator</h1>
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
            {currentStudents.map(student => (
              <tr key={student._id} className="hover:bg-gray-100 transition-all duration-200 ease-in-out">
                <td className="border border-gray-300 px-6 py-4">{student.name}</td>
                <td className="border border-gray-300 px-6 py-4">{student.rollNo}</td>
                <td className="border border-gray-300 px-6 py-4">{student.class}</td>
                <td className="border border-gray-300 px-6 py-4">{student.section}</td>
                <td className="border border-gray-300 px-6 py-4">{new Date(student.dob).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-6 py-4">
                  <input
                    type="text"
                    value={remarks[student._id] || ''}
                    onChange={(e) => handleRemarksChange(student._id, e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="border border-gray-300 px-6 py-4">
                  {student.subjects.map((subject, subjectIndex) => (
                    <div key={subjectIndex} className="mb-2">
                      <div className="flex items-center justify-between">
                        <span>{subject.name}</span>
                        <input
                          type="number"
                          value={marks[`${student._id}-${subjectIndex}`] || subject.marks}
                          onChange={(e) => handleMarksChange(student._id, subjectIndex, e.target.value)}
                          className="border rounded-lg px-2 py-1 w-20"
                        />
                        <input
                          type="text"
                          value={grades[`${student._id}-${subjectIndex}`] || subject.grade}
                          onChange={(e) => handleGradesChange(student._id, subjectIndex, e.target.value)}
                          className="border rounded-lg px-2 py-1 w-20"
                        />
                      </div>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mt-4">
        <button onClick={handlePreviousBatch} disabled={currentBatch === 0} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Previous
        </button>
        <button onClick={handleNextBatch} disabled={(currentBatch + 1) * 3 >= students.length} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Next
        </button>
      </div>
      <div className="mt-4">
        <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
          Update results for this batch
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
