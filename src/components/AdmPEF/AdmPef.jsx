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
  const [evaluationTables, setEvaluationTables] = useState([]);


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
  const [isEditing, setIsEditing] = useState(false);
  const [editedGrades, setEditedGrades] = useState({});
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState('');
  const validPasskeys = ['143BCCS', '4321'];

  const [isGradesFinalized, setIsGradesFinalized] = useState(false);
  const [secondSemEvaluations, setSecondSemEvaluations] = useState([]);



  // -----------------------------
  // FETCH STUDENT + EVALUATION DATA
  // -----------------------------
  const handleSearch = async () => {
    if (!searchStudentID) {
      return;
    }
  
    try {
      const studentRes = await fetch(`http://localhost:8000/api/students/${searchStudentID}/`);
      if (!studentRes.ok) throw new Error('Failed to fetch student data');
  
      const student = await studentRes.json();
      if (!student || !student.studentid) {
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
  
// Build evaluations from grades and subjectTitleMap
const getRandomGrade = () => {
  // Generate a random grade between 1.0 and 3.0 with 1 decimal place
  return parseFloat((Math.random() * 2 + 1).toFixed(1));
};

const evaluations = gradesData.map(gradeEntry => {
  let parsedGrade = parseFloat(gradeEntry.finalgrade);

  // Fallback: Use random grade if parsed is NaN or out of bounds
  if (isNaN(parsedGrade) || parsedGrade < 1.0 || parsedGrade > 5.0) {
    parsedGrade = getRandomGrade();
  }

  return {
    code: gradeEntry.subjectcode,
    title: subjectTitleMap[gradeEntry.subjectcode] || 'Unknown Subject',
    grade: parsedGrade,
    remarks: parsedGrade <= 3.0 ? "PASSED" : "FAILED"
  };
});




// Load saved grades from localStorage
const savedGradesJSON = localStorage.getItem(`grades_${searchStudentID}`);
if (savedGradesJSON) {
  try {
    const savedGrades = JSON.parse(savedGradesJSON);
    evaluations.forEach(subject => {
      const saved = savedGrades[subject.code];
      if (saved !== undefined) {
        const parsedGrade = parseFloat(saved);
        subject.grade = parsedGrade;
        subject.remarks = parsedGrade <= 3.0 ? "PASSED" : "FAILED";
      }
    });
  } catch (err) {
    console.warn("Invalid saved grades data", err);
  }
}



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

  const calculateLiveGWA = () => {
  const gradesToUse = subjectEvaluations.map(subject => {
    const edited = editedGrades[subject.code];
    const grade = edited !== undefined && edited !== '' ? parseFloat(edited) : subject.grade;
    return grade;
  }).filter(g => !isNaN(g) && g >= 1.0 && g <= 5.0);

  if (gradesToUse.length === 0) return { value: null, standing: "N/A" };

  const total = gradesToUse.reduce((sum, curr) => sum + curr, 0);
  const avg = total / gradesToUse.length;
  const standing = avg <= 3.0 ? "GS" : "WS";

  return { value: avg, standing };
};

  // -----------------------------
  // HANDLE SUBJECT SELECTION FOR ENROLLMENT
  // -----------------------------

  const handleSelectSubject = (subject) => {
    const maxUnits = studentInfo.year === 4 ? 33 : 27;
    const newTotal = totalSelectedUnits + subject.units;
    
  
    if (newTotal <= maxUnits) {
      // Prevent duplicates
      if (!selectedSubjects.some(s => s.subjectcode === subject.subjectcode)){
        setSelectedSubjects([...selectedSubjects, subject]);
        setTotalSelectedUnits(newTotal);
      }
    }
  };
  
  // Deselect a subject
  const handleDeselectSubject = (subject) => {
    const updatedSubjects = selectedSubjects.filter(s => s.subjectcode !== subject.subjectcode);
    setSelectedSubjects(updatedSubjects);
    const updatedTotal = updatedSubjects.reduce((sum, curr) => sum + curr.units, 0);
    setTotalSelectedUnits(updatedTotal);
  };

const handleEnroll = () => {
  try {
    if (selectedSubjects.length === 0) {
      return;
    }

    const newEvaluations = selectedSubjects.map(subject => ({
      code: subject.subjectcode,
      title: subject.subjecttitle,
      grade: null,
      remarks: "N/A"
    }));

    setEvaluationTables(prev => [...prev, newEvaluations]);

    const updatedEnrollmentOptions = enrollmentOptions.filter(
      subj => !selectedSubjects.some(sel => sel.subjectcode === subj.subjectcode)
    );

    setEnrollmentOptions(updatedEnrollmentOptions);
    setSelectedSubjects([]);
    setTotalSelectedUnits(0);
  } catch (error) {
    console.error("Error in handleEnroll:", error);
  }
};




 const handleGradeChange = (code, newGrade) => {
  // Allow empty input or numbers between 1.0 and 5.0 (including decimals)
  if (
    newGrade === '' ||
    (/^\d*\.?\d*$/.test(newGrade) && Number(newGrade) >= 1.0 && Number(newGrade) <= 5.0)
  ) {
    setEditedGrades(prev => ({ ...prev, [code]: newGrade }));
  }
};

const handleGradeBlur = (code) => {
  setEditedGrades(prev => {
    const val = prev[code];
    if (val === undefined || val === '') return prev;

    let num = parseFloat(val);
    if (isNaN(num)) return prev;

    // Clamp the number between 1 and 5
    num = Math.min(Math.max(num, 1), 5);

    return { ...prev, [code]: num.toFixed(2) };
  });
};

const saveGrades = () => {
  try {
    // Function to update an evaluations array based on editedGrades
    const updateEvaluations = (evaluations) => {
      return evaluations.map(subject => {
        const updatedStr = editedGrades[subject.code];
        const grade = updatedStr !== undefined ? parseFloat(updatedStr) : subject.grade;

        return {
          ...subject,
          grade,
          remarks: grade <= 3.0 ? "PASSED" : "FAILED"
        };
      });
    };

    // Update both semesters if needed
    const updatedFirstSem = updateEvaluations(subjectEvaluations);
    const updatedSecondSem = updateEvaluations(secondSemEvaluations);

    // Combine all valid grades to compute GWA
    const allGrades = [...updatedFirstSem, ...updatedSecondSem]
      .filter(e => e.grade >= 1.0 && e.grade <= 5.0)
      .map(e => e.grade);

    const total = allGrades.reduce((sum, g) => sum + g, 0);
    const gwa = allGrades.length ? total / allGrades.length : null;

    // Save grades to localStorage (you can customize key if you want to save both semesters)
    localStorage.setItem(`grades_${searchStudentID}`, JSON.stringify(editedGrades));

    // Update state
    setSubjectEvaluations(updatedFirstSem);
    setSecondSemEvaluations(updatedSecondSem);

    setStudentInfo(prev => ({
      ...prev,
      grade: {
        value: gwa,
        standing: gwa !== null ? (gwa <= 3.0 ? "GS" : "WS") : "N/A"
      }
    }));

    setIsEditing(false);
    setEditedGrades({});
  } catch (err) {
    console.error("Error saving grades:", err);
  }
};

const handleEditSaveClick = () => {
  if (isEditing) {
    saveGrades();
  } else {
    setPasskeyInput('');
    setShowAuthModal(true);
  }
};


const handleAuthSubmit = () => {
  if (validPasskeys.includes(passkeyInput.trim())) {
    const initial = {};
    subjectEvaluations.forEach(subj => {
      initial[subj.code] = subj.grade.toFixed(2);
    });
    setEditedGrades(initial);
    setIsEditing(true);
    setShowAuthModal(false);
  }
};


  // -----------------------------
  // GENERATE PDF FUNCTION
  // -----------------------------
const generatePDF = () => {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(14);
  doc.text('Student Grade Evaluation Report', 20, y);
  y += 10;

  doc.setFontSize(12);
  doc.text(`Student Name: ${studentInfo?.name || 'N/A'}`, 20, y); y += 10;
  doc.text(`Student ID: ${studentInfo?.id || 'N/A'}`, 20, y); y += 10;
  doc.text(`General Weighted Average (GWA): ${studentInfo?.grade?.value?.toFixed(2) || 'N/A'}`, 20, y); y += 10;
  doc.text(`Academic Standing: ${studentInfo?.grade?.standing || 'N/A'}`, 20, y); y += 10;
  doc.text(`Scholarship Recommendation: ${getScholarshipRemark(studentInfo?.grade?.value).remark || 'N/A'}`, 20, y); y += 15;

  doc.setFontSize(13);
  doc.text('Evaluated Subjects:', 20, y);
  y += 10;

  // Table headers
  doc.setFontSize(12);
  doc.text('Code', 20, y);
  doc.text('Title', 60, y);
  doc.text('Grade', 150, y);
  doc.text('Remarks', 180, y);
  y += 8;

  // Flatten and render evaluation tables
  const flattenedSubjects = subjectEvaluations;

  flattenedSubjects.forEach(subject => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.text(subject.code || '-', 20, y);
    doc.text(subject.title || '-', 60, y);
    doc.text(subject.grade !== null ? subject.grade.toString() : '-', 150, y);
    doc.text(subject.remarks || '-', 180, y);
    y += 8;
  });

  const safeName = studentInfo?.name?.replace(/[^a-z0-9]/gi, '_') || 'student';
  doc.save(`${safeName}_grade_evaluation.pdf`);
};


  // -----------------------------
// Filter Subjects: Only show untaken subjects
// Get all enrolled subject codes and titles (regardless of remarks)
const enrolledSubjectCodes = new Set(
  subjectEvaluations.map(e => e.code.trim().toUpperCase())
);
const enrolledSubjectTitles = new Set(
  subjectEvaluations.map(e => e.title.trim().toUpperCase())
);

const uniqueSubjects = [];
const seenTitles = new Set();

for (const subject of enrollmentOptions) {
  const normalizedCode = subject.subjectcode.trim().toUpperCase();
  const normalizedTitle = subject.subjecttitle.trim().toUpperCase();

  if (
    !seenTitles.has(normalizedTitle) &&
    !enrolledSubjectCodes.has(normalizedCode) &&
    !enrolledSubjectTitles.has(normalizedTitle)
  ) {
    uniqueSubjects.push(subject);
    seenTitles.add(normalizedTitle);
  }
}

const handleGradeInputChange = (tableIndex, subjectIndex, value) => {
  if (isGradesFinalized) return;

  const updatedTables = [...evaluationTables];
  const parsed = parseFloat(value);
  updatedTables[tableIndex][subjectIndex].grade = isNaN(parsed) ? null : parsed;
  updatedTables[tableIndex][subjectIndex].remarks = parsed <= 3.0 ? "PASSED" : "FAILED";
  setEvaluationTables(updatedTables);
};

const handleGradeInputBlur = (tableIndex, subjectIndex) => {
  if (isGradesFinalized) return;

  const updatedTables = [...evaluationTables];
  const subject = updatedTables[tableIndex][subjectIndex];

  if (subject.grade !== null) {
    let grade = parseFloat(subject.grade);
    if (grade < 1) grade = 1;
    if (grade > 5) grade = 5;
    subject.grade = grade.toFixed(2);
    subject.remarks = grade <= 3.0 ? "PASSED" : "FAILED";
    setEvaluationTables(updatedTables);
  }
};

const calculateGWAForLatestBatch = (tables) => {
  if (!tables.length) return null;

  const latestBatch = tables[tables.length - 1];

  const gradedSubjects = latestBatch.filter(
    subj => subj.grade !== null && !isNaN(subj.grade) && subj.grade >= 1 && subj.grade <= 5
  );

  if (gradedSubjects.length === 0) return null;

  const total = gradedSubjects.reduce((sum, subj) => sum + parseFloat(subj.grade), 0);
  return total / gradedSubjects.length;
};

const latestGWA = calculateGWAForLatestBatch(evaluationTables);
const latestStanding = latestGWA !== null ? (latestGWA <= 3.0 ? "GS" : "WS") : null;

const handleFinalizeGrades = () => {
  const flattenedNewSubjects = evaluationTables.flat().filter(s => s.grade !== null);

  const parsedSubjects = flattenedNewSubjects.map(subject => {
    const parsedGrade = parseFloat(subject.grade);
    const grade = isNaN(parsedGrade) ? 5.0 : parsedGrade;
    return {
      code: subject.code,
      title: subject.title,
      grade: grade,
      remarks: grade <= 3.0 ? "PASSED" : "FAILED"
    };
  });

  setSecondSemEvaluations(parsedSubjects); // Store separately, not merged

  // Recalculate GWA using both semesters
  const allGrades = [...subjectEvaluations, ...parsedSubjects];
  const validGrades = allGrades.filter(e => e.grade >= 1.0 && e.grade <= 5.0);
  const total = validGrades.reduce((sum, g) => sum + g.grade, 0);
  const gwa = validGrades.length ? total / validGrades.length : null;

  setStudentInfo(prev => ({
    ...prev,
    grade: {
      value: gwa,
      standing: gwa <= 3.0 ? "GS" : "WS"
    }
  }));

  setIsGradesFinalized(true);
};

// State for 2nd sem grades
const [secondSemEditedGrades, setSecondSemEditedGrades] = useState({});

useEffect(() => {
  if (!searchStudentID) return;

  const saved2nd = localStorage.getItem(`grades_2ndSem_${searchStudentID}`);

  if (saved2nd) {
    const parsed = JSON.parse(saved2nd);
    setSecondSemEvaluations(prev =>
      prev.map(subj => {
        const savedGrade = parsed[subj.code];
        return {
          ...subj,
          grade: savedGrade ? parseFloat(savedGrade) : subj.grade,
          remarks: savedGrade && parseFloat(savedGrade) <= 3 ? "PASSED" : "FAILED"
        };
      })
    );
  } else {
    // 👇 Clear 2nd sem evaluations if no saved grades found
    setSecondSemEvaluations([]);
  }

  // Reset editing state too
  setSecondSemEditedGrades({});
}, [searchStudentID]);





// Save 2nd sem grades when saving
const saveSecondSemGrades = () => {
  const updatedGrades = {};
  secondSemEvaluations.forEach(subject => {
    const updated = secondSemEditedGrades[subject.code];
    updatedGrades[subject.code] = updated !== undefined ? parseFloat(updated).toFixed(2) : subject.grade.toFixed(2);
  });

  localStorage.setItem(`grades_2ndSem_${searchStudentID}`, JSON.stringify(updatedGrades));

  const newEvaluations = secondSemEvaluations.map(subject => {
    const gradeStr = updatedGrades[subject.code];
    const grade = parseFloat(gradeStr);
    return {
      ...subject,
      grade,
      remarks: grade <= 3.0 ? "PASSED" : "FAILED"
    };
  });

  setSecondSemEvaluations(newEvaluations);
  setSecondSemEditedGrades({});
  setIsEditing(false);
};



  return (
    <div className="adm-pef-main">

      {/* ======================== */}
      {/* SEARCH BAR + HEADER INFO */}
      {/* ======================== */}
      <div className="student-search-container">
        <div className='logout-container'>
          <button className="logout-btn" onClick={() => window.location.href = '/'}>Logout</button>
        </div>
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
{/* EVALUATION TABLES        */}
{/* ======================== */}

{/* 1st Semester */}
<div className="evaluation-container">
  <h2 className="evaluation-title">EVALUATION</h2>
  <div className="evaluation-header">
    <span>1st Semester</span>
    <span>2024-2025</span>
  </div>
  <div className="edit-grades-bar">
    <button onClick={handleEditSaveClick}>
      {isEditing ? "Save Grades" : "Edit Grades"}
    </button>
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
          <td>
            {isEditing ? (
              <input
                type="text"
                value={editedGrades[subject.code] ?? subject.grade.toFixed(2)}
                onChange={(e) => handleGradeChange(subject.code, e.target.value)}
                onBlur={() => handleGradeBlur(subject.code)}
                className="grade-input"
              />
            ) : (
              subject.grade.toFixed(2)
            )}
          </td>
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

{/* 2nd Semester */}
{secondSemEvaluations.length > 0 && (
  <div className="evaluation-container-2nd">
    <div className="evaluation-header">
      <span>2nd Semester</span>
      <span>2024-2025</span>
    </div>
    <table className="evaluation-table-2nd">
      <thead>
        <tr>
          <th className='sub-code1'>Sub. Code</th>
          <th>Subject Title</th>
          <th>Final Grade</th>
          <th>Remarks</th>
        </tr>
      </thead>
      <tbody>
        {secondSemEvaluations.map((subject, index) => (
          <tr key={index}>
            <td className='sub-code'>{subject.code}</td>
            <td>{subject.title}</td>
            <td>
              {isEditing ? (
                <input
                  type="text"
                  value={secondSemEditedGrades[subject.code] ?? subject.grade.toFixed(2)}
                  onChange={(e) => handleSecondSemGradeChange(subject.code, e.target.value)}
                  onBlur={() => handleSecondSemGradeBlur(subject.code)}
                  className="grade-input"
                  inputMode="decimal"
                  pattern="[0-9]*"
                />
              ) : (
                subject.grade.toFixed(2)
              )}
            </td>            
            <td className="remarks">{subject.remarks}</td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* ================= GWA and Status Section ================= */}
    <div className="gwa-container">
      <table className="gwa-table">
        <tbody>
          <tr>
            <td className="label">GENERAL WEIGHTED AVERAGE (GWA) :</td>
            <td className="value highlight">
              {calculateGWAForLatestBatch(evaluationTables) !== null
                ? calculateGWAForLatestBatch(evaluationTables).toFixed(2)
                : 'N/A'}
            </td>
          </tr>
          <tr>
            <td className="label">ACADEMIC STANDING (GS OR WS) :</td>
            <td className="value">
              {calculateGWAForLatestBatch(evaluationTables) !== null
                ? (calculateGWAForLatestBatch(evaluationTables) <= 3.0 ? "GS" : "WS")
                : 'N/A'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <span className="std-status">Student Status</span>
    <div className="approval">
      <label className="radio-option">
        <input
          type="radio"
          name="approval-latest"
          value="approve"
          checked={latestGWA !== null && latestGWA <= 3.0}
          disabled
        />
        <span className="radio-label">Regular</span>
      </label>
      <label className="radio-option">
        <input
          type="radio"
          name="approval-latest"
          value="decline"
          checked={latestGWA !== null && latestGWA > 3.0}
          disabled
        />
        <span className="radio-label">Irregular</span>
      </label>
    </div>

    <div className="awards-container">
      <div className="row">
        <span className="cell label">Recommend for Dean's List </span>
        <span className="cell option">YES</span>
        <span className="cell checkbox">
          <input type="checkbox" checked={latestGWA !== null && latestGWA <= 1.5} disabled />
        </span>

        <span className="cell option">NO</span>
        <span className="cell checkbox">
          <input type="checkbox" checked={latestGWA !== null && latestGWA > 1.5} disabled />
        </span>
      </div>

      <div className="row">
        <span className="cell label">Recommend for Scholarship </span>
        {scholarshipOptions.map((percent) => (
          <span key={`latest-${percent}`} className="cell">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={latestGWA !== null && getScholarshipRemark(latestGWA).percentage === percent}
                disabled
              />
              {percent}%
            </label>
          </span>
        ))}
        {latestGWA !== null && (
          <span className="cell scholarship-remark">
            {getScholarshipRemark(latestGWA).remark}
          </span>
        )}
      </div>
    </div>
  </div>
)}


{!isGradesFinalized && (
  <>
    <div className="enrolled-table">
      <h2 className="enrolled-title">Enrolled Subjects</h2>
      {evaluationTables.map((table, index) => (
        <div key={index}>
          <h3>2nd Sem Subjects</h3>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Grade</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {table.map((subject, idx) => (
                <tr key={idx}>
                  <td>{subject.code}</td>
                  <td>{subject.title}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.01"
                      value={subject.grade !== null ? subject.grade : ""}
                      onChange={(e) => handleGradeInputChange(index, idx, e.target.value)}
                      onBlur={() => handleGradeInputBlur(index, idx)}
                      disabled={isGradesFinalized}
                      style={{ width: "60px" }}
                    />
                  </td>
                  <td>{subject.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>

    {evaluationTables.length > 0 && (
      <div className="finalize-grades-bar">
        <button onClick={handleFinalizeGrades}>Finalize Grades</button>
      </div>
    )}

    {/* GWA container based on latest batch only */}
    <div className="gwa-container">
      <table className="gwa-table">
        <tbody>
          <tr>
            <td className="label">GENERAL WEIGHTED AVERAGE (GWA) :</td>
            <td className="value highlight">
              {calculateGWAForLatestBatch(evaluationTables) !== null
                ? calculateGWAForLatestBatch(evaluationTables).toFixed(2)
                : 'N/A'}
            </td>
          </tr>
          <tr>
            <td className="label">ACADEMIC STANDING (GS OR WS) :</td>
            <td className="value">
              {calculateGWAForLatestBatch(evaluationTables) !== null
                ? (calculateGWAForLatestBatch(evaluationTables) <= 3.0 ? "GS" : "WS")
                : 'N/A'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* ========== Latest Batch Status (Read-only) ========== */}
    <span className="std-status">Student Status</span>
    <div className="approval">
      <label className="radio-option">
        <input
          type="radio"
          name="approval-latest"
          value="approve"
          checked={latestGWA !== null && latestGWA <= 3.0}
          disabled
        />
        <span className="radio-label">Regular</span>
      </label>
      <label className="radio-option">
        <input
          type="radio"
          name="approval-latest"
          value="decline"
          checked={latestGWA !== null && latestGWA > 3.0}
          disabled
        />
        <span className="radio-label">Irregular</span>
      </label>
    </div>

    {/* ========== Latest Batch Awards + Scholarship ========== */}
    <div className="awards-container">
      <div className="row">
        <span className="cell label">Recommend for Dean's List </span>
        <span className="cell option">YES</span>
        <span className="cell checkbox">
          <input type="checkbox" checked={latestGWA !== null && latestGWA <= 1.5} disabled />
        </span>

        <span className="cell option">NO</span>
        <span className="cell checkbox">
          <input type="checkbox" checked={latestGWA !== null && latestGWA > 1.5} disabled />
        </span>
      </div>

      <div className="row">
        <span className="cell label">Recommend for Scholarship </span>
        {scholarshipOptions.map((percent) => (
          <span key={`latest-${percent}`} className="cell">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={latestGWA !== null && getScholarshipRemark(latestGWA).percentage === percent}
                disabled
              />
              {percent}%
            </label>
          </span>
        ))}
        {latestGWA !== null && (
          <span className="cell scholarship-remark">
            {getScholarshipRemark(latestGWA).remark}
          </span>
        )}
      </div>
    </div>
  </>
)}




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
              <div className="action-bar">
                <button onClick={handleEnroll} disabled={selectedSubjects.length === 0}>
                  Enroll Selected Subjects
                </button>

                <button onClick={generatePDF} disabled={!studentInfo}>
                  Generate Enrollment PDF
                </button>
              </div>
          </div>


      </div>
        {showAuthModal && (
        <div className="auth-modal">
          <div className="auth-box">
            <h3>Enter Passkey to Edit Grades</h3>
            <input
              type="password"
              value={passkeyInput}
              onChange={(e) => setPasskeyInput(e.target.value)}
              placeholder="Passkey..."
            />
            <button onClick={handleAuthSubmit}>Submit</button>
            <button onClick={() => setShowAuthModal(false)}>Cancel</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdmPef;
