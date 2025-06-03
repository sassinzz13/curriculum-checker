import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import './FacultyGrade.css';

const FacultyGrade = () => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [subjectEvaluations, setSubjectEvaluations] = useState([]);
  const [searchStudentID, setSearchStudentID] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedGrades, setEditedGrades] = useState({});

  // Authorization modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState('');

  // Allowed passkeys
  const validPasskeys = ['143BCCS', '4321'];

  // Calculate live GWA and standing based on edited or original grades
  const calculateLiveGWA = () => {
    const gradesToUse = subjectEvaluations
      .map(subject => {
        const edited = editedGrades[subject.code];
        const grade = edited !== undefined && edited !== '' ? parseFloat(edited) : subject.grade;
        return grade;
      })
      .filter(g => !isNaN(g) && g >= 1.0 && g <= 5.0);

    if (gradesToUse.length === 0) return { value: null, standing: "N/A" };

    const total = gradesToUse.reduce((sum, curr) => sum + curr, 0);
    const avg = total / gradesToUse.length;
    const standing = avg >= 1.0 && avg <= 3.0 ? "GS" : "WS";

    return { value: avg, standing };
  };

  // Fetch student + evaluation data, and check localStorage for saved grades
  const handleSearch = async () => {
    if (!searchStudentID.trim()) {
      alert("Please enter a student ID.");
      return;
    }

    try {
      // Fetch student basic info
      const studentRes = await fetch(`http://localhost:8000/api/students/${searchStudentID}/`);
      if (!studentRes.ok) throw new Error('Failed to fetch student data');
      const student = await studentRes.json();

      if (!student || !student.studentid) {
        alert("Student not found.");
        return;
      }

      // Format student info
      const studentInfoFormatted = {
        id: student.studentid,
        name: `${student.firstname} ${student.middlename} ${student.lastname}`,
        college: student.curriculum,
        course: student.curriculum,
        year: new Date().getFullYear() - student.enrollmentyear + 1
      };

      // Fetch grades
      const gradesRes = await fetch(`http://localhost:8000/api/students/${searchStudentID}/grades/`);
      if (!gradesRes.ok) throw new Error('Failed to fetch grades data');
      const gradesData = await gradesRes.json();

      // Fetch subjects
      const subjectsRes = await fetch(`http://localhost:8000/api/students/${searchStudentID}/subjects/`);
      if (!subjectsRes.ok) throw new Error('Failed to fetch subjects data');
      const subjectsData = await subjectsRes.json();

      // Map subject codes to titles
      const subjectTitleMap = {};
      subjectsData.forEach(subj => {
        subjectTitleMap[subj.subjectcode] = subj.subjecttitle;
      });

      // Combine grades and subjects
      let evaluations = gradesData.map(item => {
        const grade = parseFloat(item.grade);
        return {
          code: item.subjectcode,
          title: subjectTitleMap[item.subjectcode] || "Unknown",
          grade,
          remarks: grade <= 3.0 ? "PASSED" : "FAILED"
        };
      });

      // Check if there are saved grades in localStorage for this student
      const savedGradesJSON = localStorage.getItem(`grades_${searchStudentID}`);
      if (savedGradesJSON) {
        try {
          const savedGrades = JSON.parse(savedGradesJSON);
          evaluations = evaluations.map(subject => {
            const savedGrade = savedGrades[subject.code];
            if (savedGrade !== undefined && savedGrade !== '') {
              const gradeNum = parseFloat(savedGrade);
              return {
                ...subject,
                grade: gradeNum,
                remarks: gradeNum <= 3.0 ? "PASSED" : "FAILED",
              };
            }
            return subject;
          });
        } catch (err) {
          console.warn("Failed to parse saved grades from localStorage", err);
        }
      }

      // Calculate GWA and academic standing
      const validGrades = evaluations.filter(e => e.grade >= 1.0 && e.grade <= 5.0);
      const totalGrades = validGrades.reduce((sum, curr) => sum + curr.grade, 0);
      const gwaValue = validGrades.length > 0 ? totalGrades / validGrades.length : null;
      const gwaStanding = gwaValue !== null
        ? (gwaValue >= 1.0 && gwaValue <= 3.0 ? "GS" : "WS")
        : "N/A";

      setStudentInfo({ ...studentInfoFormatted, grade: { value: gwaValue, standing: gwaStanding } });
      setSubjectEvaluations(evaluations);

      // Reset editing state and grades on new fetch
      setIsEditing(false);
      setEditedGrades({});
    } catch (err) {
      console.error('Error:', err);
      alert("Student data could not be retrieved.");
    }
  };

  // Handle input change when editing grades
  const handleGradeChange = (code, newGrade) => {
    if (
      newGrade === '' ||
      (/^\d*\.?\d*$/.test(newGrade) && Number(newGrade) >= 1.0 && Number(newGrade) <= 5.0)
    ) {
      setEditedGrades(prev => ({ ...prev, [code]: newGrade }));
    }
  };

  // Format the grade to 2 decimals on blur
  const handleGradeBlur = (code) => {
    setEditedGrades(prev => {
      const val = prev[code];
      if (val === undefined || val === '') return prev;

      let num = parseFloat(val);
      if (isNaN(num)) return prev;

      // Clamp between 1.00 and 5.00
      if (num < 1) num = 1;
      if (num > 5) num = 5;

      // Format to 2 decimals as string
      const formatted = num.toFixed(2);

      return { ...prev, [code]: formatted };
    });
  };

  // Save grades locally to localStorage instead of backend
  const saveGrades = async () => {
    try {
      // Build updated grades map for localStorage
      const updatedGradesMap = {};
      subjectEvaluations.forEach(subject => {
        const updatedGrade = editedGrades[subject.code];
        updatedGradesMap[subject.code] =
          updatedGrade !== undefined && updatedGrade !== ''
            ? parseFloat(updatedGrade).toFixed(2)
            : subject.grade.toFixed(2);
      });

      // Save to localStorage keyed by studentID
      localStorage.setItem(`grades_${searchStudentID}`, JSON.stringify(updatedGradesMap));

      // Update local state after save
      const newEvaluations = subjectEvaluations.map(subject => {
        const gradeStr = updatedGradesMap[subject.code];
        const grade = gradeStr !== undefined ? parseFloat(gradeStr) : subject.grade;
        return {
          code: subject.code,
          title: subject.title,
          grade,
          remarks: grade <= 3.0 ? "PASSED" : "FAILED",
        };
      });

      const validGrades = newEvaluations.filter(e => e.grade >= 1.0 && e.grade <= 5.0);
      const totalGrades = validGrades.reduce((sum, curr) => sum + curr.grade, 0);
      const gwaValue = validGrades.length > 0 ? totalGrades / validGrades.length : null;
      const gwaStanding = gwaValue !== null
        ? (gwaValue >= 1.0 && gwaValue <= 3.0 ? "GS" : "WS")
        : "N/A";

      setSubjectEvaluations(newEvaluations);
      setStudentInfo(prev => ({
        ...prev,
        grade: { value: gwaValue, standing: gwaStanding }
      }));

      setIsEditing(false);
      setEditedGrades({});
      alert("Grades successfully updated");
    } catch (error) {
      console.error(error);
      alert("Failed to save updated grades.");
    }
  };

  // Handle Edit/Save button click
  const handleEditSaveClick = () => {
    if (isEditing) {
      saveGrades();
    } else {
      setPasskeyInput('');
      setShowAuthModal(true);
    }
  };

  // Handle authorization passkey submission
  const handleAuthSubmit = () => {
    if (validPasskeys.includes(passkeyInput.trim())) {
      // Enable editing & preload grades
      const initialGrades = {};
      subjectEvaluations.forEach(subj => {
        initialGrades[subj.code] = subj.grade.toFixed(2);
      });
      setEditedGrades(initialGrades);
      setIsEditing(true);
      setShowAuthModal(false);
    } else {
      alert("Incorrect passkey. Please try again.");
    }
  };

  return (
    <div className="adm-pef-main">

      {/* SEARCH BAR + HEADER INFO */}
      <div className="student-search-container">
        <div className="top-bar">
          <input
            type="text"
            className="student-id-input"
            placeholder="Student ID..."
            value={searchStudentID}
            onChange={(e) => setSearchStudentID(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button className="search-btn" onClick={handleSearch}><FaSearch /></button>
        </div>
        <div className="info-bar">
          <span>1st Year Student Level</span>
          <span>1st Semester S.Y 2024-2025</span>
        </div>
      </div>

      <div className="adm-pef-main-container">

        {/* STUDENT PROFILE CARD */}
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

        {/* EVALUATION TABLE */}
        <div className="evaluation-container">
          <div
            className="evaluation-header"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div>
              <span>1st Semester</span> | <span>2024-2025</span>
            </div>
            <button className="edit-save-btn" onClick={handleEditSaveClick}>
              {isEditing ? 'Save' : 'Edit'}
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
                        value={editedGrades[subject.code] || ''}
                        onChange={(e) => handleGradeChange(subject.code, e.target.value)}
                        onBlur={() => handleGradeBlur(subject.code)}
                        style={{ width: '60px', textAlign: 'center' }}
                      />
                    ) : (
                      subject.grade.toFixed(2)
                    )}
                  </td>
                  <td className="remarks">
                    {isEditing
                      ? (() => {
                          const gradeStr = editedGrades[subject.code];
                          const gradeNum = gradeStr !== undefined && gradeStr !== '' ? parseFloat(gradeStr) : subject.grade;
                          return (gradeNum >= 1.0 && gradeNum <= 3.0) ? "PASSED" : "FAILED";
                        })()
                      : subject.remarks
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* GWA + ACADEMIC STANDING */}
        {studentInfo && (
          <div className="gwa-container">
            <table className="gwa-table">
              <tbody>
                <tr>
                  <td className="label">GENERAL WEIGHTED AVERAGE (GWA) :</td>
                  <td className="value highlight">
                    {isEditing
                      ? (calculateLiveGWA().value !== null ? calculateLiveGWA().value.toFixed(2) : 'N/A')
                      : (studentInfo.grade.value ? studentInfo.grade.value.toFixed(2) : 'N/A')}
                  </td>
                </tr>
                <tr>
                  <td className="label">ACADEMIC STANDING (GS OR WS) :</td>
                  <td className="value">
                    {isEditing
                      ? calculateLiveGWA().standing
                      : (studentInfo.grade.standing || 'N/A')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* AUTHORIZATION MODAL */}
      {showAuthModal && (
        <div className="modal-overlay" style={modalOverlayStyle}>
          <div className="modal-content" style={modalContentStyle}>
            <h3>Authorization Required</h3>
            <p>Please enter the passkey to enable editing:</p>
            <input
              type="password"
              value={passkeyInput}
              onChange={(e) => setPasskeyInput(e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
              placeholder="Enter passkey"
              onKeyDown={e => e.key === 'Enter' && handleAuthSubmit()}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setShowAuthModal(false)} style={modalButtonStyle}>Cancel</button>
              <button onClick={handleAuthSubmit} style={modalButtonStyle}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Inline styles for modal
const modalOverlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  width: '300px',
  boxShadow: '0 0 10px rgba(0,0,0,0.25)',
};

const modalButtonStyle = {
  padding: '8px 16px',
  cursor: 'pointer',
};

export default FacultyGrade;
