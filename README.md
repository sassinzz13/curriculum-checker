# Welcome to the Curriculum checker 

To run please run docker first with the following command:  
```docker-compose up -d --build```  
then it will automatically run djangos `python manage.py runserver`  

to fetch the endpoints follow the following:  
#### Login:  
```http://localhost:8000/accounts/api/login/```
#### Signup:  
```http://localhost:8000/accounts/api/signup/```  
example json format for login and signup:  
```
{
    "username": "testinglang2",
    "password": "tumetesting2"
}
```

to fetch the endpoints for editing and create and delete:  
#### Create, Put(edit), Delete:  
```http://localhost:8000/api/students/```  
example json:  
```
{
  "student_id": "23-22-210",
  "student_name": "John Ortanez",
  "student_section": "IT-21",
  "professor_name": "Rejan Tadeo"
}
```
