import React, { useState, useEffect } from 'react';
import { FaBars, FaSearch, FaPrint } from 'react-icons/fa';
import './AdmPEF.css';

const AdmPEF = () => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [evaluation, setEvaluation] = useState([]);
  const [gwa, setGwa] = useState(null);
  const [enrollSubjects, setEnrollSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [totalUnits, setTotalUnits] = useState(0);
  const [selected, setSelected] = useState(null);
  const options = [25, 50, 75, 100];

  const getScholarshipRemark = (gwaValue) => {
    if (gwaValue >= 1.0 && gwaValue <= 1.25) return { percentage: 100, remark: "Full scholarship (President’s Lister)" };
    if (gwaValue > 1.25 && gwaValue <= 1.5) return { percentage: 75, remark: "High academic achiever" };
    if (gwaValue > 1.5 && gwaValue <= 1.75) return { percentage: 50, remark: "Academic achiever" };
    if (gwaValue > 1.75 && gwaValue <= 2.0) return { percentage: 25, remark: "Qualified scholar" };
    return { percentage: 0, remark: "No scholarship" };
  };

  useEffect(() => {

    const fetchPEFData = async () => {
      try {
        const response = await fetch('http://your-api.com/students/23-22-003/pef');
        if (!response.ok) throw new Error('Failed to fetch PEF data');
        const data = await response.json();
        
        setStudentInfo(data.student);
        setEvaluation(data.evaluation);
        setGwa(data.gwa);
        setEnrollSubjects(data.enrollSubjects);
      } catch (err) {
        console.error('Error fetching PEF data:', err);
      }
    };

    fetchPEFData();
  }, []);

  const handleSubjectSelection = (subject) => {
    const currentTotalUnits = totalUnits + subject.units;
    const maxUnits = studentInfo.year === 4 ? 30 : 24;

    if (currentTotalUnits <= maxUnits) {
      setSelectedSubjects([...selectedSubjects, subject]);
      setTotalUnits(currentTotalUnits);
    } else {
      alert(`You cannot select more than ${maxUnits} units.`);
    }
  };

  const handleSubjectDeselect = (subject) => {
    const updatedSelectedSubjects = selectedSubjects.filter(s => s.subjectCode !== subject.subjectCode);
    setSelectedSubjects(updatedSelectedSubjects);
    setTotalUnits(updatedSelectedSubjects.reduce((acc, curr) => acc + curr.units, 0));
  };

  return (
    <div className="adm-pef-main">
      <div className="student-search-container">
        <div className="top-bar">
          <button className="print-btn"><FaPrint /></button>
          <input type="text" className="student-id-input" placeholder="Student ID..." />
          <button className="search-btn"><FaSearch /></button>
        </div>
        <div className="info-bar">
          <span>2nd Year Student Level</span>
          <span>1st Semester S.Y 2024-2025</span>
        </div>
      </div>

      <div className="adm-pef-main-container">
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
              {evaluation.map((subject, index) => (
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

        {gwa && (
          <div className="gwa-container">
            <table className="gwa-table">
              <tbody>
                <tr>
                  <td className="label">GENERAL WEIGHTED AVERAGE (GWA) :</td>
                  <td className="value highlight">{gwa.value.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="label">ACADEMIC STANDING (GS OR WS) :</td>
                  <td className="value">{gwa.standing}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div className="approval">
          <label className="radio-option">
            <input type="radio" name="approval" value="approve" checked={gwa && gwa.value <= 3.0} disabled />
            <span className="radio-label">Approve</span>
          </label>
          <label className="radio-option">
            <input type="radio" name="approval" value="decline" checked={gwa && gwa.value > 3.0} disabled />
            <span className="radio-label">Decline</span>
          </label>
        </div>

        <div className="awards-container">
          <div className="row">
            <span className="cell label">Recommend for Dean's List</span>
            <span className="cell option">YES</span>
            <span className="cell checkbox"><input type="checkbox" checked={gwa && gwa.value <= 1.5} disabled /></span>
            <span className="cell option">NO</span>
            <span className="cell checkbox"><input type="checkbox" checked={gwa && gwa.value > 1.5} disabled /></span>
          </div>

          <div className="row">
            <span className="cell label">Recommend for Scholarship</span>
            {options.map((percent) => (
              <span key={percent} className="cell">
                <button
                  className={`option-button ${selected === percent ? 'selected' : ''}`}
                  onClick={() => setSelected(percent)} disabled
                >
                  {percent}%
                </button>
              </span>
            ))}
            {gwa && (
              <span className="cell scholarship-remark">
                {getScholarshipRemark(gwa.value).remark}
              </span>
            )}
          </div>
        </div>

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
              {enrollSubjects.map((subject, index) => (
                <tr key={index}>
                  <td>{subject.subjectCode}</td>
                  <td>{subject.subjectName}</td>
                  <td>{subject.units}</td>
                  <td>
                    <button 
                      onClick={() => handleSubjectSelection(subject)} 
                      disabled={selectedSubjects.some(s => s.subjectCode === subject.subjectCode)}>
                      Select
                    </button>
                    <button 
                      onClick={() => handleSubjectDeselect(subject)} 
                      disabled={!selectedSubjects.some(s => s.subjectCode === subject.subjectCode)}>
                      Deselect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2" className="total-label">Total Academic Units:</td>
                <td className="total-units-highlight">{totalUnits}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="enrollment-btn">
          <button className="enroll-btn">Enroll</button>
          <button className="drop-btn">Drop</button>
        </div>
      </div>
    </div>
  );
};

export default AdmPEF;
