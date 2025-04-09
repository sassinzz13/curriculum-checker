# 🎓 Curriculum DBMS 

## 🗃️ Database Structure

### 👤 Student
- `StudentID` (computed): Format `yy-cc-nnn`
- `EnrollmentYear`
- `CurriculumID` (FK)
- `StudentNumber` (auto-incremented)

### 📘 Subject
- `Code` (PK)
- `Title`
- `Units`

### 📚 Curriculum
- `CurriculumID` (PK)
- `ProgramName`
- `SchoolYear`

### 🔄 Prerequisite
- Composite PK: (`CourseCode`, `PrerequisiteCode`)
- Both reference `Subject(Code)`

### 📘 Semester
- `SemesterID` (PK)
- `SemesterName`

### 📘 Course Offering
- `OfferingID` (PK)
- `CourseCode` (FK)
- `CurriculumID` (FK)
- `YearLevelID` (FK)
- `SemesterID` (FK)
