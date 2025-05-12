import React, { useState, useEffect } from 'react';
import {FaSearch} from 'react-icons/fa';
import { jsPDF } from "jspdf";  // Import jsPDF
import './AdmPef.css';

const AdmPef = () => {
  // -----------------------------
  // STATES FOR STUDENT DATA
  // -----------------------------

  // Holds the fetched student information
  const [studentInfo, setStudentInfo] = useState(null);

  // Holds the evaluation data (past subjects & grades)
  const [subjectEvaluations, setSubjectEvaluations] = useState([]);

  // -----------------------------
  // STATES FOR ENROLLMENT PROCESS
  // -----------------------------

  // List of available subjects for enrollment
  const [enrollmentOptions, setEnrollmentOptions] = useState([]);

  // Tracks selected subjects to enroll
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  // Total units selected by the student
  const [totalSelectedUnits, setTotalSelectedUnits] = useState(0);

  // -----------------------------
  // STATE FOR SCHOLARSHIP RECOMMENDATION
  // -----------------------------

  const [selectedScholarship, setSelectedScholarship] = useState(null);

  // Scholarship options in percentage
  const scholarshipOptions = [25, 50, 75, 100];

  const [searchStudentID, setSearchStudentID] = useState('');

  // -----------------------------
  // FETCH STUDENT + EVALUATION DATA
  // -----------------------------

  const handleSearch = async () => {
    if (!searchStudentID) {
      alert("Please enter a student ID.");
      return;
    }

    try {
      const response = await fetch(`http://your-api.com/students/${searchStudentID}/pef`);
      if (!response.ok) throw new Error('Failed to fetch PEF data');

      const data = await response.json();
      setStudentInfo(data.student);
      setSubjectEvaluations(data.evaluation);
      setEnrollmentOptions(data.enrollSubjects);
      setSelectedSubjects([]);
      setTotalSelectedUnits(0);
    } catch (err) {
      console.error('Error fetching student data:', err);
      alert("Student data could not be retrieved.");
    }
  };

  // -----------------------------
  // DETERMINE SCHOLARSHIP QUALIFICATION
  // -----------------------------

  const getScholarshipRemark = (gwaValue) => {
    if (gwaValue >= 1.0 && gwaValue <= 1.25) return { percentage: 100, remark: "Full scholarship (President’s Lister)" };
    if (gwaValue > 1.25 && gwaValue <= 1.5) return { percentage: 75, remark: "High academic achiever" };
    if (gwaValue > 1.5 && gwaValue <= 1.75) return { percentage: 50, remark: "Academic achiever" };
    if (gwaValue > 1.75 && gwaValue <= 2.0) return { percentage: 25, remark: "Qualified scholar" };
    return { percentage: 0, remark: "No scholarship" };
  };

  // -----------------------------
  // HANDLE SUBJECT SELECTION FOR ENROLLMENT
  // -----------------------------

  const handleSelectSubject = (subject) => {
    const maxUnits = studentInfo.year === 4 ? 30 : 24;
    const newTotal = totalSelectedUnits + subject.units;

    // Prevent overloading units
    if (newTotal <= maxUnits) {
      setSelectedSubjects([...selectedSubjects, subject]);
      setTotalSelectedUnits(newTotal);
    } else {
      alert(`You cannot select more than ${maxUnits} units.`);
    }
  };

  // Remove subject from selection list
  const handleDeselectSubject = (subject) => {
    const updatedSubjects = selectedSubjects.filter(s => s.subjectCode !== subject.subjectCode);
    setSelectedSubjects(updatedSubjects);

    // Recalculate total units
    const updatedTotal = updatedSubjects.reduce((sum, curr) => sum + curr.units, 0);
    setTotalSelectedUnits(updatedTotal);
  };

  // -----------------------------
  // GENERATE PDF FUNCTION
  // -----------------------------

  const generatePDF = () => {
    const doc = new jsPDF();
    const selectedSubjectsList = selectedSubjects.map(subject => `${subject.subjectName} (${subject.units} units)`).join('\n');
    
    doc.setFontSize(12);
    doc.text('Student Enrollment Summary', 20, 20);
    
    doc.text(`Student Name: ${studentInfo?.name}`, 20, 30);
    doc.text(`Student ID: ${studentInfo?.id}`, 20, 40);
    doc.text(`General Weighted Average (GWA): ${studentInfo?.gwa?.value.toFixed(2)}`, 20, 50);
    doc.text(`Academic Standing: ${studentInfo?.gwa?.standing}`, 20, 60);
    
    doc.text(`Total Units Selected: ${totalSelectedUnits}`, 20, 70);
    doc.text('Selected Subjects:', 20, 80);
    doc.text(selectedSubjectsList, 20, 90);
    
    doc.text(`Scholarship Recommendation: ${getScholarshipRemark(studentInfo?.gwa?.value).remark}`, 20, 110);
    
      // Sanitize name for file name (remove special characters and spaces)
    const safeName = studentInfo?.name?.replace(/[^a-z0-9]/gi, '_') || 'student';
    doc.save(`${safeName}_enrollment_summary.pdf`);
  };

  return (
    <div className="adm-pef-main">

      {/* ======================== */}
      {/* SEARCH BAR + HEADER INFO */}
      {/* ======================== */}
      <div className="student-search-container">
        <div className="top-bar">
          <input
            type="text"
            className="student-id-input"
            placeholder="Student ID..."
            value={searchStudentID}
            onChange={(e) => setSearchStudentID(e.target.value)}
          />
          <button className="search-btn" onClick={handleSearch}><FaSearch /></button>
        </div>
        <div className="info-bar">
          <span>2nd Year Student Level</span>
          <span>1st Semester S.Y 2024-2025</span>
        </div>
      </div>

      <div className="adm-pef-main-container">

        {/* ======================== */}
        {/* STUDENT PROFILE CARD     */}
        {/* ======================== */}
        {studentInfo && (
          <div className="student-card">
            <header className="student-label">Student's Name</header>
            <h1 className="student-name">{studentInfo.name}</h1>
            <p className="student-id">{studentInfo.id}</p>
            <section className="student-details">
              <p>{studentInfo.college}</p>
              <p className="student-course">{studentInfo.course}</p>
            </section>
          </div>
        )}

        {/* ======================== */}
        {/* EVALUATION TABLE         */}
        {/* ======================== */}
        <div className="evaluation-container">
          <h2 className="evaluation-title">EVALUATION</h2>
          <div className="evaluation-header">
            <span>1st Semester</span>
            <span>2024-2025</span>
          </div>
          <table className="evaluation-table">
            <thead>
              <tr>
                <th className='sub-code1'>Sub. Code</th>
                <th>Subject Title</th>
                <th>Credit(s)</th>
                <th>Final Grade</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {subjectEvaluations.map((subject, index) => (
                <tr key={index}>
                  <td className='sub-code'>{subject.code}</td>
                  <td>{subject.title}</td>
                  <td>{subject.credits}</td>
                  <td>{subject.grade.toFixed(2)}</td>
                  <td className="remarks">{subject.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ======================== */}
        {/* GWA + ACADEMIC STANDING */}
        {/* ======================== */}
        {studentInfo?.gwa && (
          <div className="gwa-container">
            <table className="gwa-table">
              <tbody>
                <tr>
                  <td className="label">GENERAL WEIGHTED AVERAGE (GWA) :</td>
                  <td className="value highlight">{studentInfo.gwa.value.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="label">ACADEMIC STANDING (GS OR WS) :</td>
                  <td className="value">{studentInfo.gwa.standing}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* ======================== */}
        {/* APPROVAL STATUS (Read-only) */}
        {/* ======================== */}
        <div className="approval">
          <label className="radio-option">
            <input type="radio" name="approval" value="approve" checked={studentInfo?.gwa && studentInfo.gwa.value <= 3.0} disabled />
            <span className="radio-label">Approve</span>
          </label>
          <label className="radio-option">
            <input type="radio" name="approval" value="decline" checked={studentInfo?.gwa && studentInfo.gwa.value > 3.0} disabled />
            <span className="radio-label">Decline</span>
          </label>
        </div>

        {/* ======================== */}
        {/* AWARDS + SCHOLARSHIP */}
        {/* ======================== */}
        <div className="awards-container">
          <div className="row">
            <span className="cell label">Recommend for Dean's List</span>
            <span className="cell option">YES</span>
            <span className="cell checkbox"><input type="checkbox" checked={studentInfo?.gwa && studentInfo.gwa.value <= 1.5} disabled /></span>
            <span className="cell option">NO</span>
            <span className="cell checkbox"><input type="checkbox" checked={studentInfo?.gwa && studentInfo.gwa.value > 1.5} disabled /></span>
          </div>

          <div className="row">
            <span className="cell label">Recommend for Scholarship</span>
            {scholarshipOptions.map((percent) => (
              <span key={percent} className="cell">
                <button
                  className={`option-button ${selectedScholarship === percent ? 'selected' : ''}`}
                  onClick={() => setSelectedScholarship(percent)}
                  disabled
                >
                  {percent}%
                </button>
              </span>
            ))}
            {studentInfo?.gwa && (
              <span className="cell scholarship-remark">
                {getScholarshipRemark(studentInfo.gwa.value).remark}
              </span>
            )}
          </div>
        </div>

        {/* ======================== */}
        {/* SUBJECT ENROLLMENT TABLE */}
        {/* ======================== */}
        <div className="enrollment-table-container">
          <div className="student-course-info">
            <span>Subjects to be Enrolled</span>
            <br />
            <hr />
          </div>

          <table className="enrollment-table">
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Subject Title</th>
                <th>Units</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {enrollmentOptions.map((subject, index) => {
                const isSelected = selectedSubjects.some(s => s.subjectCode === subject.subjectCode);
                return (
                  <tr key={index}>
                    <td>{subject.subjectCode}</td>
                    <td>{subject.subjectName}</td>
                    <td>{subject.units}</td>
                    <td>
                      <button onClick={() => handleSelectSubject(subject)} disabled={isSelected}>
                        Select
                      </button>
                      <button onClick={() => handleDeselectSubject(subject)} disabled={!isSelected}>
                        Deselect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ======================== */}
        {/* ENROLLMENT ACTION BUTTON */}
        {/* ======================== */}
        <div className="action-bar">
          <button onClick={generatePDF} className="enroll-btn">
            Enroll & Download PDF
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdmPef;
