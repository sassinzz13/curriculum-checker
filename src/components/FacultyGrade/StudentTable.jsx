import { useState, useEffect } from "react";
import "./StudentTable.css";

const StudentTable = ({ isEditable, searchStudentID }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (!searchStudentID) return;

    fetch(`http://localhost:8000/api/students/${searchStudentID}/grades/`)
      .then((res) => {
        if (!res.ok) throw new Error("Student not found");
        return res.json();
      })
      .then((data) => setStudents(data))
      .catch((err) => {
        console.error(err);
        setStudents([]);
      });
  }, [searchStudentID]);

  const handleInputChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);
  };

  const handleBlur = (index, field, value) => {
    const numericValue = Number(value);
    if (numericValue < 50 || numericValue > 100 || isNaN(numericValue)) {
      handleInputChange(index, field, "0");
    } else {
      handleInputChange(index, field, value);
    }
  };

  const handleKeyDown = (index, field, e) => {
    if (e.key === "Enter") {
      handleBlur(index, field, e.target.value);
    }
  };

  const calculateGWA = (student) => {
    const grades = ["prelims", "midterms", "semifinals", "finals"].map(field => Number(student[field]));
    const validGrades = grades.filter(g => !isNaN(g));
    return validGrades.length === 4 ? (validGrades.reduce((a, b) => a + b, 0) / 4).toFixed(2) : "N/A";
  };

  const saveGrades = async (student) => {
    const updatedStudent = {
      ...student,
      gwa: calculateGWA(student) !== "N/A" ? parseFloat(calculateGWA(student)) : null,
    };

    try {
      await fetch(`http://localhost:8000/api/students/${searchStudentID}/grades/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStudent),
      });
      console.log(`Saved grades for ${student.student_id}`);
    } catch (error) {
      console.error("Error updating grades:", error);
    }
  };

  useEffect(() => {
    const handleSave = () => {
      students.forEach(saveGrades);
    };

    const tableElement = document.getElementById("student-table-component");
    tableElement?.addEventListener("saveAllGrades", handleSave);
    return () => tableElement?.removeEventListener("saveAllGrades", handleSave);
  }, [students, searchStudentID]);

  if (!students.length) {
    return <div className="student-table-container">No grades found.</div>;
  }

  return (
    <div className="student-table-container" id="student-table-component">
      <h2 className="table-title">Evaluation Grades</h2>
      <table className="student-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Subject</th>
            <th>Prelims</th>
            <th>Midterms</th>
            <th>Semifinals</th>
            <th>Finals</th>
            <th>GWA</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.gradeid || index}>
              <td>{index + 1}</td>
              <td>{student.subjectcode}</td>
              {["prelims", "midterms", "semifinals", "finals"].map((field) => (
                <td key={field}>
                  <input
                    type="number"
                    value={student[field] || ""}
                    onChange={(e) => handleInputChange(index, field, e.target.value)}
                    onBlur={(e) => handleBlur(index, field, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, field, e)}
                    disabled={!isEditable}
                  />
                </td>
              ))}
              <td>{calculateGWA(student)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
