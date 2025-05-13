# ths is the summary of student enrollment


##  Objective


To demonstrate:
- Conditional logic for scholarship recommendation
- Looping through arrays to list subjects
- Creating readable console output


## student data
```python
cons student = {
name = "Juan Dela Cruz", 
ID: "2025-0001", 
gwa: 1.75, 
academicStanding: "Good Standing", 
units: 21, 
subject: 
"COMP101 - Introduction to programming"
"MATH101 - College Algebra"
"ENG101 - Communication Skills
"PE101 - Physical Fitness"
"NSTP101 - Civic Welfare Training"


function getScholarshipRecommendation(gwa) {
  return gwa <= 4.0 
    ? "Eligible for Academic Scholarship" 
    : "Scholarship";
}

def generate_enrollment_summary(student):
    print("Student Enrollment Summary\n")
    
    # Display student details
    print(f"Student Name: {student['name']}")
    print(f"Student ID: {student['id']}")
    print(f"General Weighted Average (GWA): {student['gwa']}")
    print(f"Academic Standing: {student['academicStanding']}")
    print(f"Total Units Selected: {student['units']}")
    
    # List the subjects
    print("Selected Subjects:")
    for subject in student['subjects']:
        print(f"- {subject}")
    
    # Display scholarship recommendation
    print(f"\nScholarship Recommendation: {get_scholarship_recommendation(student['gwa'])}")

# Example student data
student = {
    "name": "Juan Dela Cruz",
    "id": "2025-0001",
    "gwa": 1.75,
    "academicStanding": "Good Standing",
    "units": 21,
    "subjects": [
        "COMP101 – Introduction to Programming",
        "MATH101 – College Algebra",
        "ENG101 – Communication Skills",
        "PE101 – Physical Fitness",
        "NSTP101 – Civic Welfare Training"
    ]
}












# Student Enrollmen Summary
--------  
Explanation of Each component 
--------  
# 1. The student Object
const student = {
  name: "Juan Dela Cruz",
  
  id: "2025-0001",
  
  gwa: 1.75,
  
  academicStanding: "Good Standing",
  
  units: 21,
  
  subjects: 5, [
  
    "COMP101 â€“ Introduction to Programming",
    "MATH101 â€“ College Algebra",
    "ENG101 â€“ Communication Skills",
    "PE101 â€“ Physical Fitness",
    "NSTP101 â€“ Civic Welfare Training"
  ]
};
# Purpose 

Purpose:
This object holds the student's information, including:

Name: Full name of the student.

ID: Student identification number.

GWA: General Weighted Average â€“ used to determine academic performance.

AcademicStanding: Describes the current status of the student.

Units: Total academic units the student is enrolled in.

Subjects: An array (list) of subjects the student has enrolled in.



```

```bash
curriculum-checker.git
cd curriculum-checker
```
This is the table of student
```bash
student = {
  name: "Juan Dela Cruz",
  id: "2025-0001",
  gwa: 1.75,
  academicStanding: "Good Standing",
  units: 21,
  subjects: [
    "COMP101 â€“ Introduction to Programming",
    "MATH101 â€“ College Algebra",
    "ENG101 â€“ Communication Skills",
    "PE101 â€“ Physical Fitness",
    "NSTP101 â€“ Civic Welfare Training"
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


## Authors

- [@octokatherine](https://www.github.com/octokatherine)

