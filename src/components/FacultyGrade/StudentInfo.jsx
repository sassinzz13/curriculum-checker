// StudentInfo.jsx
import React from "react";
import "./StudentInfo.css";

const StudentInfo = ({ student }) => {
  return (
    <div className="student-info">
      <h2>Student Information</h2>
      <p><strong>Name:</strong> {student.firstname} {student.middlename} {student.lastname}</p>
      <p><strong>Student ID:</strong> {student.studentid}</p>
      <p><strong>Student Number:</strong> {student.studentnumber}</p>
      <p><strong>Department:</strong> {student.curriculum.department}</p>
      <p><strong>Course:</strong> {student.curriculum.course}</p>
      <p><strong>Block:</strong> {student.curriculum.block}</p>
    </div>
  );
};

export default StudentInfo;
