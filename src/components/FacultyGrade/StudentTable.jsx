import { useState, useEffect } from "react";
import "./StudentTable.css"; 

const StudentTable = () => {
  const [students, setStudents] = useState([]);

 
  useEffect(() => {
    fetch("https://your-api.com/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error(err));
  }, []);


  const handleInputChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);
  };


  const saveGrades = async (student) => {
    try {
      await fetch(`https://your-api.com/students/${student.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });
      alert("Grades updated successfully!");
    } catch (error) {
      console.error("Error updating grades:", error);
    }
  };

  return (
    <div className="student-table-container">
      <h2 className="table-title">Class Information</h2>
      <table className="student-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Student Name</th>
            <th>Student Number</th>
            <th>Prelims</th>
            <th>Midterms</th>
            <th>Finals</th>
            <th>GWA</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.id}>
              <td>{index + 1}</td>
              <td>{student.name}</td>
              <td>{student.student_number}</td>
              <td>
                <input
                  type="number"
                  value={student.prelims || ""}
                  onChange={(e) => handleInputChange(index, "prelims", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={student.midterms || ""}
                  onChange={(e) => handleInputChange(index, "midterms", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={student.finals || ""}
                  onChange={(e) => handleInputChange(index, "finals", e.target.value)}
                />
              </td>
              <td>{student.gwa || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
