⚠️ **IMPORTANT**: This frontend project relies on a specific data structure from the backend API. To ensure proper communication and avoid CORS issues or data mismatch errors, the backend (e.g., Django) must match the structure and naming conventions of the following frontend constants:

_const [studentInfo, setStudentInfo] = useState(null);_

_const [evaluation, setEvaluation] = useState([]);_

_const [gwa, setGwa] = useState(null);_

_const [enrollSubjects, setEnrollSubjects] = useState([]);_

_const [selectedSubjects, setSelectedSubjects] = useState([]);_

_const [totalUnits, setTotalUnits] = useState(0);_

_const [selected, setSelected] = useState(null);_

_const options = [25, 50, 75, 100];_

These states are directly tied to the expected response format of the backend endpoints. Any mismatch in key names (e.g., studentInfo, gwa, enrollSubjects) or data types (array vs. object) may cause failures in rendering, data binding, or API consumption. Please ensure that:

API endpoints return JSON in the expected structure

Field names exactly match those used in this frontend

Arrays and objects are shaped according to frontend requirements

If these conditions are not met, you may encounter undefined errors, broken components, or CORS-related miscommunication due to malformed requests or unexpected responses.

**🚀 AdmPEF Component**
The AdmPEF component is part of the student enrollment system that allows administrators to manage and view student information, including their General Weighted Average (GWA), enrolled subjects, and academic standing. It also facilitates subject selection, scholarship recommendations, and subject enrollment. This component integrates with an API to fetch student data and provide interactive features.

**🌟 Key Features:**
_**Student Information Display:**_ The student's personal and academic information is fetched from the backend API, and displayed on the UI.

_**Evaluation Table:**_ Displays the student's subjects for the semester, along with their final grades and remarks.

_**General Weighted Average (GWA):**_ Shows the student's GWA and academic standing.

_**Scholarship Recommendation:**_ Based on the GWA, students may be recommended for various scholarship levels, with the possibility of approving or declining the recommendation.

**Subject Selection and Enrollment:** Admin can select and deselect subjects for the student while keeping track of the total academic units, with checks to ensure that the total units do not exceed the allowed limit.

_**Dynamic Feedback:**_ The application dynamically updates the UI to reflect changes in subject selection, scholarship remarks, and approval status.

**🛠️ Dependencies:**
**React:** The component is built using React and hooks (useState, useEffect).

**React Icons:** Icons are used for buttons and input fields, providing a more interactive UI.

**CSS Styling:** The component uses an external CSS file (AdmPEF.css) for styling the layout and UI elements.


**⚙️ How It Works:
State Management:**

**studentInfo:** Stores information about the student fetched from the backend.

**evaluation:** Stores the list of subjects and corresponding evaluations.

**gwa:** Stores the student's General Weighted Average (GWA).

**enrollSubjects:** Holds the subjects available for enrollment.

**selectedSubjects:** Tracks the subjects selected by the admin for enrollment.

**totalUnits:** Tracks the total units selected by the admin, ensuring that the total does not exceed the allowed limit for the student.

**selected:** Stores the selected scholarship percentage when the admin selects a scholarship option.

**Fetching Data:**

The **useEffect** hook fetches the data from an API (http://your-api.com/students/23-22-003/pef) on component mount.

The fetched data includes student information, evaluation records, GWA, and subjects available for enrollment. The state is updated accordingly.

**Scholarship Remark:**

The **getScholarshipRemark** function calculates and returns a scholarship percentage and remark based on the GWA value. It categorizes the student’s academic standing and recommends a scholarship.

**Subject Selection:**

The **handleSubjectSelection** function allows the admin to select subjects. It ensures that the total number of academic units does not exceed the limit. The limit is 30 units for 4th-year students and 24 units for other years.

The **handleSubjectDeselect** function allows deselecting subjects, recalculating the total units accordingly.

**Approval and Recommendation:**

The component provides radio buttons to approve or decline a student's academic standing (based on the GWA). It also enables the admin to recommend the student for the Dean’s List or scholarship.

**Dynamic Enrollment Table:**

A table displays the list of subjects that the admin can select. The table includes columns for the subject code, title, units, and buttons to select or deselect the subjects.

**Enrollment Action:**

At the bottom of the page, the admin has buttons to Enroll or Drop subjects, based on the selections.

**📡 Backend Integration:**
This component relies on an API to fetch the data required for rendering the student information, evaluation, and enrollment details. It is crucial that the backend API responds with a JSON structure that matches the expected format in the frontend (e.g., studentInfo, evaluation, gwa, enrollSubjects). Any mismatch between the backend response and frontend structure may lead to CORS issues or incorrect data rendering.

🔄 CORS Notice:
Ensure that the backend's CORS configuration allows cross-origin requests from the frontend domain to avoid any CORS-related issues during data fetching.
