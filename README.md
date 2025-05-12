# Welcome to the Curriculum checker  
--------  
#### How to install  
```

```bash
curriculum-checker.git
cd curriculum-checker
```
This is the table of student
```bash
const student = {
  name: "Juan Dela Cruz",
  id: "2025-0001",
  gwa: 1.75,
  academicStanding: "Good Standing",
  units: 21,
  subjects: [
    "COMP101 – Introduction to Programming",
    "MATH101 – College Algebra",
    "ENG101 – Communication Skills",
    "PE101 – Physical Fitness",
    "NSTP101 – Civic Welfare Training"
  ]
};

function getScholarshipRecommendation(gwa) {
  return gwa <= 2.0 ? "Eligible for Academic Scholarship" : "No Scholarship";
}

function generateEnrollmentSummary(student) {
  console.log("Student Enrollment Summary\n");
  console.log(`Student Name: ${student.name}`);
  console.log(`Student ID: ${student.id}`);
  console.log(`General Weighted Average (GWA): ${student.gwa}`);
  console.log(`Academic Standing: ${student.academicStanding}`);
  console.log(`Total Units Selected: ${student.units}`);
  console.log("Selected Subjects:");
  student.subjects.forEach(subj => console.log(`- ${subj}`));
  console.log(`\nScholarship Recommendation: ${getScholarshipRecommendation(student.gwa)}`);
}

generateEnrollmentSummary(student);
```