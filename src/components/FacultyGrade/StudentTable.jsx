import { useState, useEffect } from "react";
import "./StudentTable.css";

const StudentTable = ({ isEditable }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("https://curriculum-checker.onrender.com/api/students/")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error(err));
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);
  };

  const handleBlur = (index, field, value) => {
    const numericValue = Number(value);
    if (numericValue < 50 || numericValue > 100 || isNaN(numericValue)) {
      handleInputChange(index, field, "0"); // Reset to empty string if not valid
    } else {
      handleInputChange(index, field, value);
    }
  };

  const handleKeyDown = (index, field, e) => {
    if (e.key === "Enter") {
      const value = e.target.value;
      const numericValue = Number(value);
      if (numericValue < 50 || numericValue > 100 || isNaN(numericValue)) {
        handleInputChange(index, field, "0");
      } else {
        handleInputChange(index, field, value);
      }
    }
  };

  const calculateGWA = (student) => {
    const { prelims, midterms, semifinals, finals } = student;
    const grades = [prelims, midterms, semifinals, finals].map(Number);
    const validGrades = grades.filter((g) => !isNaN(g));
    if (validGrades.length === 4) {
      return (validGrades.reduce((a, b) => a + b, 0) / 4).toFixed(2);
    }
    return "N/A";
  };

  const saveGrades = async (student) => {
    const updatedStudent = {
      ...student,
      gwa: calculateGWA(student) !== "N/A" ? parseFloat(calculateGWA(student)) : null,
    };

    try {
      await fetch(`https://curriculum-checker.onrender.com/api/students/${student.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStudent),
      });
      console.log(`Saved grades for ${student.student_name}`);
    } catch (error) {
      console.error("Error updating grades:", error);
    }
  };

  // Listen for "saveAllGrades" event
  useEffect(() => {
    const handleSave = () => {
      students.forEach((student) => {
        saveGrades(student);
      });
    };

    const tableElement = document.getElementById("student-table-component");
    tableElement?.addEventListener("saveAllGrades", handleSave);

    return () => {
      tableElement?.removeEventListener("saveAllGrades", handleSave);
    };
  }, [students]);

  return (
    <div className="student-table-container" id="student-table-component">
      <h2 className="table-title">Class Information</h2>
      <table className="student-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Block</th>
            <th>Professor</th>
            <th>Prelims</th>
            <th>Midterms</th>
            <th>Semifinals</th>
            <th>Finals</th>
            <th>GWA</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.id}>
              <td>{index + 1}</td>
              <td><input type="text" value={student.student_id || ""} disabled /></td>
              <td><input type="text" value={student.student_name || ""} disabled /></td>
              <td><input type="text" value={student.student_section || ""} disabled /></td>
              <td><input type="text" value={student.professor_name || ""} disabled /></td>
              {["prelims", "midterms", "semifinals", "finals"].map((field) => (
                <td key={field}>
                  <input
                    type="number"
                    value={student[field] || ""}
                    onChange={(e) => handleInputChange(index, field, e.target.value)}
                    onBlur={(e) => handleBlur(index, field, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, field, e)}
                    disabled={!isEditable}
                    style={{
                      appearance: "none",
                      MozAppearance: "textfield",
                      WebkitAppearance: "none",
                    }}
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
