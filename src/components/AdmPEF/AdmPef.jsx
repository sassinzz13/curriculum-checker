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
      const studentRes = await fetch(`http://localhost:8000/api/students/${searchStudentID}/`);
      if (!studentRes.ok) throw new Error('Failed to fetch student data');
  
      const student = await studentRes.json();
      if (!student || !student.studentid) {
        alert("Student not found.");
        return;
      }
  
      // Format basic student info
      const studentInfoFormatted = {
        id: student.studentid,
        name: `${student.firstname} ${student.middlename} ${student.lastname}`,
        college: student.curriculum,
        course: student.curriculum,
        year: new Date().getFullYear() - student.enrollmentyear + 1
      };
  
      // Fetch grades
      const gradesRes = await fetch(`http://localhost:8000/api/students/${searchStudentID}/grades/`);
      const gradesData = await gradesRes.json();
  
      // Fetch subject titles
      const subjectsRes = await fetch(`http://localhost:8000/api/students/${searchStudentID}/subjects/`);
      const subjectsData = await subjectsRes.json();
  
      // Map subject code to title
      const subjectTitleMap = {};
      subjectsData.forEach(subj => {
        subjectTitleMap[subj.subjectcode] = subj.subjecttitle;
      });
  
      const evaluations = gradesData.map(item => {
        const grade = parseFloat(item.grade);
        return {
          code: item.subjectcode,
          title: subjectTitleMap[item.subjectcode] || "Unknown",
          grade,
          remarks: grade <= 3.0 ? "PASSED" : "FAILED"
        };
      });

      // Filter only valid grades (grade is a number between 1.0 and 5.0)
      const validGrades = evaluations.filter(e => e.grade >= 1.0 && e.grade <= 5.0);

      // Compute simple average
      const totalGrades = validGrades.reduce((sum, curr) => sum + curr.grade, 0);
      const gwaValue = validGrades.length > 0 ? totalGrades / validGrades.length : null;
      const gwaStanding = gwaValue !== null
        ? (gwaValue >= 1.0 && gwaValue <= 3.0 ? "GS" : "WS")
        : "N/A"; 
       
      setStudentInfo({ ...studentInfoFormatted, grade: { value: gwaValue, standing: gwaStanding } });
      setSubjectEvaluations(evaluations);
      setEnrollmentOptions(subjectsData);
      setSelectedSubjects([]);
      setTotalSelectedUnits(0);
  
    } catch (err) {
      console.error('Error:', err);
      alert("Student data could not be retrieved.");
    }
  };

  // -----------------------------
  // DETERMINE SCHOLARSHIP QUALIFICATION
  // -----------------------------

  const getScholarshipRemark = (gwaValue) => {
    if (gwaValue >= 1.0 && gwaValue <= 1.25) return { percentage: 100, remark: "Full Scholarship (President’s Lister)" };
    if (gwaValue > 1.25 && gwaValue <= 1.5) return { percentage: 75, remark: " High Merit Scholarship (DL)" };
    if (gwaValue > 1.5 && gwaValue <= 1.75) return { percentage: 50, remark: "Half Merit Scholarship" };
    if (gwaValue > 1.75 && gwaValue <= 2.0) return { percentage: 25, remark: "Qualified Scholarship" };
    return { percentage: 0, remark: "No scholarship" };
  };

  // -----------------------------
  // HANDLE SUBJECT SELECTION FOR ENROLLMENT
  // -----------------------------

  const handleSelectSubject = (subject) => {
    const maxUnits = studentInfo.year === 4 ? 30 : 24;
    const newTotal = totalSelectedUnits + subject.units;
    
  
    if (newTotal <= maxUnits) {
      // Prevent duplicates
      if (!selectedSubjects.some(s => s.subjectcode === subject.subjectcode)){
        setSelectedSubjects([...selectedSubjects, subject]);
        setTotalSelectedUnits(newTotal);
      }
    } else {
      alert(`You cannot select more than ${maxUnits} units.`);
    }
  };
  
  // Deselect a subject
  const handleDeselectSubject = (subject) => {
    const updatedSubjects = selectedSubjects.filter(s => s.subjectcode !== subject.subjectcode);
    setSelectedSubjects(updatedSubjects);
    const updatedTotal = updatedSubjects.reduce((sum, curr) => sum + curr.units, 0);
    setTotalSelectedUnits(updatedTotal);
  };

  // -----------------------------
  // GENERATE PDF FUNCTION
  // -----------------------------

  const generatePDF = () => {
    const doc = new jsPDF();
    let y = 20;
  
    doc.setFontSize(14);
    doc.text('Student Enrollment Summary', 20, y);
    y += 10;
  
    doc.setFontSize(12);
    doc.text(`Student Name: ${studentInfo?.name}`, 20, y); y += 10;
    doc.text(`Student ID: ${studentInfo?.id}`, 20, y); y += 10;
    doc.text(`General Weighted Average (GWA): ${studentInfo?.grade?.value?.toFixed(2) || 'N/A'}`, 20, y); y += 10;
    doc.text(`Academic Standing: ${studentInfo?.grade?.standing}`, 20, y); y += 10;
    doc.text(`Scholarship Recommendation: ${getScholarshipRemark(studentInfo?.grade?.value).remark}`, 20, y); y += 15;
  
    doc.setFontSize(13);
    doc.text(`Selected Subjects (Total Units: ${totalSelectedUnits}):`, 20, y);
    y += 10;
  
    // Table headers
    doc.setFontSize(12);
    doc.text('Code', 20, y);
    doc.text('Title', 50, y);
    doc.text('Units', 180, y, { align: 'right' });
    y += 8;
  
    // Subject list
    selectedSubjects.forEach(subject => {
      if (y > 270) { // new page if needed
        doc.addPage();
        y = 20;
      }
      doc.text(subject.subjectcode, 20, y);
      doc.text(subject.subjecttitle, 50, y);
      doc.text(subject.units.toString(), 180, y, { align: 'right' });
      y += 8;
    });
  
    // Save the file
    const safeName = studentInfo?.name?.replace(/[^a-z0-9]/gi, '_') || 'student';
    doc.save(`${safeName}_enrollment_summary.pdf`);
  };

  // -----------------------------
// Filter Subjects: Only show untaken subjects
  const takenSubjectCodes = new Set(
    subjectEvaluations
      .filter(e => e.remarks === 'PASSED') // exclude only passed subjects
      .map(e => e.code.trim().toUpperCase())
  );

  const takenTitles = new Set(
    subjectEvaluations
      .filter(e => e.remarks === 'PASSED')
      .map(e => e.title.trim().toUpperCase())
  );

  const uniqueSubjects = [];
  const seenTitles = new Set();

  for (const subject of enrollmentOptions) {
    const normalizedCode = subject.subjectcode.trim().toUpperCase();
    const normalizedTitle = subject.subjecttitle.trim().toUpperCase();

    if (
      !seenTitles.has(normalizedTitle) &&
      !takenSubjectCodes.has(normalizedCode) &&
      !takenTitles.has(normalizedTitle)
    ) {
      uniqueSubjects.push(subject);
      seenTitles.add(normalizedTitle);
    }
  }
  

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
          <span>1st Year Student Level</span>
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
                <th>Final Grade</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {subjectEvaluations.map((subject, index) => (
                <tr key={index}>
                  <td className='sub-code'>{subject.code}</td>
                  <td>{subject.title}</td>
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
        {studentInfo?.grade && (
          <div className="gwa-container">
            <table className="gwa-table">
              <tbody>
                <tr>
                  <td className="label">GENERAL WEIGHTED AVERAGE (GWA) :</td>
                  <td className="value highlight">{studentInfo?.grade?.value ? studentInfo.grade.value.toFixed(2) : 'N/A'}</td>
                </tr>
                <tr>
                  <td className="label">ACADEMIC STANDING (GS OR WS) :</td>
                  <td className="value">{studentInfo?.grade?.standing || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* ======================== */}
        {/* APPROVAL STATUS (Read-only) */}
        {/* ======================== */}
        <span className="std-status">Student Status</span>
        <div className="approval">
          <label className="radio-option">
            <input type="radio" name="approval" value="approve" checked={studentInfo?.grade && studentInfo.grade.value <= 3.0} disabled />
            <span className="radio-label">Regular</span>
          </label>
          <label className="radio-option">
            <input type="radio" name="approval" value="decline" checked={studentInfo?.grade && studentInfo.grade.value > 3.0} disabled />
            <span className="radio-label">Irregular</span>
          </label>
        </div>

        {/* ======================== */}
        {/* AWARDS + SCHOLARSHIP */}
        {/* ======================== */}
        <div className="awards-container">
          <div className="row">
            <span className="cell label">Recommend for Dean's List</span>
            <span className="cell option">YES</span>
            <span className="cell checkbox"><input type="checkbox" checked={studentInfo?.grade && studentInfo.grade.value <= 1.5} disabled /></span>
            <span className="cell option">NO</span>
            <span className="cell checkbox"><input type="checkbox" checked={studentInfo?.grade && studentInfo.grade.value > 1.5} disabled /></span>
          </div>

          <div className="row">
            <span className="cell label">Recommend for Scholarship</span>
            {scholarshipOptions.map((percent) => (
              <span key={percent} className="cell">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={getScholarshipRemark(studentInfo?.grade?.value || 0).percentage === percent}
                    disabled
                  />
                  {percent}%
                </label>
              </span>
            ))}
            {studentInfo?.grade && (
              <span className="cell scholarship-remark">
                {getScholarshipRemark(studentInfo.grade.value).remark}
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
              {uniqueSubjects.map((subject, index) => {
                const isSelected = selectedSubjects.some(s => s.subjectcode === subject.subjectcode);

                const handleCheckboxChange = (e) => {
                  if (e.target.checked) {
                    handleSelectSubject(subject);
                  } else {
                    handleDeselectSubject(subject);
                  }
                };

                return (
                  <tr key={index}>
                    <td>{subject.subjectcode}</td>
                    <td>{subject.subjecttitle}</td>
                    <td>{subject.units}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={handleCheckboxChange}
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
          </table>
          <div className="total-units-bar">
            <strong>Total Units Selected:</strong> {totalSelectedUnits}
          </div>
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
