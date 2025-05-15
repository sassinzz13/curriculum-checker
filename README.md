# 📘 Curriculum Checker API  
### 🧠 Handled by Backend Tech Lead: **Khristoferson Ortanez**

This project provides a backend API for managing **students**, **subjects**, and **grades** using Django REST Framework. The API is accessible both in local development and through a deployed instance on [Render](https://render.com).

---

## 🚀 Getting Started with Docker

To run this project locally using Docker:

```bash
docker-compose up --build
```
This will automatically run the Django development server via:  
```bash
python manage.py runserver
```
🔐 Authentication Endpoints  
✅ Hosted on Render  
Login:  
```https://curriculum-checker.onrender.com/accounts/api/login/```  
Signup:  
```https://curriculum-checker.onrender.com/accounts/api/signup/```  

🧪 Local Development  
Login:  
```http://localhost:8000/accounts/api/login/```  
   
Signup:   
```http://localhost:8000/accounts/api/signup/```   

📦 JSON Payload for Signup/Login
```json
{
    "username": "exampleuser",
    "password": "examplepass"
}
```


🧾 API Endpoints
| Action                 | URL (Hosted)                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| List/Create            | `https://curriculum-checker.onrender.com/api/students/`                                                |
| Retrieve/Update/Delete | `https://curriculum-checker.onrender.com/api/students/<studentid>/`                                    |

🧑‍🏫 Subjects (linked to students)   
| Action                            | URL (Hosted)                                                                                |
| --------------------------------- | ------------------------------------------------------------------------------------------- |
| List/Create by Student            | `https://curriculum-checker.onrender.com/api/students/<studentid>/subjects/`                |
| Retrieve/Update/Delete by Subject | `https://curriculum-checker.onrender.com/api/students/<studentid>/subjects/<subject_code>/` |

📝 Grades   
| Action                 | URL (Hosted)                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| List all grades        | `https://curriculum-checker.onrender.com/api/grades/`                                                  |
| List grades by student | `https://curriculum-checker.onrender.com/api/students/<studentid>/grades/`                             |

Replace <studentid> and <subject_code> with actual values from your data(ex. 24-01-002 for student id).  

🧪 Example JSON Payloads  
🔹 Create Student  
```json
{
    "studentid": "23-22-209",
    "firstname": "Khristoferson",
    "lastname": "Ortanez",
    "middlename": "Franco",
    "enrollmentyear": 2023,
    "curriculumid": 101,
    "curriculum": "BSIT",
    "studentnumber": 23-22-09
}
```
🔹 Create Subject  
```json
{
    "subjectcode": "CS101",
    "subjecttitle": "Introduction to Computer Science",
    "units": 3,
    "prerequisite": null,
    "semester": "1st",
    "yearlevel": 1
}
```

🔹 Create Grade  
```json
{
    "gradeid": 1,
    "studentid": "23-22-209",
    "subjectcode": "CS101",
    "semester": "1st",
    "grade": 1.75,
    "units": 3
}
```
🔄 Local vs Hosted API  
For local testing, simply replace the domain with:
```bash
http://localhost:8000
```
For example:  
```bash
http://localhost:8000/api/students/
```
✅ Notes
All write (POST/PUT/DELETE) operations require authenticated users.
The system follows a RESTful convention.
Endpoints are organized for maintainability and easy student-subject-grade linkage.

  
